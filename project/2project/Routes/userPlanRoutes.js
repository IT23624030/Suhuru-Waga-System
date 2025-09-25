const express = require("express");
const router = express.Router();
const userPlanController = require("../Controllers/userPlanController");

// Save a new plan
router.post("/savePlan", userPlanController.savePlan);

// Get all plans for a user by email
router.get("/:email", userPlanController.getUserPlans);

module.exports = router;
