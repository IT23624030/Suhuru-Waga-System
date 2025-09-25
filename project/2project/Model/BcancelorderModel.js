const mongoose = require("mongoose");

const BcancelorderSchema = new mongoose.Schema({
  cancel_id: {
    type: String,
    required: true,
    unique: true
  },
  order_id: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  cancel_date: {
    type: Date,
    default: Date.now
  },
  refund_status: { type: String, enum: ["Pending", "Completed", "Rejected"], default: "Pending" },
});

module.exports = mongoose.model("BcancelorderModel", BcancelorderSchema);
