const express = require("express");
const { parentController } = require("../../controllers/admin");
const adminAuth = require("../../middlewares/adminAuth");
const router = express.Router();

// add parent
router.post("/add", adminAuth, parentController.addParent);
// list parent
router.get("/parents", adminAuth, parentController.getParents);
// update parent by id
router.put("/update/:id", adminAuth, parentController.updateParent);
// delete parent by id
router.delete("/delete/:id", adminAuth, parentController.deleteParent);

module.exports = router;
