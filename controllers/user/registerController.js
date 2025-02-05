const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");
require("dotenv").config();

// Student Registration
const registerStudent = async (req, res) => {
    try {
        const { email, name, password, class: userClass, school, parentname, parentemail, parentphone } = req.body;

        // Validate input
        if (!email || !name || !password || !userClass || !parentemail) {
            return res.status(400).json({ message: "Email, name, class, password, and parentemail are required" });
        }
        // Check if student already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Student already registered" });
        }

        let parent = await Parent.findByPk(parentemail);
        if (!parent) {
            if (!parentname || !parentphone) {
                return res.status(400).json({ message: "Parent does not exist. Please provide parentname and parentPhone to create one." });
            }
            parent = await Parent.create({
                parentemail,
                parentname: parentname,
                phone: parentphone
            });
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
            parentemail,
        });

        return res.status(201).json({
            message: "Student registered successfully",
            user: { 
                email: newUser.email, 
                name: newUser.name, 
                class: newUser.class, 
                school: newUser.school, 
                profile_pic: newUser.profile_pic, 
                parentemail: newUser.parentemail
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    registerStudent,
};
