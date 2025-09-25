const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema({
  district: { type: String, required: true },
  start: { type: String, required: true },
  whether: { type: String, required: true },
  crops: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Crop", CropSchema);
