const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["equipment", "supply", "labor", "other"],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "", // optional, you can leave empty if no image
    },
    providerName: {
      type: String,
      required: true, // ✅ ensure every resource has a provider
      trim: true,
    },
    availability: {
      totalUnits: { type: Number, default: 0 },
      availableUnits: { type: Number, default: 0 },
    },
    booking: [
      {
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timeslot: {
          start: { type: Date, required: true },
          end: { type: Date, required: true },
        },
        status: {
          type: String,
          enum: ["pending", "confirmed", "rejected"],
          default: "pending",
        },
        partialPayment: { type: Number, default: 0 },
      },
    ],
    pricing: {
      baseRate: { type: Number, required: true },
      maxPriceCeiling: { type: Number },
    },
    shortageFlags: {
      isLowStock: { type: Boolean, default: false },
      threshold: { type: Number, default: 5 },
    },
    metadata: {
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
      lastUpdated: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", ResourceSchema);

module.exports = Resource;