const mongoose = require("mongoose");
const Booking = require("../Model/BookingModel");
const Resource = require("../Model/Resources");
const path = require("path");

// ===================== CREATE SINGLE BOOKING =====================
const createBooking = async (req, res) => {
  try {
    const {
      resourceId,
      farmerId,
      farmerName,
      farmerContact,
      farmerEmail,
      date,
      durationHours,
      partialPayment,
      totalAmount,
      deliveryLocation,
      deliveryAddress,
    } = req.body;

    if (!resourceId || typeof resourceId !== "string")
      return res.status(400).json({ message: "Invalid resourceId" });
    if (!farmerId || typeof farmerId !== "string")
      return res.status(400).json({ message: "Invalid farmerId" });

    const resource = await Resource.findOne({ _id: resourceId });
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const booking = new Booking({
      resourceId,
      farmerId,
      farmerName,
      farmerContact,
      farmerEmail,
      date,
      durationHours,
      partialPayment,
      totalAmount,
      deliveryLocation,
      deliveryAddress,
    });

    await booking.save();

    res.status(201).json({
      message: partialPayment
        ? "Booking request submitted with partial payment. Await confirmation."
        : "Booking request submitted. Await confirmation.",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Failed to create booking", error });
  }
};

const uploadReceipt = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only allow receipt upload; status remains Pending
    if (req.file) {
      booking.receiptFileName = req.file.filename; // save filename in DB
      booking.status = "Pending"; // keep as pending until owner confirms
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }

    await booking.save();

    res.status(200).json({ message: "Receipt uploaded. Waiting for owner confirmation.", booking });
  } catch (err) {
    console.error("Upload receipt error:", err);
    res.status(500).json({ message: "Failed to upload receipt", error: err.message });
  }

};

// ===================== BULK CREATE BOOKINGS =====================
const bulkCreateBookings = async (req, res) => {
  try {
    const bookingsData = req.body.bookings;
    if (!Array.isArray(bookingsData) || bookingsData.length === 0)
      return res.status(400).json({ message: "No bookings provided" });

    const validBookings = bookingsData.map((b) => {
      if (!b.resourceId || typeof b.resourceId !== "string")
        throw new Error(`Invalid resourceId: ${b.resourceId}`);
      if (!b.farmerId || typeof b.farmerId !== "string")
        throw new Error(`Invalid farmerId: ${b.farmerId}`);
      return b;
    });

    const createdBookings = await Booking.insertMany(validBookings);
    res.status(201).json({
      message: `${createdBookings.length} bookings created successfully`,
      bookings: createdBookings,
    });
  } catch (err) {
    console.error("Bulk create error:", err);
    res.status(500).json({ message: "Failed to create bookings", error: err.message });
  }
};

// ===================== GET BOOKINGS =====================
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string")
      return res.status(400).json({ message: "Invalid booking ID" });

    const booking = await Booking.findOne({ _id: id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking", error });
  }
};

// ===================== UPDATE BOOKING STATUS =====================
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["Pending", "Confirmed", "Rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const booking = await Booking.findOneAndUpdate({ _id: id }, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking", error });
  }
};

// ===================== DELETE BOOKINGS =====================
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOneAndDelete({ _id: id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking", error });
  }
};

const bulkDeleteBookings = async (req, res) => {
  try {
    const { bookingIds } = req.body;
    const validIds = bookingIds.filter((id) => id && typeof id === "string");
    const result = await Booking.deleteMany({ _id: { $in: validIds } });
    res.status(200).json({ message: `${result.deletedCount} bookings deleted successfully` });
  } catch (err) {
    console.error("Bulk delete error:", err);
    res.status(500).json({ message: "Failed to delete bookings", error: err.message });
  }
};

// ===================== USER BOOKINGS =====================
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ farmerId: userId }).sort({ date: -1 });

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const resource = await Resource.findOne({ _id: booking.resourceId });
        return {
          ...booking.toObject(),
          resourceName: resource ? resource.name : "Unknown Resource",
          quantity: resource ? resource.availability.totalUnits : 0,
        };
      })
    );

    res.status(200).json(enrichedBookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

// ===================== BOOKINGS FOR RESOURCES OWNED BY USER =====================
const getBookingsForMyResources = async (req, res) => {
  try {
    const { userId } = req.params;
    const myResources = await Resource.find({ ownerId: userId }).select("_id name");
    const myResourceIds = myResources.map((r) => r._id);
    const bookings = await Booking.find({ resourceId: { $in: myResourceIds } }).sort({ date: -1 });

    const enrichedBookings = bookings.map((b) => {
      const resource = myResources.find((r) => r._id.toString() === b.resourceId.toString());
      return {
        ...b.toObject(),
        resourceName: resource ? resource.name : "Unknown Resource",
      };
    });

    res.status(200).json(enrichedBookings);
  } catch (err) {
    console.error("Error fetching bookings for resources:", err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

module.exports = {
  createBooking,
  bulkCreateBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  bulkDeleteBookings,
  getUserBookings,
  getBookingsForMyResources,
  uploadReceipt, // <-- new function for uploading image/pdf
};
