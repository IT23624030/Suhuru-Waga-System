const express = require("express");
const router = express.Router();
const Resource = require("../Model/Resources");
const Booking = require("../Model/BookingModel");

// GET /api/demand/report
router.get("/report", async (req, res) => {
  try {
    const resources = await Resource.find();
    const bookings = await Booking.find();

    const report = resources.map((resource) => {
      const resourceBookings = bookings.filter(
        (b) => b.resourceId.toString() === resource._id.toString()
      );
      const totalBookedHours = resourceBookings.reduce(
        (acc, curr) => acc + (curr.durationHours || 0),
        0
      );
      const availableUnits = resource.availability.availableUnits || 1;
      const demandPercentage = Math.min(
        100,
        Math.round((totalBookedHours / availableUnits) * 100)
      );
      return {
        resourceId: resource._id,
        name: resource.name,
        category: resource.category,
        totalUnits: resource.availability.totalUnits,
        availableUnits: resource.availability.availableUnits,
        totalBookedHours,
        demandPercentage,
      };
    });

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching demand report:", error);
    res.status(500).json({ message: "Failed to fetch demand report", error });
  }
});

module.exports = router;