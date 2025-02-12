const express = require("express");
const { authController } = require("../../controllers/user");
const upload = require("../../middlewares/multer"); 
const router = express.Router();

// user login and logout
router.post("/login", authController.loginStudent);

// user login and logout
router.post("/register", upload, authController.registerStudent);

module.exports = router;
