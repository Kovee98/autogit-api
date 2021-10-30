const config = require('../config.js');

function protect (req, res, next) {
    // res.json({ isAuthenticated: req.isAuthenticated() });
    console.log('isAuthenticated', req.isAuthenticated());

    if (req.isAuthenticated()) { return next(); }
    // res.redirect(`${config.redirectUrl}/login`);
    return res.status(401).json({ ok: false, isAuthenticated: req.isAuthenticated() });
}

module.exports = protect;
