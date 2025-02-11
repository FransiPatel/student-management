const express = require("express");
const router = express.Router();

// Import route modules
const adminAuthRoutes = require("./admin");
const parentRoutes = require("./parent");
const userRoutes = require("./user");

// Define routes
router.use("/auth", adminAuthRoutes);
router.use("/parent", parentRoutes);
router.use("/user", userRoutes);

module.exports = router;
