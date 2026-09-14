const express = require("express");
const router = express.Router();
const resourceController = require("../controller/resourceController");
const adminOnly = require("../middlewares/adminMiddleware");

// Order matters — specific paths before param paths
router.get("/available",          resourceController.getAvailableResources);
router.get("/descriptors",        resourceController.getResourceDescriptors);
router.get("/location/:locationId", resourceController.getResourcesByLocation);
router.get("/type/:type",         resourceController.getResourcesByType);
router.get("/:resourceId/reservations", adminOnly, resourceController.getResourceReservations);
router.get("/",                   resourceController.getResources);

module.exports = router;