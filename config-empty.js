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
        host: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
        port: parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080
    },
    /**
     * Storage settings
     */
    db: {
        redis_host: process.env.OPENSHIFT_REDIS_HOST || '127.0.0.1',
        redis_port: process.env.OPENSHIFT_REDIS_PORT || '6379',
        redis_secret: process.env.REDIS_PASSWORD || null
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