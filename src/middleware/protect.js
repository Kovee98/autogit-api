function protect (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    return res.status(401).json({ ok: false });
}

module.exports = protect;
