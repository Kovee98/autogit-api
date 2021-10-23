const express = require('express');

const server = {
    init () {
        // create express server
        const app = express();
        
        // middleware
        app.use(express.json());
        
        // endpoints
        app.get('/ping', function (req, res) {
            return res.json({ ok: true });
        });
        
        app.get('/auth', require('./endpoints/auth.js'));
        
        // start listening on port
        app.listen(4000);
    }
}

module.exports = server;
