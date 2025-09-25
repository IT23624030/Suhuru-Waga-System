const express = require("express");
const router = express.Router();
const ResourceController = require("../Controller/ResourcesControl");

// ===================== RESOURCE ROUTES =====================

// Get all resources
router.get("/", ResourceController.getAllResources);

// Get resources by user (keep this before /:id to avoid conflicts)
router.get("/user/:userId", ResourceController.getResourcesByUser);

// Get resource by ID
router.get("/:id", ResourceController.getResourceById);

// Create resource
router.post("/", ResourceController.createResource);

// Update resource
router.put("/:id", ResourceController.updateResource);

// ✅ Delete a single resource only
router.delete("/:id", ResourceController.deleteResource);

// ✅ Delete a resource and its associated bookings
router.delete("/:id/full", ResourceController.deleteResourceWithBookings);

// ✅ Bulk operations
router.post("/bulk", ResourceController.createMultipleResources);
router.patch("/bulk", ResourceController.updateMultipleResources);

// ✅ Delete all resources
router.delete("/all", ResourceController.deleteAllResources);

module.exports = router;
