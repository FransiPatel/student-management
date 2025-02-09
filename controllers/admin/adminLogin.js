const jwt = require("jsonwebtoken");
const validator = require("validator");
const { redisClient, admin, jwtSecret, jwtExpiry } = require("../../config/config"); 

// Admin Login API
const adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        email = validator.trim(email);
        password = validator.trim(password);

        // Validate admin credentials
        if (email !== admin.email || password !== admin.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ email, role: "admin" }, jwtSecret, {
            expiresIn: jwtExpiry,
        });

        // Store token in Redis
        await redisClient.set(`admin:${email}`, token, "EX", 3600);

        return res.status(200).json({
            message: "Admin logged in successfully",
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Admin Logout API
const adminLogout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Decode token to extract email
        let decoded;
        try {
            decoded = jwt.verify(token, jwtSecret);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const email = decoded.email;

        // Check if token exists in Redis
        const storedToken = await redisClient.get(`admin:${email}`);
        if (!storedToken) {
            return res.status(440).json({ message: "Already logged out or session expired" });
        }

        // Remove token from Redis (logout)
        await redisClient.del(`admin:${email}`);

        return res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { adminLogin, adminLogout };