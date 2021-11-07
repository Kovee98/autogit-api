const config = require('../config.js');
const path = require('path');
const { createRxDatabase, getRxStoragePouch, addPouchPlugin } = require('rxdb');
const leveldown = require('leveldown');

// add plugins
addPouchPlugin(require('pouchdb-adapter-leveldb'));
addPouchPlugin(require('pouchdb-adapter-http'));

const dbs = {
    database: null, // database
    collections: {
        users: null
    },

    async init () {
        try {
            // create users db
            dbs.database = await createRxDatabase({
                name: path.join(config.dbDir, 'notella'),
                storage: getRxStoragePouch(leveldown),
                password: config.dbPass,
                multiInstance: false,
                eventReduce: false
            });

            dbs.collections.users = await dbs.create('users', true);
        } catch (err) {
            console.error(err);
        }
    },

    create (name, replicate) {
        try {
            if (!name) return null;

            return dbs.database.addCollections({
                [name]: {
                    schema: require(`../schemas/${name}.js`),
                    autoMigrate: true
                }
            }).then((collection) => {
                if (replicate) {
                    const sync = collection[name].syncCouchDB({
                        remote: `${config.dbUrl}/notella-users/`,
                        options: {
                            live: true,
                            retry: true
                        }
                    });

                    sync.denied$.subscribe((data) => {
                        console.log(`${name}:denied:`, data);
                    });

                    sync.error$.subscribe((err) => {
                        console.log(`${name}:error:`, err);
                    });
                }

                return collection[name];
            });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports.users = dbs.collections.users;
module.exports = dbs;
