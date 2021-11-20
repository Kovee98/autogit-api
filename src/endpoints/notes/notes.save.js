const redis = require('../../utils/redis.js');

function save (req, res) {
    try {
        const data = req.body.data;
        console.log('saving:', data);
    
        redis.set('notella_jkovalchik:notes', JSON.stringify(data));
    
        return res.json({ ok: true, msg: 'save successful!' });
    } catch (err) {
        console.error('notes:save:err', err);
        return res.status(500).json({ ok: false, err });
    }
}

module.exports = save;
