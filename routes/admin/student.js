const express = require("express");
const { studentController } = require("../../controllers/admin");
const adminAuth = require("../../middlewares/adminAuth");
const upload = require("../../middlewares/multer"); 
const router = express.Router();

// add new student
router.post("/add", adminAuth, upload, studentController.addStudent); 
// list all student
router.get("/students", adminAuth, studentController.getStudents);
// update existing student by id
router.put("/update/:id", adminAuth, upload, studentController.updateStudent);
// delete existing student by id
router.delete("/delete/:id", adminAuth, studentController.deleteStudent);

module.exports = router;
