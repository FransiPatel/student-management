const express = require("express");
const { viewProfileController } = require("../../controllers/user");
const userAuth = require("../../middlewares/userAuth");
const router = express.Router();

// view user profile
router.get("/profile", userAuth, viewProfileController.viewProfile);


module.exports = router;
