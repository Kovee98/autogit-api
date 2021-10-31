const config = require('../config.js');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: "http://localhost:4000/auth/github/callback"
    }, (accessToken, refreshToken, user, done) => {
        return done(null, user);
    }
));

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

module.exports = passport;
