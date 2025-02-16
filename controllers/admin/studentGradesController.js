const { sequelize } = require("../../models"); // Use sequelize for raw queries
const { StudentGrades } = require("../../models");

// Fetch student grades from the View
const getStudentGrades = async (req, res) => {
    try {
        const { className } = req.query;

        if (!className) {
            return res.status(400).json({ message: "Class name is required" });
        }

        // Use the View instead of direct model query
        const query = `SELECT * FROM "ClassStudentGradesView" WHERE "className" = :className`;
        const grades = await sequelize.query(query, {
            replacements: { className },
            type: sequelize.QueryTypes.SELECT,
        });

        return res.status(200).json({ message: "Student grades fetched successfully", grades });
    } catch (error) {
        console.error("Error fetching student grades:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add student grade
const addStudentGrade = async (req, res) => {
    try {
        const { studentId, subjectId, grade, marks, gradeType, status } = req.body;

        const newGrade = await StudentGrades.create({
            studentId,
            subjectId,
            grade,
            marks,
            gradeType,
            status,
        });

        return res.status(201).json({ message: "Grade added successfully", grade: newGrade });
    } catch (error) {
        console.error("Error adding student grade:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update student grade
const updateStudentGrade = async (req, res) => {
    try {
        const { gradeId } = req.params;
        const { grade, marks, status } = req.body;

        const existingGrade = await StudentGrades.findOne({ where: { gradeId, isDeleted: false } });
        if (!existingGrade) {
            return res.status(400).json({ message: "Grade not found" });
        }

        await existingGrade.update({ grade, marks, status });

        return res.status(200).json({ message: "Grade updated successfully", grade: existingGrade });
    } catch (error) {
        console.error("Error updating student grade:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Soft delete student grade
const deleteStudentGrade = async (req, res) => {
    try {
        const { gradeId } = req.params;

        const existingGrade = await StudentGrades.findOne({ where: { gradeId, isDeleted: false } });
        if (!existingGrade) {
            return res.status(400).json({ message: "Grade not found" });
        }

        // Soft delete by updating isDeleted to true
        await existingGrade.update({ isDeleted: true });

        return res.status(200).json({ message: "Grade deleted successfully", gradeId });
    } catch (error) {
        console.error("Error deleting student grade:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getStudentGrades,
    addStudentGrade,
    updateStudentGrade,
    deleteStudentGrade,
};
