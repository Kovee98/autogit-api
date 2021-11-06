// configure cors middleware
const cors = require('cors');

module.exports = cors({
    origin: [
        'https://autogit.kovalchik.cloud',
        'http://localhost:3000'
    ],
    credentials: true
});
