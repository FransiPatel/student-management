const express = require("express");
const router = express.Router();

// Import route modules
const adminAuthRoutes = require("./auth");
const parentRoutes = require("./parent");
const studentRoutes = require("./student");
const subjectRoutes = require("./subject");
const studentGradesRoutes = require("./studentGrades");

// Define routes
router.use("/auth", adminAuthRoutes);
router.use("/parent", parentRoutes);
router.use("/student", studentRoutes);
router.use("/subject", subjectRoutes);
router.use("/grades", studentGradesRoutes);

module.exports = router;
