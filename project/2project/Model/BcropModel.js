const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  location: String,
  description: String,
}, { timestamps: true }); // for "newest" sorting

module.exports = mongoose.model("BcropModel", cropSchema);
