const express = require('express');
const router = express.Router();
const marketController = require('../Controllers/MarketController');

// Create new market item
router.post('/market', marketController.createMarket);

// Get all market items
router.get('/markets', marketController.getMarkets);

// Get single market item
router.get('/market/:id', marketController.getMarketById);

// Update market item
router.put('/market/:id', marketController.updateMarket);

// Delete market item
router.delete('/market/:id', marketController.deleteMarket);

module.exports = router;
