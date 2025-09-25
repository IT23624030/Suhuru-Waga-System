
const mongoose = require('mongoose');

const createPlanSchema = new mongoose.Schema({
  cropname: {
    type: String,
    required: true
  },
  weather: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('CreatePlan', createPlanSchema);
