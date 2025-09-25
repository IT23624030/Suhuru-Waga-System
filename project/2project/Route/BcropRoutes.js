const express = require("express");
const { addCrop, getCrops } = require("../Controlers/BcropController");

const router = express.Router();

// Insert crop
router.post("/crops", addCrop);

// Search, filter, sort crops
// routes/cropRoutes.js
router.get("/crops", getCrops);


module.exports = router;
