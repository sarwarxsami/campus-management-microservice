const express = require("express");
const router = express.Router();
const descriptorController = require("../controller/descriptorController");

router.get("/", descriptorController.getDescriptors);

module.exports = router;