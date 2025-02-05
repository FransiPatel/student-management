const jwt = require("jsonwebtoken");
const { redisClient, admin, jwtSecret, jwtExpiry } = require("../../config/config"); 

// Admin Login API
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "email format is not valid" });
        }
        // Validate admin credentials
        if (email !== admin.email) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Compare password (plain text since stored statically)
        const isPasswordValid = password === admin.password;
        if (!isPasswordValid) {
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
        return res.status(500).json({ message: "Server error", error: error.message });
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
        const decoded = jwt.verify(token, jwtSecret);
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
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
module.exports = { adminLogin, adminLogout };