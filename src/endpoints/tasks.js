function tasks (req, res) {
    console.log('session:', req.session);
    console.log('user:', req.user);
    return res.json({ ok: true, tasks: [] });
}

module.exports = tasks;
