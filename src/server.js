const config = require('./config.js');
const express = require('express');
const helmet = require('helmet');
const redis = require('./middleware/redis.js');
const passport = require('./middleware/passport.js');
const cors = require('./middleware/cors.js');
const protect = require('./middleware/protect.js');

const server = {
    init () {
        // create express server
        const app = express();

        // middleware
        app.use(express.json());
        app.use(cors);
        app.use(helmet());
        app.use(redis);
        app.use(passport.initialize());
        app.use(passport.session());

        // endpoints
        app.get('/ping', (req, res) => res.json({ ok: true }));

        app.get('/session', (req, res) => {
            console.log('isAuthenticated:', req.isAuthenticated());
            res.json({ ok: true, authenticated: req.isAuthenticated() });
        });

        app.get('/login', passport.authenticate('github'));

        app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: `${config.redirectUrl}/login` }), (req, res) => {
            console.log('Successfully authenticated!');
            // req.logIn()
            res.redirect(`${config.redirectUrl}/dashboard`);
        });

        app.get('/auth', protect, require('./endpoints/auth.js'));

        app.get('/repos', protect, require('./endpoints/repos.js'));
        app.get('/tasks', protect, require('./endpoints/tasks.js'));

        // start listening on port
        app.listen(config.port);
    }
}

module.exports = server;
