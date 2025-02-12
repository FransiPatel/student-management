const fs = require("fs");
const path = require("path");
const { Student, Parent } = require("../../models/index");
const { updateUserValidation } = require("../../validations/userValidation");

const updateProfile = async (req, res) => {
    try {
        const { name, class: studentClass, school } = req.body;

        // Ensure student is authenticated
        if (!req.student) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Validate input
        const validation = updateUserValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ message: validation.errors.all() });
        }

        // Find student by ID from token (no need for params)
        const student = await Student.findByPk(req.student.id);
        if (!student) {
            return res.status(400).json({ message: "Student not found" });
        }

        // Handle profile picture update
        let profilePicPath = student.profilePic;
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

        // Update student details
        await student.update({
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

        return res.status(200).json({
            message: "Profile updated successfully",
            data,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
// Get student Profile API
const viewProfile = async (req, res) => {
    try {
        // Ensure student is authenticated
        if (!req.student) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Find student by ID from the token
        const student = await Student.findOne({
            where: { id: req.student.id },
            attributes: ["id", "email", "name", "class", "school", "profilePic", "parentId"],
            include: [{
                model: Parent,
                as: "Parent",
                attributes: ["parentId", "parentName", "parentEmail", "parentPhone"]
            }]
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).json({ message: "Student profile fetched successfully", student });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    updateProfile,
    viewProfile,
};
