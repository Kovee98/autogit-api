const dbs = require('../../utils/db.js');
const { db } = require('../../utils/db.js');

// save then get
async function sync (req, res) {
    try {
        const data = req.body.data;

        try {
            const removals = data
                .filter((note) => note._deleted === true)
                .map((note) => note.id);
            
            console.log('removals:', removals);

            if ((removals || []).length > 0) {
                const docs = await db.notes.findByIds(removals);
                const rids = [ ...docs.keys() ];
                console.log('rids:', rids);
                const res = await db.notes.bulkRemove(rids);
                console.log('res:', res);
            }
        } catch (err) {
            console.log('notes:sync:remove:err', err);
        }

        try {
            const updates = data
                .filter((note) => !note._deleted);

            console.log('updates:', updates.length);
            const docs = await db.notes.bulkInsert(updates);

            console.log('docs:', docs);

            // if (updates?.length > 0) {
            //     await db.notes.bulkInsert(updates);
            // } else {

            // }
        } catch (err) {
            console.log('notes:sync:remove:err', err);
        }

        const docs = await db.notes
            .find({
                selector: {
                    user: 'jkovalchik'
                }
            })
            .exec();

        return res.json({ ok: true, data: docs });
    } catch (err) {
        console.error('notes:sync:err', err);
        return res.status(500).json({ ok: false, err });
    }
}

module.exports = sync;
