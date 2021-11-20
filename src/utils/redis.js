const config = require('../config.js');
const nodeRedis = require('redis');

// create redis client (node-redis)
const client = nodeRedis.createClient({
    ...config.redis
});
// client.on('error', (err) => console.log('Redis Client Error', err));

module.exports = client;
