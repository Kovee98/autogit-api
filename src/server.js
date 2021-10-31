const config = require('./config.js');
const express = require('express');
const helmet = require('helmet');
// const redis = require('./middleware/redis.js');

const session = require('express-session');
const nodeRedis = require('redis');
const RedisStore = require('connect-redis')(session);

// create redis client (node-redis)
const client = nodeRedis.createClient({
    ...config.redis
});

// const passport = require('./middleware/passport.js');
// const cors = require('./middleware/cors.js');
const cors = require('cors');
const protect = require('./middleware/protect.js');

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const server = {
    init () {
        // create express server
        const app = express();

        passport.use(new GitHubStrategy({
                clientID: config.clientId,
                clientSecret: config.clientSecret,
                callbackURL: "http://localhost:4000/auth/github/callback"
            }, (accessToken, refreshToken, user, done) => {
                return done(null, user);
            }
        ));

        // middleware
        app.use(express.json());
        app.use(helmet());
        app.use(session({
            name: 'ag_sid',
            store: new RedisStore({ client }),
            secret: config.cookieKey,
            cookie: {
                maxAge: config.maxAge,
                // secure: config.secureCookies
            },
            // rolling: true,
            resave: false,
            saveUninitialized: false,
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((user, done) => {
            console.log('serialize');
            // placeholder for custom user serialization
            const err = null;
            done(err, user);
        });

        passport.deserializeUser((user, done) => {
            console.log('deserialize');
            // placeholder for custom user deserialization.
            // maybe you are getoing to get the user from mongo by id?
            const err = null;
            done(err, user);
        });

        app.use(cors());

        app.all('*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header('Access-Control-Allow-Credentials', true);
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            next();
        });

        // endpoints
        app.get('/ping', (req, res) => res.json({ ok: true }));

        app.get('/session', (req, res) => res.json({ ok: true, authenticated: req.isAuthenticated() }));

        app.get('/login', passport.authenticate('github'));

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
