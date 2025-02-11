const express = require("express");
const { userController } = require("../../controllers/admin");
const adminAuth = require("../../middlewares/adminAuth");
const upload = require("../../middlewares/multer"); 
const router = express.Router();

// add new user
router.post("/add", adminAuth, upload, userController.addUser); 
// list all users
router.get("/users", adminAuth, userController.getUsers);
// update existing user by email
router.put("/update/:id", adminAuth, upload, userController.updateUser);
// delete existing user by email
router.delete("/delete/:id", adminAuth, userController.deleteUser);

module.exports = router;
