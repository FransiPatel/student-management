const { sequelize } = require("../../models");

// Controller to fetch student marks and grades
const getStudentResult = async (req, res) => {
    try {
        const studentId = req.student.id;

        // Fetch student marks and grades from the view
        const results = await sequelize.query(
            `SELECT * FROM student_results_view WHERE student_id = :studentId;`,
            {
                replacements: { studentId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!results.length) {
            return res.status(400).json({ message: "Result", results });
        }

        return res.status(200).json({ studentId, results });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getStudentResult };
