const redis = require('../../utils/redis.js');

async function get (req, res) {
    try {
        redis.get('notella_jkovalchik:notes', (err, data) => {
            if (err) throw err;

            console.log('data:', data);
        
            return res.json({ ok: true, data });
        });
    } catch (err) {
        console.error('notes:get:err', err);
        return res.status(500).json({ ok: false, err });
    }
}

module.exports = get;
