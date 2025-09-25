const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bidderName: {
    type: String,
    required: [true, 'Bidder name is required'],
    trim: true,
    maxlength: [100, 'Bidder name cannot exceed 100 characters']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid mobile number']
  },
  bidAmount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [1, 'Bid amount must be at least 1']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const landSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Land image is required']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    maxlength: [100, 'Owner name cannot exceed 100 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Location address is required']
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    }
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: [0.1, 'Area must be at least 0.1 acres']
  },
  soilType: {
    type: String,
    required: [true, 'Soil type is required'],
    enum: ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Chalky'],
    trim: true
  },
  resources: {
    type: [String],
    default: []
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  bids: [bidSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
landSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual to check if bidding is still active (within 7 days)
landSchema.virtual('isBiddingActive').get(function() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.createdAt > sevenDaysAgo;
});

// Virtual to get days remaining for bidding
landSchema.virtual('daysRemaining').get(function() {
  const sevenDaysFromCreation = new Date(this.createdAt);
  sevenDaysFromCreation.setDate(sevenDaysFromCreation.getDate() + 7);
  const now = new Date();
  const timeDiff = sevenDaysFromCreation - now;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return Math.max(0, daysRemaining);
});

// Ensure virtual fields are serialized
landSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Land', landSchema);
