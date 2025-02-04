const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");
require("dotenv").config();

// Student Registration
const registerStudent = async (req, res) => {
    try {
        const { email, name, password, class: userClass, school, parentname } = req.body;

        // Validate input
        if (!email || !name || !password || !userClass || !parentname) {
            return res.status(400).json({ message: "Email, name, class, password, and parentId are required" });
        }

        // Check if parent exists
        const parent = await Parent.findByPk(parentname);
        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        // Check if student already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Student already registered" });
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
            parentname,
        });

        return res.status(201).json({
            message: "Student registered successfully",
            user: { 
                email: newUser.email, 
                name: newUser.name, 
                class: newUser.class, 
                school: newUser.school, 
                profile_pic: newUser.profile_pic, 
                parentname: newUser.parentname
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    registerStudent,
};
