/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */
"use strict";

var _ = require('underscore')._;

var config;
var redisCli;

/**
 * Exports
 */
module.exports = function(config) {
  return {
    open: function(options) {
      redisCli = require('redis').createClient(config.db.redis_port, config.db.redis_host);
      config.db.redis_secret && redisCli.auth(config.db.redis_secret);

      redisCli.on('error', function (err) {
        console.log(err);
      });
    },

    close: function() {
      redisCli && redisCli.quit();
    },

    put: function(key, value, callback) {
      redisCli.set(key, value, callback);
    },

    get: function(key, callback) {
      redisCli.get(key, function(err, value) {
        if (value == null) {
          callback({notFound: true}, null);
          return;
        }
        callback(err, value);
      });
    },

    delete: function(key, callback) {
      redisCli.del(key, callback);
    }
  };
}
