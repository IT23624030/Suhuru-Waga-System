const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserControllers");

// Routes
router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUsers);
router.post("/login", UserController.loginUser); // ✅ fixed route
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;