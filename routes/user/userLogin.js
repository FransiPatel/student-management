const express = require("express");
const { loginController } = require("../../controllers/user");
const router = express.Router();

// user login and logout
router.post("/login", loginController.loginStudent);

module.exports = router;
