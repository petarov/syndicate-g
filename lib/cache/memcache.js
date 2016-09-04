/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Petar Petrov
 */
"use strict";

var config;
var _ = require('underscore')._;

/**
 * Exports
 */
module.exports = function(_config) {
  config = _config;

  return {
    open: function(options) {

    },

    close: function() {
    },

    put: function(key, value, callback) {
    },

    get: function(key, callback) {

    },

    delete: function(key, callback) {
    }
  };
}
