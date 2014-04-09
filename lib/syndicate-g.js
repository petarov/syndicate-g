/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */
"use strict";

var config;
var _ = require('underscore')._;
var request = require('request');
var RSS = require('rss');
var Persistence; 

/**
 * Generate ATOM feed from G+ json data
 * @param  {String} G+ profile json
 * @param  {String} G+ posts json
 * @return {String} xml 
 */
function generateRSS(profileRAW, postsRAW) {
    var json = JSON.parse(postsRAW);
    var jsonProfile = JSON.parse(profileRAW);

    var feed = new RSS({
        title: jsonProfile.displayName + ' Google Plus Feed',
        description: json.title,
        feed_url: config.server.url + '/' + jsonProfile.id,
        site_url: jsonProfile.url,
        image_url: jsonProfile.image ? jsonProfile.image.url || '' : '',
        author: jsonProfile.displayName,
        copyright: jsonProfile.displayName,
        language: 'en',
        categories: ['public'],
        pubDate: json.updated,
        ttl: config.rss.ttl // number of minutes the feed can stay cached before refreshing it from the source.
    });

    for (var i = 0; i < json.items.length; i++) {
        var item = json.items[i];
        feed.item({
            title: item.title,
            description: item.content,
            url: item.url,
            guid: item.id,
            categories: ['public'],
            author: item.actor.displayName,
            date: item.updated, // item.published
        });        
    };

    // cache the xml to send to clients
    return feed.xml();
}

function req(res, profile, options, callback) {
    callback = callback ? callback : options;

    var url = 'https://www.googleapis.com/plus/v1/people/' + profile + res;
    url += '?key=' + config.gplus.apiKey;

    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            url += '&' + key + '=' + options[key];
        }
    }

    if (config.isDebug)
        console.log(url);

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback && callback(null, body);
        } else {
            if (config.isDebug)
                console.log(body);

            var parsedBody = JSON.parse(body);
            callback && callback(error || {message: parsedBody.error.message, code: parsedBody.error.code}, body);
        }
    });
}

function SyndicateG() {
    var self = this;
    this.persistence = Persistence.create();
    this.persistence.open();

    this.fetchCachedFeed = function(profile, options, callback) {

        var profileKey = this.getKey(profile, options);

        self.persistence.get('feed_' + profileKey, function(err, value) {
            if (err && err.notFound) {
                callback && callback(err);
                return;
            }
            //TODO: handle other (non-notFound) errs
            
            console.log('cache hit for %s', profileKey);
            callback && callback(null, value);

            // fetch feed again if expired
            self.persistence.get('updated_' + profileKey, function(err, value) {
                if (err && err.notFound) {
                    // we don't care
                    return;
                }

                var now = Date.now();
                var expires = Math.floor(value) + config.rss.ttl * 1000 * 60;
                
                if (config.isDebug) {
                    console.log('%s exp: %d', profileKey, expires);
                    console.log('%s now: %d', profileKey, now);
                }

                if (expires < now) {
                    console.log(profileKey + ' data expired. fetching ...')
                    self.fetchFeed(profileKey, options);
                } 
            });
        });
    }
    this.fetchFeed = function(profile, options, callback) {
        req('/activities/public', profile, {'maxResults': options.maxResults || 20}, function(error, body) {
            if (error) {
                callback && callback(error);
                return;
            }

            var _rawPosts = body;

            req('', profile, function(error, body) {
                if (error) {
                    callback && callback(error);
                    return;
                }

                var profileKey = self.getKey(profile, options);

                var updated = Date.now();
                var xml = generateRSS(body, _rawPosts);
                // cache generated feed (async => skip callback)
                self.persistence.put('feed_' + profileKey, xml);
                self.persistence.put('updated_' + profileKey, updated);
                // tell caller we're done
                callback && callback(error, xml);
            });
        });
    }
    this.getKey = function(profile, options) {
        var key = profile;
        if (options && options.maxResults)
            key += '__MAX' + options.maxResults;
        return key;
    }

}
_.extend(SyndicateG.prototype, {

    fetch: function(profile, options, callback) {
        callback = callback ? callback : options;
        var self = this;

        this.fetchCachedFeed(profile, options, function(err, xml) {
            if (err) {
                // fetch from Google+
                self.fetchFeed(profile, options, function(error, xml) {
                    callback && callback(error, xml);
                });
            } else {
                callback && callback(null, xml);
            }
        });
    },

    deleteCache: function(profile, callback) {
        var self = this;

        this.persistence.delete('feed_' + profile, function(err) {
            if (err) {
                // TODO: fund out what exactly the err obj from levelup returns here
                callback && callback({code: 500, message: 'Error removing profile data. Profile not found!?'});
            } else {
                self.persistence.delete('updated_' + profile); // not critical
                callback && callback();
            }
            
        });
    },

    clearCache: function() {
        //TODO: clear everything
    }
    
});

/**
 * Exports
 */
module.exports = function(_config) {
    config = _config;
    
    Persistence = require('./persistence')(config);

    return {
        create: function() {
            return new SyndicateG();
        }
    };
}
