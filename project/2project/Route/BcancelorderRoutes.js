const express = require("express");
const router = express.Router();
const {
  createBcancelorder,
  getBcancelorders,
  getBcancelorderById,
  deleteBcancelorder   //  import delete
} = require("../Controlers/BcancelorderController");

// Create cancel order
router.post("/bcancelorders", createBcancelorder);

// Get all cancel orders
router.get("/bcancelorders", getBcancelorders);

// Get single cancel order
router.get("/bcancelorders/:id", getBcancelorderById);

//  Delete cancel order
router.delete("/bcancelorders/:id", deleteBcancelorder);

module.exports = router;
