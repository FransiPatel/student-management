const express = require("express");
const { studentGradesController } = require("../../controllers/admin");
const adminAuth = require("../../middlewares/adminAuth");
const router = express.Router();

// add student grades
router.post("/add", adminAuth, studentGradesController.addStudentGrade); 
// list all student grades
router.get("/grades", adminAuth, studentGradesController.getStudentGrades);
// update existing student grade by id
router.put("/update/:gradeId", adminAuth, studentGradesController.updateStudentGrade);
// delete existing student grade by id
router.delete("/delete/:gradeId", adminAuth, studentGradesController.deleteStudentGrade);

module.exports = router;
