const setRateLimit = require("express-rate-limit");


const rateLimitMiddleware = setRateLimit({
    windowMs: 10 * 1000, // 15 minutes
    max: 100, // limit each IP/user to 100 requests per windowMs
    keyGenerator: function (req) {
        return Date.now(); // use user ID as the key
    },
    handler: function (req, res, next) {
        res.status(429).json({
            message: "Too many requests, please try again later.",
        });
    },
});

module.exports = rateLimitMiddleware;
