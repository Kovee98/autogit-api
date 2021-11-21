require('dotenv').config();
const server = require('./server.js');
// const { initDb } = require('./utils/db.js');
const dbs = require('./utils/db.js');

async function start () {
    try {
        await dbs.initDb();

        await server.init();
        // await dbs.init();

        console.log('Started successfully!');

        // setTimeout(async () => {
        //     try {
        //         // const { users } = require('./utils/dbs.js');
    
        //         // const user = await users.findOne({
        //         //     selector: {
        //         //         name: 'Kovee98'
        //         //     }
        //         // }).exec();
        //         // const doc = await dbs.collections.users
        //         //     .findOne({
        //         //         selector: {
        //         //             name: 'Kovee98'
        //         //         }
        //         //     })
        //         //     .exec()
        //         //     .then((doc) => {
        //         //         if (doc) {
        //         //             return doc.toJSON();
        //         //         } else {
        //         //             return {};
        //         //         }
        //         //     });

        //         // console.log(doc);
        //     } catch (err) {
        //         console.error(err);
        //     }
        // }, 1000);
    } catch (err) {
        console.error(err);
    }
}

start();
