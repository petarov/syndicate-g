/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */

var config = {
    isDebug: false,

    server: {
        url: '',
        port: 8080
    },

    db: {
        path: './data.ldb'
    },

    gplus: {
        apiKey: "",
        maxResults: 10,
    }
};

module.exports = config;