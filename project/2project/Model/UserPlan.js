const mongoose = require("mongoose");

const UserPlanSchema = new mongoose.Schema({
  email: { type: String, required: true },   
  cropname: { type: String, required: true },
  weather: { type: String, required: true },
  plan: { type: String, required: true },
});

module.exports = mongoose.model("UserPlan", UserPlanSchema);
