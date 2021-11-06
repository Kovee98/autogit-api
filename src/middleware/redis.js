const config = require('../config.js');
const session = require('express-session');
const nodeRedis = require('redis');
const RedisStore = require('connect-redis')(session);

// create redis client (node-redis)
const client = nodeRedis.createClient({
    ...config.redis
});
// client.on('error', (err) => console.log('Redis Client Error', err));

// express-session config
const redis = session({
    name: 'ag_sid',
    store: new RedisStore({ client }),
    secret: config.cookieKey,
    cookie: {
        maxAge: config.maxAge,
        secure: config.secureCookies
    },
    rolling: true,
    // resave: false,
    resave: true,
    saveUninitialized: false,
});

module.exports = redis;
