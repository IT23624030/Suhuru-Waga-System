const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  company_name: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_method: { type: String, enum: ["cash", "card", "online"], required: true },
  bank_receipt: { type: String }, // file path
  order_pdf: { type: String },    // file path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BpaymentModel", paymentSchema);