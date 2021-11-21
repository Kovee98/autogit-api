const { db } = require('../../utils/db.js');

async function save (req, res) {
    try {
        const data = req.body.data;
    
        await db.notes.bulkInsert(data);
    
        return res.json({ ok: true, msg: 'data saved successfully!' });
    } catch (err) {
        console.error('notes:save:err', err);
        return res.status(500).json({ ok: false, err });
    }
}

module.exports = save;
