const express = require("express");
const userAuth = require("../../middlewares/userAuth");
const upload = require("../../middlewares/multer");
const { updateProfileController } = require("../../controllers/user");
const router = express.Router();

// update existing user by email
router.put("/update", userAuth, upload, updateProfileController.updateProfile);

module.exports = router;
