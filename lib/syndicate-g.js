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

function SyndicateG(config) {
    this.config = config;
}

_.extend(SyndicateG.prototype, {

    fetch: function(profile, options, callback) {
        callback = callback ? callback : options;

        var url = 'https://www.googleapis.com/plus/v1/people/' + profile + '/activities/public?maxResults=3';
        url += '&key=' + this.config.gplus.apiKey;

        console.log(url);

        request(url, function (error, response, body) {
            var data;
            if (!error && response.statusCode == 200) {
                data = body;
                console.log(body) // Print the google web page.
            }
            callback && callback(error, data);
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