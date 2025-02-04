const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
    await redisClient.connect();
})();

module.exports = {
    redisClient,
    admin: {
        email: "admin@example.com",
        password: "adminpassword", 
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: "1h",
};
