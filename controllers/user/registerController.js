const bcrypt = require("bcryptjs");
const { User, Parent } = require("../../models/index");
const { userValidation } = require("../../validations/userValidation");
const { sendConfirmationEmail } = require("../../helpers/emailHelper");
require("dotenv").config();

// Student Registration
const registerStudent = async (req, res) => {
    try {
        const { email, name, password, class: userClass, school, parentid } = req.body;

        // Validate input using ValidatorJS
        const validation = userValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Check if a student with the same email exists (including soft-deleted users)
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            if (!existingUser.isDeleted) {
                return res.status(400).json({ message: "Student already registered with this email." });
            } else {
                // If the student exists but is soft-deleted, send an error
                return res.status(400).json({ message: "This email was used before and is soft deleted. Please use another email or contact support." });
            }
        }

        // Validate if parent exists and is not deleted
        const parent = await Parent.findOne({ where: { id: parentid, isDeleted: false } });
        if (!parent) {
            return res.status(400).json({ message: "Parent not found or has been deleted" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile picture path
        const profilePicPath = req.file ? `media/uploads/${req.file.filename}` : null;

        // Create new Student
        const newUser = await User.create({
            email,
            name,
            password: hashedPassword,
            class: userClass,
            school: school || "Our School",
            profile_pic: profilePicPath,
            parentid,
        });

        await sendConfirmationEmail({ email: existingUser.email, name: existingUser.name });

        const data = {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                class: newUser.class,
                school: newUser.school,
                profile_pic: newUser.profile_pic,
                parentid: newUser.parentid,
            },
        }
        return res.status(201).json({
            message: "Student registered successfully", data
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    registerStudent,
};
