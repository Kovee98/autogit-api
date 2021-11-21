const redis = require('../../utils/redis.js');
// const { db } = require('../../utils/db.js');
const dbs = require('../../utils/db.js');

// save then get
async function sync (req, res) {
    try {
        const data = req.body.data;

        // redis.set('notella_jkovalchik:notes', JSON.stringify(data));

        // const notes = await dbs.db.notes.inMemory();
        const notes = dbs.db.notes;

        await notes.bulkInsert(data);

        // const docs = await notes
        //     .find()
        //     .where('user')
        //     .eq('jkovalchik')
        //     .exec();
        const docs = await notes
            .find({
                selector: {
                    // id: { $regex: 'jkovalchik-.*' }
                    user: 'jkovalchik'
                }
            })
            .exec();

        console.log('docs:', docs);

        return res.json({ ok: true, msg: 'save successful!', data: docs });
    } catch (err) {
        console.error('notes:sync:err', err);
        return res.status(500).json({ ok: false, err });
    }
}

module.exports = sync;
