// configure cors middleware
const cors = require('cors');

module.exports = cors({
    origin: [
        'https://notella.kovalchik.cloud',
        'http://localhost:3000'
    ],
    credentials: true
});
