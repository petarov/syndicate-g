/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */
"use struct";

var _ = require('underscore')._;

function Persistence(config) {

}

_.extend(Persistence.prototype, {

    open: function(path, options) {

    },

    close: function() {

    },

    create: function(profile) {

    },

    read: function() {

    },

    update: function() {

    },

    delete: function() {

    }
    
});

/**
 * Exports
 */
// module.exports.Persistence = Persistence;
module.exports.create = function(config) {
    return new Persistence(config);
};