const express = require("express");
const { registerStudent } = require("../../controllers/user/registerController");
const { loginStudent } = require("../../controllers/user/loginController");
const { updateProfile } = require("../../controllers/user/updateProfileController");
const { viewProfile } = require("../../controllers/user/viewProfileController");
const userAuth = require("../../middlewares/userAuth");
const upload = require("../../middlewares/multer"); 
const router = express.Router();

// user login and logout
router.post("/register", upload, registerStudent);
router.post("/login", loginStudent);

// update existing user by email
router.put("/update-user/:email", userAuth, upload, updateProfile);

// view user profile
router.get("/view-profile/:email", userAuth, viewProfile);


module.exports = router;
