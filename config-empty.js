/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */

var config = {
    isDebug: false,
    /**
     * Server connection
     */
    server: {
        url: '',
        port: 8080
    },
    /**
     * GPlus settings
     */
    gplus: {
        apiKey: "",
        maxResults: 10,
    },
    /**
     * Feed generation options
     */
    rss: {
        ttl: 60
    }    
};

module.exports = config;