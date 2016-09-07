/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Petar Petrov
 */
"use strict";

var _ = require('underscore')._;
var cli = require('memory-cache');

/**
 * Exports
 */
module.exports = function(_config) {
  return {
    open: function(options) {
      console.log('*** memcache loaded.');
    },

    close: function() {
    },

    put: function(key, value, callback) {
      cli.put(key, value);
    },

    get: function(key, callback) {
      var value = cli.get(key);
      if (value) {
        callback(null, value);
      } else {
        callback({notFound: true}, null);
      }
    },

    delete: function(key, callback) {
      cli.del(key);
      callback(null);
    }
  };
}
