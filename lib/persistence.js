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

function Persistence() {
  console.log('*** DB Type - [%s]', config.db.type);

  this.client = config.db.type === 'redis' ?
    require('./cache/redis')(config) : require('./cache/memcache.js')(config);
}

_.extend(Persistence.prototype, {

  open: function(options) {
    this.client.open(options);
  },

  close: function() {
    this.client.close();
  },

  put: function(key, value, callback) {
      this.client.put(key, value, callback);
  },

  get: function(key, callback) {
    this.client.get(key, callback);
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
