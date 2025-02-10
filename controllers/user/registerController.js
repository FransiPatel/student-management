const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");
require("dotenv").config();

// Student Registration
const registerStudent = async (req, res) => {
    try {
        const { email, name, password, class: userClass, school, parentid } = req.body;

        // Validate input
        if (!email || !name || !password || !userClass || !parentid) {
            return res.status(400).json({ message: "Email, name, class, password, and parentid are required" });
        }

        // Check if student already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Student already registered" });
        }

        // Validate if parent exists
        const parent = await Parent.findByPk(parentid);
        if (!parent) {
            return res.status(400).json({ message: "Parent not found. Please provide a valid parentid." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile picture path
        const profilePicPath = req.file ? `uploads/profile_pics/${req.file.filename}` : null;

        // Create Student
        const newUser = await User.create({
            email,
            name,
            password: hashedPassword,
            class: userClass,
            school: school || "Our School",
            profile_pic: profilePicPath,
            parentid
        });

        return res.status(201).json({
            message: "Student registered successfully",
            newUser,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    registerStudent,
};
