const config = require('../config.js');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const client = require('../utils/redis.js');

// express-session config
const redis = session({
    name: 'notella_sid',
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
