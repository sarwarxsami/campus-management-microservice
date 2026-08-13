const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const adminOnly = require("../middlewares/adminMiddleware");

router.get("/students", adminOnly, userController.getStudents);
router.get("/",         adminOnly, userController.getUsers);

module.exports = router;