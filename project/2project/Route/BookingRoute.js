const express = require("express");
const path = require("path");
const multer = require("multer");
const {
  createBooking,
  bulkCreateBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  bulkDeleteBookings,
  getUserBookings,
  uploadReceipt, // <-- added
} = require("../Controller/BookingControl");

const router = express.Router();

// ================== MULTER CONFIGURATION ==================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================== ROUTES ==================

// Bulk create bookings
router.post("/bulk", bulkCreateBookings);

// Create single booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getAllBookings);

// Get bookings for a specific user
// Must come BEFORE /:id to avoid route conflicts
router.get("/user/:userId", getUserBookings);

// Upload receipt & confirm booking
router.post("/:id/confirm", upload.single("receipt"), uploadReceipt);

// Get single booking by ID
router.get("/:id", getBookingById);

// Update booking status
router.put("/:id/status", updateBookingStatus);

// Bulk delete bookings
router.delete("/bulk", bulkDeleteBookings);

// Delete single booking
router.delete("/:id", deleteBooking);

module.exports = router;
