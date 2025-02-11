const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/index");
const { validateLogin } = require("../../validations/userValidation"); // Import validation
require("dotenv").config();

// Student Login
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const validation = validateLogin(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Find student by email
        const student = await User.findOne({ where: { email, isDeleted: false } });
        if (!student) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token using id instead of email
        const token = jwt.sign(
            { id: student.id, name: student.name, parentid: student.parentid },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    loginStudent
};
