const express = require("express");
const router = express.Router();
const AlertController = require("../Controller/AlertControl");

router.get("/", AlertController.getAllAlerts);
router.post("/", AlertController.addAlert);
router.get("/:id", AlertController.getById);
router.put("/:id", AlertController.updateAlert);   // Update
router.delete("/:id", AlertController.deleteAlert); // Delete

module.exports = router;