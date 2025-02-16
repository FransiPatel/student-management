const express = require("express");
const { subjectController } = require("../../controllers/admin");
const adminAuth = require("../../middlewares/adminAuth");
const router = express.Router();

// add new subject
router.post("/add", adminAuth, subjectController.addSubject); 
// list all subject
router.get("/subjects", adminAuth, subjectController.getSubjects);
// update existing subject by id
router.put("/update/:subjectId", adminAuth, subjectController.updateSubject);
// delete existing subject by id
router.delete("/delete/:subjectId", adminAuth, subjectController.deleteSubject);

router.post("/add-class-subjects", adminAuth, subjectController.assignSubjectsToClass);

module.exports = router;
