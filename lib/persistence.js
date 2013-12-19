/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */
"use strict";

var _ = require('underscore')._;
var levelup = require('levelup'); //TODO: replace with ...maybe PoachDB?

function Persistence() {
    this.db = undefined; // explicit
}
_.extend(Persistence.prototype, {

    open: function(path, options) {
        if (!this.db || !this.db.isOpen()) {
            this.db = levelup(path, {
                createIfMissing: true
            });
        }
    },

    close: function() {
        this.db && this.db.close();
    },

    put: function(key, value, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }        
        this.db.put(key, value, options, callback);
    },

    get: function(key, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        return this.db.get(key, options, callback);
    },

    delete: function(key, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }        
        this.db.del(key, options, callback);
    }

});

/**
 * Exports
 */
// module.exports.Persistence = Persistence;
module.exports = function() {
    return {
        create: function() {
            return new Persistence();
        }
    };
}
