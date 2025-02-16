const express = require("express");
const router = express.Router();

// Import route modules
const studentAuthRoutes = require("./auth");
const studentRoutes = require("./student");
const resultRoutes = require("./result");

// Define routes
router.use("/auth", studentAuthRoutes);
router.use("/student", studentRoutes);
router.use("/result",resultRoutes);

module.exports = router;
