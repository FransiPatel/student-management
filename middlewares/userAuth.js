const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure token contains 'id'
        if (!decoded.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.user = { 
            id: decoded.id, 
            name: decoded.name, 
            parentid: decoded.parentid
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authenticateUser;
