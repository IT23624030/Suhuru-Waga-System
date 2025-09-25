
const express = require('express');
const router = express.Router();
const createPlanController = require('../Controllers/PlanControler');

// Create a new plan
router.post('/createPlan', createPlanController.createCreatePlan);

// Get all plans (optional)
router.get('/createPlans', createPlanController.getCreatePlans);

module.exports = router;
