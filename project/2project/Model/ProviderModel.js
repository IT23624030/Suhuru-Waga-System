const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const ProviderSchema = new Schema({
  providerId: { 
    type: String, 
    unique: true, 
    default: uuidv4 // ✅ auto-generate UUID if not provided
  },

  name: { type: String, required: true, unique: true },
  company: String,
  contactNumber: String,
  email: String,
  resources: [
    {
      type: String,
      availability: [
        {
          date: Date,
          status: { type: String, enum: ["available", "booked"], default: "available" }
        }
      ],
      pricePerHour: Number
    }
  ],
  bookings: [
    {
      farmerId: mongoose.Schema.Types.ObjectId,
      resourceType: String,
      dateBooked: { type: Date, default: Date.now },
      durationHours: Number,
      paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" }
    }
  ]
});

module.exports =mongoose.model(
    "ProviderModel", 
    ProviderSchema
);