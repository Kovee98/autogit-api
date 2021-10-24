const config = require('../config.js');
const { url } = require('../utils/utils.js');

async function run (req, res) {
    try {
        return res.redirect(url('https://github.com/login/oauth/authorize', { client_id: '99989ffeadeefa8f2d08' }));
    } catch (err) {
        console.error('err', err);
        return res.redirect(url(`${config.redirectUrl}`, { ok: false, ...err }));
    }
}

module.exports = run;
