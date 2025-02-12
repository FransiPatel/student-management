const express = require("express");
const { authController } = require("../../controllers/admin");
const router = express.Router();

// admin login and logout
router.post("/login", authController.adminLogin);
router.post("/logout", authController.adminLogout);

module.exports = router;
