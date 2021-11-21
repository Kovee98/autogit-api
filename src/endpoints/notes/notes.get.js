const { db } = require('../../utils/db.js');

async function get (req, res) {
    try {
        const docs = await db.notes
            .find({
                selector: {
                    user: 'jkovalchik'
                }
            })
            .exec();

        return res.json({ ok: true, data: docs });
    } catch (err) {
        console.error('notes:get:err', err);
        return res.status(500).json({ ok: false, err });
    }
}

module.exports = get;
