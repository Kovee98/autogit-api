const config = require('../config.js');
const path = require('path');
const { createRxDatabase, getRxStoragePouch, addPouchPlugin } = require('rxdb');
const leveldown = require('leveldown');

// add plugins
// addPouchPlugin(require('pouchdb-adapter-leveldb'));
addPouchPlugin(require('pouchdb-adapter-http'));
addPouchPlugin(require('pouchdb-adapter-memory'));

const dbs = {
    db: null,

    async initDb () {
        try {
            dbs.db = await createRxDatabase({
                name: path.join(config.dbDir, 'notella_data'),
                storage: getRxStoragePouch('memory'),
                password: config.dbPass,
                multiInstance: false,
                eventReduce: false
            });
    
            await dbs.db.addCollections({
                notes: {
                    schema: require('../schemas/notes.js'),
                    autoMigrate: true
                }
            });
    
            const sync = dbs.db.notes.syncCouchDB({
                remote: `${config.dbUrl}/notella_data`,
                options: {
                    live: true,
                    retry: true
                }
            });
    
            // sync.denied$.subscribe((data) => {
            //     console.log(`${name}:denied:`, data);
            // });
    
            // sync.error$.subscribe((err) => {
            //     console.log(`${name}:error:`, err);
            // });
        } catch (err) {
            console.error(err);
        }
    }
};

// let db = null;

// async function initDb () {
//     try {
//         db = await createRxDatabase({
//             name: path.join(config.dbDir, 'notella_data'),
//             storage: getRxStoragePouch('memory'),
//             password: config.dbPass,
//             multiInstance: false,
//             eventReduce: false
//         });

//         await db.addCollections({
//             notes: {
//                 schema: require('../schemas/notes.js'),
//                 autoMigrate: true
//             }
//         });

//         const sync = db.notes.syncCouchDB({
//             remote: `${config.dbUrl}/notella_data`,
//             options: {
//                 live: true,
//                 retry: true
//             }
//         });

//         // sync.denied$.subscribe((data) => {
//         //     console.log(`${name}:denied:`, data);
//         // });

//         // sync.error$.subscribe((err) => {
//         //     console.log(`${name}:error:`, err);
//         // });
//     } catch (err) {
//         console.error(err);
//     }
// }

// create (name, replicate) {
//     try {
//         if (!name) return null;

//         return dbs.database.addCollections({
//             [name]: {
//                 schema: require(`../schemas/${name}.js`),
//                 autoMigrate: true
//             }
//         }).then((collection) => {
//             if (replicate) {
//                 const sync = collection[name].syncCouchDB({
//                     remote: `${config.dbUrl}/notella-users/`,
//                     options: {
//                         live: true,
//                         retry: true
//                     }
//                 });

//                 sync.denied$.subscribe((data) => {
//                     console.log(`${name}:denied:`, data);
//                 });

//                 sync.error$.subscribe((err) => {
//                     console.log(`${name}:error:`, err);
//                 });
//             }

//             return collection[name];
//         });
//     } catch (err) {
//         console.error(err);
//     }
// }

// module.exports.db = db;
// module.exports.initDb = initDb;
module.exports = dbs;
