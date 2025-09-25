const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for LandForm documents
const landFormSchema = new Schema({
    title: { type: String, required: true },
    file: { type: String, required: true }
});

// Export the LandForm model
module.exports = mongoose.model("LandForm", landFormSchema);
