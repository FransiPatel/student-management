const express = require("express");
const router = express.Router();

// Import route modules
const userAuthRoutes = require("./userLogin");
const userRegisterRoutes = require("./userRegister");
const updateUserRoutes = require("./updateUser");
const viewProfileRoutes = require("./viewProfile");

// Define routes
router.use("/auth", userAuthRoutes);
router.use("/register", userRegisterRoutes);
router.use("/updateuser", updateUserRoutes);
router.use("/view", viewProfileRoutes);

module.exports = router;
