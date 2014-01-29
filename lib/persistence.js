/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */
"use strict";

var _ = require('underscore')._;

function Persistence() {
    this.client = undefined; // explicit
}
_.extend(Persistence.prototype, {

    open: function(path, options) {
        if (process.env.REDISTOGO_URL) {
            // redis @heroku.prod
            var rtg   = require("url").parse(process.env.REDISTOGO_URL);
            this.client = require("redis").createClient(rtg.port, rtg.hostname);
            this.client.auth(rtg.auth.split(":")[1]);
        } else {
            // redis @dev
            this.client = require('redis').createClient();
        }        
    },

    close: function() {
        this.client && this.client.quit();
    },

    put: function(key, value, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }        
        this.client.set(key, value, callback);
    },

    get: function(key, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        this.client.get(key, function(err, value) {
            if (value == null) {
                callback({notFound: true}, null);
                return;
            }
            callback(err, value);
        });
    },

    delete: function(key, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        this.client.del(key, callback);
    }
});

/**
 * Exports
 */
module.exports = function() {
    return {
        create: function() {
            return new Persistence();
        }
    };
}
