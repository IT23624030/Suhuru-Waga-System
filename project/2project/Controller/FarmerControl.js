const Farmer = require("../Model/FarmerModel");

// ----------------- Get All Farmers -----------------
const getAllFarmers = async (req, res, next) => {
  try {
    const farmers = await Farmer.find();
    if (!farmers || farmers.length === 0) {
      return res.status(200).json({ message: "No farmers found.", farmers: [] });
    }
    return res.status(200).json({ farmers });
  } catch (err) {
    console.error("Error getting farmers:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// ----------------- Add Farmer -----------------
const addFarmer = async (req, res, next) => {
  const { personalInfo, farmingProfile, incomeTracker, landBids, marketplaceListings, ratings } = req.body;

  const newFarmer = new Farmer({
    personalInfo,
    farmingProfile,
    incomeTracker,
    landBids,
    marketplaceListings,
    ratings,
  });

  try {
    await newFarmer.save();
    return res.status(201).json({ farmer: newFarmer });
  } catch (err) {
    console.error("Error adding farmer:", err);
    return res.status(500).json({ error: "Failed to add farmer" });
  }
};

// ----------------- Bulk Insert Farmers -----------------
const bulkInsertFarmers = async (req, res) => {
  try {
    const farmersData = req.body.farmers; // Expect array of farmers
    if (!Array.isArray(farmersData) || farmersData.length === 0) {
      return res.status(400).json({ error: "farmers array is required" });
    }

    const insertedFarmers = await Farmer.insertMany(farmersData);
    res.status(201).json({ insertedCount: insertedFarmers.length, farmers: insertedFarmers });
  } catch (err) {
    console.error("Error bulk inserting farmers:", err);
    res.status(500).json({ error: "Failed to bulk insert farmers" });
  }
};

// ----------------- Get Farmer by ID -----------------
const getFarmerById = async (req, res) => {
  try {
    const farmerData = await Farmer.findById(req.params.id);
    if (!farmerData) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.status(200).json(farmerData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// ----------------- Update Farmer -----------------
const updateFarmer = async (req, res) => {
  try {
    const updatedFarmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFarmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.status(200).json(updatedFarmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update farmer" });
  }
};

// ----------------- Bulk Update Farmers -----------------
const bulkUpdateFarmers = async (req, res) => {
  try {
    const updates = req.body.updates; 
    // Expect [{ id: "...", data: {...} }, { id: "...", data: {...} }]

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "updates array is required" });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: update.data },
      },
    }));

    const result = await Farmer.bulkWrite(bulkOps);
    res.status(200).json({ matched: result.matchedCount, modified: result.modifiedCount });
  } catch (err) {
    console.error("Error bulk updating farmers:", err);
    res.status(500).json({ error: "Failed to bulk update farmers" });
  }
};

// ----------------- Delete Farmer -----------------
const deleteFarmer = async (req, res) => {
  try {
    const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!deletedFarmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.status(200).json({ message: "Farmer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete farmer" });
  }
};

const getFarmerByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const farmerData = await Farmer.findOne({ username });
    if (!farmerData) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.status(200).json(farmerData);
  } catch (err) {
    console.error("Error fetching farmer by username:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = {
  getAllFarmers,
  addFarmer,
  bulkInsertFarmers,
  getFarmerById,
  getFarmerByUsername, // ✅ add the new function here
  updateFarmer,
  bulkUpdateFarmers,
  deleteFarmer,
};