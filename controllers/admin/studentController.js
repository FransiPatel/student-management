const bcrypt = require("bcryptjs");
const { Student, Parent } = require("../../models/index");
const { Op } = require("sequelize");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { userValidation, updateUserValidation } = require("../../validations/userValidation");

const addStudent = async (req, res) => {
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
            return res.status(400).json({ message: "Student already exists with this email." });
        }

        // Check if the parent exists
        const parent = await Parent.findOne({ where: { parentId, isDeleted: false } });
        if (!parent) {
            return res.status(400).json({ message: "Parent not found. Please provide a valid parentid." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePicPath = req.file ? `media/uploads/${req.file.filename}` : null;

        // Create a new student
        const newStudent = await Student.create({
            id: uuidv4(),
            email,
            name,
            password: hashedPassword,
            class: studentClass,
            school: school,
            profilePic: profilePicPath,
            parentId,
        });
        const data = {
            student: {
                id: newStudent.id,
                email: newStudent.email,
                name: newStudent.name,
                class: newStudent.class,
                school: newStudent.school,
                profilePic: newStudent.profilePic,
                parentId: newStudent.parentId,
            }
        };
        return res.status(201).json({ message: "Student added successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

const getStudents = async (req, res) => {
    try {
        let { id, email, name, class: studentClass, school, parentId, page, limit } = req.query;

        // Pagination defaults
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;
        const offset = (page - 1) * limit;

        // Filters (Include only non-deleted students & parents)
        const filters = { isDeleted: false };
        if (id) filters.id = id;
        if (email) filters.email = { [Op.iLike]: `%${email}%` };
        if (name) filters.name = { [Op.iLike]: `%${name}%` };
        if (studentClass) filters.class = studentClass;
        if (school) filters.school = { [Op.iLike]: `%${school}%` };
        if (parentId) filters.parentid = parentId;

        // Get total count
        const totalStudents = await Student.count({ where: filters });

        // Fetch students with filters & pagination
        const students = await Student.findAll({
            where: filters,
            attributes: ["id", "email", "name", "class", "school", "profilePic", "parentId"],
            include: [{
                model: Parent,
                as: "Parent",
                attributes: ["parentId", "parentName", "parentEmail", "parentPhone"],
                where: { isDeleted: false },
                required: false,
            }],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        const data = {
            totalStudents,
            students,
        };

        return res.status(200).json({ message: "Students retrieved successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Update student
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, class: studentClass, school } = req.body;

        // Validate input using ValidatorJS
        const validation = updateUserValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Find student but exclude soft-deleted ones
        const student = await Student.findOne({ where: { id, isDeleted: false } });
        if (!student) {
            return res.status(400).json({ message: "Student not found" });
        }

        // Handle profile picture update and deletion of old image
        let profilePicPath = Student.profilePic;
        if (req.file) {
            const newProfilePicPath = `media/uploads/${req.file.filename}`;

            // Delete old profile picture if it exists
            if (student.profilePic) {
                const oldImagePath = path.join(__dirname, "../../", student.profilePic);
                fs.unlink(oldImagePath, (err) => {
                    if (err && err.code !== "ENOENT") {
                        console.error("Error deleting old profile picture:", err);
                    }
                });
            }

            profilePicPath = newProfilePicPath;
        }

        await student.update({
            email: email || student.email,
            name: name || student.name,
            class: studentClass || student.class,
            school: school || student.school,
            profilePic: profilePicPath,
        });

        const data = {
            student: {
                id: student.id,
                email: student.email,
                name: student.name,
                class: student.class,
                school: student.school,
                profilePic: student.profilePic,
                parentId: student.parentId,
            }
        };

        return res.status(200).json({ message: "Student updated successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete student
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Find student by email
        const student = await Student.findOne({ where: { id, isDeleted: false } });
        if (!student) {
            return res.status(400).json({ message: "Student not found" });
        }

        // Count how many active students are associated with this parent
        const studentCount = await Student.count({ where: { parentId: student.parentId, isDeleted: false } });

        // Soft delete the student
        await student.update({ isDeleted: true });

        // If this was the only active student associated with the parent, soft delete the parent as well
        if (studentCount === 1) {
            await Parent.update({ isDeleted: true }, { where: { parentId: student.parentId } });
        }

        return res.status(200).json({ message: "Student deleted successfully", id});
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent,
};
