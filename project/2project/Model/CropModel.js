const mongoose = require("mongoose");

const cropSchemaD = new mongoose.Schema({
  crop_name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity_available: { type: Number, required: true },
  location: { type: String, required: true },
  farmer_id: { type: String, required: true },
  image: { type: String }, // store full URL
});

module.exports = mongoose.model("CropModel", cropSchemaD);