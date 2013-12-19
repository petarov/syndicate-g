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
var Persistence = require('../lib/persistence')(config);

/**
 * Generate ATOM feed from G+ json data
 * @param  {String} G+ posts json
 * @param  {String} G+ profile json
 * @return {String} xml 
 */
function generateRSS(postsRAW, profileRAW) {
    var json = JSON.parse(postsRAW);
    var jsonProfile = JSON.parse(profileRAW);

    var feed = new RSS({
        title: 'Google Plus Feed for ' + jsonProfile.displayName, // TODO
        description: json.title,
        feed_url: 'http://example.com/rss.xml', // TODO
        site_url: jsonProfile.url,
        image_url: jsonProfile.image.url || '',
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
            callback && callback(error, body);    
        }
    });
}

function SyndicateG() {
    this.persistence = Persistence.create();
    this.persistence.open(config.db.path);
}
_.extend(SyndicateG.prototype, {

    fetch: function(profile, options, callback) {
        callback = callback ? callback : options;

        // TODO: refactor with Promises
        req('/activities/public', profile, {'maxResults': 3}, function(error, body) {
            if (error) {
                callback && callback(error);
                return;
            }

            var jsonRAW = body;

            req('', profile, function(error, body) {
                if (error) {
                    callback && callback(error);
                    return;
                }

                var data = generateRSS(jsonRAW, body);
                callback && callback(error, data);
            });
        });
    },

    deleteCache: function(profile) {

    },

    clearCache: function() {

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
