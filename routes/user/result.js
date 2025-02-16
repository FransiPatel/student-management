const express = require("express");
const studentAuth = require("../../middlewares/studentAuth");
const { resultController } = require("../../controllers/user");
const router = express.Router();

// view user profile
router.get("/result", studentAuth, resultController.getStudentResult);

module.exports = router;
