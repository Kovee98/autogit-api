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

        app.get('/user', protect, (req, res) => {
            return res.json({
                ok: true,
                session: req.session
            });
        });

        app.get('/github/login', passport.authenticate('github'));
        app.get('/github/callback', (req, res, next) => passport.authenticate('github', { failureRedirect: `${config.redirectUrl}/login` }, (err, user, next) => {
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

        app.delete('/logout', (req, res) => {
            if (req.session) {
                req.session.destroy((err) => {
                    if (err) {
                        console.log('server:logout:err', err);
                        return res.status(400).json({ ok: false, msg: 'unable to log out' });
                    } else {
                        console.log('server:logout success!');
                        return res.json({ ok: true, msg: 'logout successful' });
                    }
                });
            } else {
                return res.end();
            }
        });

        app.get('/repos', protect, require('./endpoints/repos.js'));
        app.get('/tasks', protect, require('./endpoints/tasks.js'));

        // start listening on port
        app.listen(config.port);
    }
}

module.exports = server;
