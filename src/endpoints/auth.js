const config = require('../config.js');
const http = require('superagent');
const { url } = require('../utils/utils.js');

// retrieve access token
async function run (req, res) {
    try {
        const query = req.query;
        const code = req.query.code;

        if (!code) throw { msg: 'missing code' };

        const body = await http.post('https://github.com/login/oauth/access_token')
            .send({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                code
            })
            .then((res = {}) => res.body || {});
        
        const token = body.access_token;
        // const user = await http.get('https://api.github.com/user')
        //     .set('Authorization', `token ${token}`);
        
        // store user/token in db
        // res.cookie('token', token);
        req.session.token = token;

        return res.redirect(url(`${config.redirectUrl}/dashboard`, { ok: true, ...body }));
    } catch (err) {
        console.error('err', err);
        return res.redirect(url(`${config.redirectUrl}`, { ok: false, ...err }));
    }
}

module.exports = run;
