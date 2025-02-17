const { sequelize } = require("../../models");
const { StudentGrade } = require("../../models");
const {
    getStudentGradesValidation,
    addStudentGradeValidation,
    updateStudentGradeValidation,
} = require("../../validations/studentGradeValidation");

// Fetch student grades from the View
const getStudentGrade = async (req, res) => {
    try {
        const validation = getStudentGradesValidation(req.query);
        if (validation.fails()) {
            return res.status(400).json({ errors: validation.errors.all() });
        }

        const { className } = req.query;

        const query = `SELECT * FROM "ClassStudentGradesView" WHERE "className" = :className`;
        const grades = await sequelize.query(query, {
            replacements: { className },
            type: sequelize.QueryTypes.SELECT,
        });

        return res.status(200).json({ message: "Student grades fetched successfully", grades });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Add student grade
const addStudentGrade = async (req, res) => {
    try {
        const validation = addStudentGradeValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ errors: validation.errors.all() });
        }

        const { studentId, subjectId, grade, marks } = req.body;

        const newGrade = await StudentGrade.create({
            studentId,
            subjectId,
            grade,
            marks,
        });

        return res.status(201).json({ message: "Grade added successfully", newGrade });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Update student grade
const updateStudentGrade = async (req, res) => {
    try {
        const validation = updateStudentGradeValidation(req.body);
        if (validation.fails()) {
            return res.status(400).json({ errors: validation.errors.all() });
        }

        const { gradeId } = req.params;
        const { grade, marks } = req.body;

        const existingGrade = await StudentGrade.findOne({ where: { gradeId, isDeleted: false } });
        if (!existingGrade) {
            return res.status(400).json({ message: "Grade not found" });
        }

        await existingGrade.update({ grade, marks });

        return res.status(200).json({ message: "Grade updated successfully", existingGrade });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Soft delete student grade
const deleteStudentGrade = async (req, res) => {
    try {
        const { gradeId } = req.params;

        const existingGrade = await StudentGrade.findOne({ where: { gradeId, isDeleted: false } });
        if (!existingGrade) {
            return res.status(400).json({ message: "Grade not found" });
        }

        await existingGrade.update({ isDeleted: true });

        return res.status(200).json({ message: "Grade deleted successfully", gradeId });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getStudentGrade,
    addStudentGrade,
    updateStudentGrade,
    deleteStudentGrade,
};
