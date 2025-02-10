const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/config");
require("dotenv").config();

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });

        // Corrected Redis key format
        const redisToken = await redisClient.get(`admin:${decoded.email}`);
        if (!redisToken || redisToken !== token) {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        req.admin = decoded; 
        next();
    } catch (error) {
        res.status(498).json({ message: "Invalid token" });
    }
};

module.exports = adminAuth;
