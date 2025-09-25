const mongoose = require("mongoose");

const confirmbSchema = new mongoose.Schema({
  buyerId: { type: String, required: true },
  farmerId: { type: String, required: true },
  cropId: { type: String, required: true },
 
  pricePerKg: { type: Number, required: true },// ✅ Price per kg
  quantity: { type: Number, required: true },
  unit: { type: String, default: "kg" },
  totalPrice: { type: Number, required: true }, // ✅ Total amount
  
  paymentMethod: {
    type: String,
    enum: ["cash on delievery", "online"],
    default: "cash on delievery"
  },
  deliveryaddress: { type: String, required: true },
  orderdate: { type: Date, default: Date.now }
});

// 🔹 Middleware to automatically calculate totalPrice before saving
confirmbSchema.pre("save", function(next) {
  if (this.quantity && this.pricePerKg) {
    this.totalPrice = this.quantity * this.pricePerKg;
  }
  next();
});

// 🔹 Transform JSON output
confirmbSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.orderdate) {
      ret.orderdate = new Date(ret.orderdate).toISOString().split("T")[0];
    }
    return ret;
  }
});

module.exports = mongoose.model("ConfirmbModel", confirmbSchema);