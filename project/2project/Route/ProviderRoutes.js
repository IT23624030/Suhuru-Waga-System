const express = require("express");
const router = express.Router();
const ProviderController = require("../Controller/ProviderControl");

// CRUD routes
router.get("/", ProviderController.getAllProviders);
router.get("/:id", ProviderController.getProviderById);
router.get("/name/:name", ProviderController.getProviderByName); // ✅ new route
router.post("/", ProviderController.addProvider);
router.post("/bulk", ProviderController.bulkInsertProviders);
router.put("/:id", ProviderController.updateProvider);
router.put("/bulk/update", ProviderController.bulkUpdateProviders);
router.delete("/:id", ProviderController.deleteProvider);

module.exports = router;