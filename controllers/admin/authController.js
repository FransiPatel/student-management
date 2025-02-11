const jwt = require("jsonwebtoken");
const { redisClient, admin, jwtSecret, jwtExpiry } = require("../../config/config"); 
const { adminLoginValidation } = require("../../validations/adminValidation");

// Admin Login API
const adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Validate input
        const validation = adminLoginValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Validate admin credentials
        if (email !== admin.email || password !== admin.password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ email, role: "admin" }, jwtSecret, { expiresIn: jwtExpiry });

        // Store token in Redis (expires in 1 hour)
        await redisClient.set(`admin:${email}`, token, "EX", 3600);

        return res.status(200).json({
            message: "Admin logged in successfully",
            token,
        });
    } catch (error) {
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
            return res.status(401).json({ message: "Already logged out or session expired" });
        }

        // Remove token from Redis (logout)
        await redisClient.del(`admin:${email}`);

        return res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { adminLogin, adminLogout };