const express = require("express");
const studentAuth = require("../../middlewares/studentAuth");
const upload = require("../../middlewares/multer");
const { studentController } = require("../../controllers/user");
const router = express.Router();

// update existing user
router.put("/update", studentAuth, upload, studentController.updateProfile);

// view user profile
router.get("/profile", studentAuth, studentController.viewProfile);

module.exports = router;
