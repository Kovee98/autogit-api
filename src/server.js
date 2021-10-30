const config = require('./config.js');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const protect = require('./middleware/protect.js');

passport.use(new GitHubStrategy({
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: "http://localhost:4000/auth/github/callback"
    }, (accessToken, refreshToken, user, done) => {
        console.log('accessToken:', accessToken);
        console.log('refreshToken:', refreshToken);
        console.log('user:', user);
        return done(null, user);
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
    }
));

const server = {
    init () {
        // create express server
        const app = express();

        // middleware
        app.use(express.json());
        app.use(helmet());
        app.use(session({
            name: 'ag_sid',
            store: new RedisStore({
                client: redis.createClient(config.redis)
            }),
            secret: config.cookieKey,
            cookie: {
                // maxAge: 24 * 60 * 60 * 1000 // 24 hours
                maxAge: config.maxAge
            },
            // resave: true,
            resave: false,
            // saveUninitialized: true,
            saveUninitialized: false,
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((user, done) => {
            // placeholder for custom user serialization
            done(null, user);
        });

        passport.deserializeUser((user, done) => {
            // placeholder for custom user deserialization.
            // maybe you are getoing to get the user from mongo by id?
            done(null, user); // null is for errors
        });

        // endpoints
        app.get('/ping', (req, res) => res.json({ ok: true }));

        app.get('/cookie', protect, function (req, res) {
            // console.log(req.session);
            // console.log('isAuthenticated', req.isAuthenticated());
            // return res.redirect(`${config.redirectUrl}/dashboard`);
            return res.json({ ok: true });
        });

        app.get('/login', passport.authenticate('github'));

        app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: `${config.redirectUrl}/dashboard` }), (req, res) => {
            console.log('wooh!');
            res.redirect(`${config.redirectUrl}/dashboard`);
        });

        app.get('/auth', require('./endpoints/auth.js'));

        // app.get('/login', require('./endpoints/login.js'));
        
        // start listening on port
        app.listen(config.port);
    }
}

module.exports = server;
