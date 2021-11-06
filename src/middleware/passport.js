const config = require('../config.js');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const strategy = new GitHubStrategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: "http://localhost:4000/auth/github/callback"
}, (accessToken, refreshToken, user, done) => {
    return done(null, user);
});

passport.use(strategy);

passport.serializeUser((user, done) => {
    const err = null;
    done(err, user);
});

passport.deserializeUser((user, done) => {
    const err = null;
    done(err, user);
});

module.exports = passport;
