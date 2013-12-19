/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */
"use struct";

var _ = require('underscore')._;
var request = require('request');
var RSS = require('rss');

/**
 * Generate ATOM feed from G+ json data
 * @param  {String} G+ posts json
 * @param  {String} G+ profile json
 * @return {String} xml 
 */
function generateRSS(postsRAW, profileRAW) {
    json = JSON.parse(postsRAW);
    jsonProfile = JSON.parse(profileRAW);

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

function SyndicateG(config) {
    this.config = config;
}

_.extend(SyndicateG.prototype, {

    fetch: function(profile, options, callback) {
        callback = callback ? callback : options;
        var self = this;

        var url = 'https://www.googleapis.com/plus/v1/people/' + profile + '/activities/public?maxResults=3';
        url += '&key=' + this.config.gplus.apiKey;

        // TODO: refactor with Promises

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var jsonRAW = body;
                url = 'https://www.googleapis.com/plus/v1/people/' + profile;
                url += '?key=' + self.config.gplus.apiKey;

                request(url, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var data = generateRSS(jsonRAW, body);
                        callback && callback(error, data);
                    } else {
                        callback && callback(error);
                    }
                });

            } else {
                callback && callback(error);
            }
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
module.exports.create = function(config) {
    return new SyndicateG(config);
};