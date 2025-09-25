const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Link to resource
    resourceId: {
      type: String, // Use UUID string instead of ObjectId
      required: true,
    },

    // Farmer details
    farmerId: {
      type: String, // UUID string
    },
    farmerName: { type: String, trim: true },
    farmerContact: { type: String },
    farmerEmail: { type: String },

    // Booking details
    date: { type: Date, required: true },
    durationHours: { type: Number, required: true, min: 1 },

    // Payment info
    partialPayment: { type: Boolean, default: false },
    totalAmount: { type: Number, required: true },

    // Payment breakdown if partial
    paymentDetails: {
      type: [
        {
          amount: { type: Number, required: true },
          dueDate: { type: Date, required: true },
          paid: { type: Boolean, default: false },
        },
      ],
      default: [],
    },

    // Delivery / booking location
    deliveryLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    deliveryAddress: { type: String, trim: true },

    // Booking workflow
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate installments if partialPayment is true
bookingSchema.pre("save", function (next) {
  if (this.partialPayment && this.paymentDetails.length === 0) {
    const halfAmount = parseFloat((this.totalAmount / 2).toFixed(2));
    const now = new Date();
    const dueDate1 = now;
    const dueDate2 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week later

    this.paymentDetails = [
      { amount: halfAmount, dueDate: dueDate1, paid: false },
      { amount: this.totalAmount - halfAmount, dueDate: dueDate2, paid: false },
    ];
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);