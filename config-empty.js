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
    host: process.env.SYNG_SERVER_IP || '127.0.0.1',
    port: parseInt(process.env.SYNG_SERVER_PORT) || 8008
  },
  /**
  * Storage settings
  */
  db: {
    /**
     * Allowed types are 'redis' or 'memcache'.
     * When using redis, make sure the redis configurations below are filled in.
     */
    type: process.env.SYNG_DB_TYPE || 'memcache',

    redis_host: process.env.SYNG_REDIS_HOST || '127.0.0.1',
    redis_port: process.env.SYNG_REDIS_PORT || '6379',
    redis_secret: process.env.SYNG_REDIS_PASSWORD || null
  },
  /**
  * GPlus settings
  */
  gplus: {
    apiKey: process.env.SYNG_GOOGLE_API_KEY || '',
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
