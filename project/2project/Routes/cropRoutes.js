const express = require('express');
const router = express.Router();
const cropController = require('../Controllers/CropController');

// Create new crop
router.post('/crop', cropController.createCrop);

// Get all crops
router.get('/crops', cropController.getCrops);

// Get single crop by ID
router.get('/crop/:id', cropController.getCropById);

// Update crop
router.put('/crop/:id', cropController.updateCrop);

// Delete crop
router.delete('/crop/:id', cropController.deleteCrop);

module.exports = router;
