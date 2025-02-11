const express = require("express");
const { registerController } = require("../../controllers/user");
const upload = require("../../middlewares/multer"); 
const router = express.Router();

// user login and logout
router.post("/register", upload, registerController.registerStudent);

module.exports = router;
