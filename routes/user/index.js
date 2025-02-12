const express = require("express");
const router = express.Router();

// Import route modules
const studentAuthRoutes = require("./auth");
const studentRoutes = require("./student");

// Define routes
router.use("/auth", studentAuthRoutes);
router.use("/student", studentRoutes);

module.exports = router;
