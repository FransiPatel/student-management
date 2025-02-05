const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Use decoded.id as the email
        if (!decoded.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.user = { email: decoded.id, name: decoded.name }; // Map id -> email
        next();
    } catch (error) {
        return res.status(498).json({ message: "Token is not valid" });
    }
};

module.exports = authenticateUser;
