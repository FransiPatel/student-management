const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Student, Parent } = require("../../models/index");
const { validateLogin, userValidation } = require("../../validations/userValidation");
const { sendConfirmationEmail } = require("../../helpers/emailHelper");
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
        const student = await Student.findOne({ where: { email, isDeleted: false } });
        if (!student) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Generate JWT token using id instead of email
        const token = jwt.sign(
            { id: student.id, name: student.name, parentId: student.parentId },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
// Student Registration
const registerStudent = async (req, res) => {
    try {
        const { email, name, password, class: studentClass, school, parentId } = req.body;

        // Validate input using ValidatorJS
        const validation = userValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Check if a student with the same email exists
        const existingStudent = await Student.findOne({ where: { email, isDeleted: false } });

        if (existingStudent) {
            return res.status(400).json({ message: "Student already registered with this email." });
        }

        // Validate if parent exists and is not deleted
        const parent = await Parent.findOne({ where: { parentId, isDeleted: false } });
        if (!parent) {
            return res.status(400).json({ message: "Parent not found or has been deleted" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile picture path
        const profilePicPath = req.file ? `media/uploads/${req.file.filename}` : null;

        // Create new Student
        const newStudent = await Student.create({
            email,
            name,
            password: hashedPassword,
            class: studentClass,
            school: school,
            profilePic: profilePicPath,
            parentId,
        });

        await sendConfirmationEmail({ email: newStudent.email, name: newStudent.name });

        const data = {
            student: {
                id: newStudent.id,
                email: newStudent.email,
                name: newStudent.name,
                class: newStudent.class,
                school: newStudent.school,
                profilePic: newStudent.profilePic,
                parentId: newStudent.parentid,
            },
        }
        return res.status(201).json({
            message: "Student registered successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    loginStudent,
    registerStudent
};
