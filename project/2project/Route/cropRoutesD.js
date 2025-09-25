const express = require("express");
const multer = require("multer");
const { addCrop, getCrops, getCropById, updateCrop, deleteCrop } = require("../Controlers/cropController");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/add", upload.single("image"), addCrop);  // Add new crop
router.get("/", getCrops);                             // Get all crops
router.get("/:id", getCropById);                       // Get crop by ID
router.put("/update/:id", upload.single("image"), updateCrop); // Update crop
router.delete("/delete/:id", deleteCrop);              // Delete crop

module.exports = router;