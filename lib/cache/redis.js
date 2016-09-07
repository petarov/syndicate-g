/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */
"use strict";

var _ = require('underscore')._;
var Redis = require('redis');

var cli;

/**
 * Exports
 */
module.exports = function(config) {
  return {
    open: function(options) {
      cli = Redis.createClient(config.db.redis_port, config.db.redis_host);
      config.db.redis_secret && cli.auth(config.db.redis_secret);

      cli.on('error', function (err) {
        console.log(err);
      });
    },

    close: function() {
      cli && cli.quit();
    },

    put: function(key, value, callback) {
      cli.set(key, value, callback);
    },

    get: function(key, callback) {
      cli.get(key, function(err, value) {
        if (value == null) {
          callback({notFound: true}, null);
          return;
        }
        callback(err, value);
      });
    },

    delete: function(key, callback) {
      cli.del(key, callback);
    }
  };
}
