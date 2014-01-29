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

function Persistence(config) {
    this.client = undefined; // explicit
}
_.extend(Persistence.prototype, {

    open: function(options) {
        this.client = require("redis").createClient(config.db.redis_port, config.db.redis_host);
        config.db.redis_secret && this.client.auth(config.db.redis_secret);

        this.client.on("error", function (err) {
            console.log(err);
        });        
    },

    close: function() {
        this.client && this.client.quit();
    },

    put: function(key, value, callback) {
        this.client.set(key, value, callback);
    },

    get: function(key, callback) {
        this.client.get(key, function(err, value) {
            if (value == null) {
                callback({notFound: true}, null);
                return;
            }
            callback(err, value);
        });
    },

    delete: function(key, callback) {
        this.client.del(key, callback);
    }
});

/**
 * Exports
 */
module.exports = function(_config) {
    config = _config;
    return {
        create: function() {
            return new Persistence();
        }
    };
}
