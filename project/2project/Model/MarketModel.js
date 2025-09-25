const mongoose = require("mongoose");

const MarketSchema = new mongoose.Schema({
  vegname: { type: String, required: true },
  price: { type: Number, required: true }, 
});

module.exports = mongoose.model("Market", MarketSchema);
