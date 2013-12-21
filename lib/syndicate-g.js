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
var Persistence = require('./persistence')(config);

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
        title: 'Google Plus Feed for ' + jsonProfile.displayName, // TODO
        description: json.title,
        feed_url: 'http://example.com/rss.xml', // TODO
        site_url: jsonProfile.url,
        image_url: jsonProfile.image ? jsonProfile.image.url || '' : '',
        author: jsonProfile.displayName,
        copyright: jsonProfile.displayName,
        language: 'en',
        categories: ['public'],
        pubDate: json.updated,
        ttl: '60'
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
    this.persistence.open(config.db.path);

    this.fetchCache = function(profile, callback) {
        self.persistence.get('feed_' + profile, function(err, value) {
            if (err && err.notFound) {
                callback && callback(err);
                return;
            }
            //TODO: handle other (non-notFound) errs

            console.log('cache hit for %s', profile);
            callback && callback(null, value);
        });
    }
}
_.extend(SyndicateG.prototype, {

    fetch: function(profile, options, callback) {
        callback = callback ? callback : options;
        var self = this;

        this.fetchCache(profile, function(err, xml) {
            if (err) {
                // fetch from Google+
                req('/activities/public', profile, {'maxResults': config.gplus.maxResults}, function(error, body) {
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

                        var data = generateRSS(body, _rawPosts);
                        // cache generated feed (async => skip callback)
                        self.persistence.put('feed_' + profile, data);
                        // tell caller we're done
                        callback && callback(error, data);
                    });
                });

            } else {
                callback && callback(null, xml);
            }
        });
    },

    deleteCache: function(profile, callback) {
        this.persistence.delete('feed_' + profile, function(err) {
            if (err) {
                // TODO: fund out what exactly the err obj from levelup returns here
                callback && callback({code: 500, message: 'Error removing profile data. Profile not found!?'});
            } else {
                callback && callback();
            }
            
        });
    },

    clearCache: function() {
        //TODO
    }
    
});

/**
 * Exports
 */
module.exports = function(_config) {
    config = _config;
    return {
        create: function() {
            return new SyndicateG();
        }
    };
}
