// allow CORs
module.exports = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // CORS preflight
    if(req.method === "OPTIONS") {
        res.send();
        return;
    }

    next();
};
