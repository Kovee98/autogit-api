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
        app.use(helmet());
        app.use(redis);
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(cors);

        // endpoints
        app.get('/ping', (req, res) => res.json({ ok: true }));

        app.get('/session', (req, res) => res.json({ ok: true, authenticated: req.isAuthenticated() }));

        app.get('/login', passport.authenticate('github'));
        app.post('/logout', () => {
            console.log('logging out');
        });

        app.get('/auth/github/callback', (req, res, next) => passport.authenticate('github', { failureRedirect: `${config.redirectUrl}/login` }, (err, user, next) => {
            if (err) { return next(err); }
            if (!user) { return res.send("-1"); }

            req.logIn(user, (err) => {
                if (err) { return next(err); }
                req.session.save(() => res.redirect(`${config.redirectUrl}/dashboard`));
            });
        })(req, res, next), (req, res) => {
            console.log('Successfully authenticated!');
            res.redirect(`${config.redirectUrl}/dashboard`);
        });

        app.get('/repos', protect, require('./endpoints/repos.js'));
        app.get('/tasks', protect, require('./endpoints/tasks.js'));

        // start listening on port
        app.listen(config.port);
    }
}

module.exports = server;
