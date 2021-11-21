const redis = require('../../utils/redis.js');
const { db } = require('../../utils/db.js');

async function get (req, res) {
    try {
        // redis.get('notella_jkovalchik:notes', (err, data) => {
        //     if (err) throw err;

        //     console.log('data:', data);
        
        //     return res.json({ ok: true, data });
        // });

        const docs = await db.notes
            .find()
            .where('user')
            .equal('jkovalchik')
            .exec();

        console.log('docs:', docs);

        return res.json({ ok: true, data: docs });
    } catch (err) {
        console.error('notes:get:err', err);
        return res.status(500).json({ ok: false, err });
    }
}

module.exports = get;
