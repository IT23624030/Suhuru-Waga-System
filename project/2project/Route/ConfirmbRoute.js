const express = require("express");
const router = express.Router();
const OrderController = require("../Controlers/ConfirmbControl");

router.get("/", OrderController.getAllOrders);
router.post("/", OrderController.addOrders);
router.get("/:id", OrderController.getById);
router.put("/:id", OrderController.updateOrders);
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;