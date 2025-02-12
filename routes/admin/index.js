const express = require("express");
const router = express.Router();

// Import route modules
const adminAuthRoutes = require("./auth");
const parentRoutes = require("./parent");
const studentRoutes = require("./student");

// Define routes
router.use("/auth", adminAuthRoutes);
router.use("/parent", parentRoutes);
router.use("/student", studentRoutes);

module.exports = router;
