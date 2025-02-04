const express = require("express");
const { adminLogin, adminLogout } = require("../../controllers/admin/adminLogin");
const { addUser, getAllUsers, searchUser, updateUser, deleteUser } = require("../../controllers/admin/userController");
const { addParent, getAllParents, searchParent, updateParent, deleteParent } = require("../../controllers/admin/parentController");
const adminAuth = require("../../middlewares/adminAuth");
const upload = require("../../middlewares/multer"); 
const router = express.Router();

// admin login and logout
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

// add new user
router.post("/add-user", adminAuth, upload, addUser); 
// list all users
router.get("/users", adminAuth, getAllUsers);
// search user by email
router.get("/search-user/:email", adminAuth, searchUser);
// update existing user by email
router.put("/update-user/:email", adminAuth, upload, updateUser);
// delete existing user by email
router.delete("/delete-user/:email", adminAuth, deleteUser);

// add parent
router.post("/add-parent", adminAuth, addParent);
// list parent
router.get("/parents", adminAuth, getAllParents);
// search parent by id
router.get("/search-parent/:parentname", adminAuth, searchParent);
// update parent by id
router.put("/update-parent/:parentname", adminAuth, updateParent);
// delete parent by id
router.delete("/delete-parent/:parentname", adminAuth, deleteParent);

module.exports = router;
