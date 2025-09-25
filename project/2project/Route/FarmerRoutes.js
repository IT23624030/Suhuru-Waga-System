const express = require("express");
const router = express.Router();
const FarmerController = require("../Controller/FarmerControl");

// CRUD routes
router.get("/username/:username", FarmerController.getFarmerByUsername);
router.get("/", FarmerController.getAllFarmers);
router.post("/", FarmerController.addFarmer);
router.post("/bulk", FarmerController.bulkInsertFarmers);
router.get("/:id", FarmerController.getFarmerById);
router.patch("/:id", FarmerController.updateFarmer);
router.put("/bulk/update", FarmerController.bulkUpdateFarmers);
router.delete("/:id", FarmerController.deleteFarmer);


module.exports = router;