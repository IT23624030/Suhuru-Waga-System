const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const FarmerSchema = new Schema({
  farmerId: { 
    type: String, 
    unique: true, 
    default: () => uuidv4() // ✅ Call the function to generate a UUID
  },
  personalInfo: {
    name: { type: String, required: true, unique: true },
    contactNumber: String,
    email: String,
    location: String,
    languagePreference: { type: String, enum: ["Sinhala", "Tamil", "English"] }
  },
  farmingProfile: {
    experienceYears: Number,
    cropsGrown: [String],
    landOwned: Number,
    certifications: [String]
  },
  incomeTracker: {
    totalIncome: Number,
    totalExpenses: Number,
    lastUpdated: { type: Date, default: Date.now }
  },
  landBids: [
    {
      landId: mongoose.Schema.Types.ObjectId,
      bidPrice: Number,
      proposal: String,
      status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
    }
  ],
  marketplaceListings: [
    {
      cropType: String,
      quantity: Number,
      pricePerUnit: Number,
      location: String,
      postedDate: { type: Date, default: Date.now }
    }
  ],
  ratings: {
    averageRating: Number,
    reviews: [
      {
        reviewerId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
      }
    ]
  }
});

module.exports = mongoose.model("FarmerModel", FarmerSchema);
