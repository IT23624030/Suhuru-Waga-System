const Provider = require("../Model/ProviderModel");

// ----------------- Get All Providers -----------------
const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find();
    if (!providers || providers.length === 0) {
      return res.status(404).json({ message: "No providers found" });
    }
    res.status(200).json(providers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// ----------------- Get Provider by ID -----------------
const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// ----------------- Create Single Provider -----------------
const createProvider = async (req, res) => {
  try {
    const provider = new Provider(req.body);
    const savedProvider = await provider.save();
    res.status(201).json(savedProvider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create provider" });
  }
};

// ----------------- Add Provider (Custom Fields) -----------------
const addProvider = async (req, res) => {
  const { name, company, contactNumber, email, resources } = req.body;

  const newProvider = new Provider({
    name,
    company,
    contactNumber,
    email,
    resources,
  });

  try {
    await newProvider.save();
    return res.status(201).json({ provider: newProvider });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add provider" });
  }
};

// ----------------- Bulk Insert Providers -----------------
const bulkInsertProviders = async (req, res) => {
  try {
    const providersData = req.body.providers; // Expect array
    if (!Array.isArray(providersData) || providersData.length === 0) {
      return res.status(400).json({ error: "providers array is required" });
    }

    const insertedProviders = await Provider.insertMany(providersData);
    res
      .status(201)
      .json({ insertedCount: insertedProviders.length, providers: insertedProviders });
  } catch (err) {
    console.error("Error bulk inserting providers:", err);
    res.status(500).json({ error: "Failed to bulk insert providers" });
  }
};

// ----------------- Update Single Provider -----------------
const updateProvider = async (req, res) => {
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json(updatedProvider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update provider" });
  }
};

// ----------------- Bulk Update Providers -----------------
const bulkUpdateProviders = async (req, res) => {
  try {
    const updates = req.body.updates; 
    // Expect: [{ id: "...", data: {...} }, { id: "...", data: {...} }]

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "updates array is required" });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: update.data },
      },
    }));

    const result = await Provider.bulkWrite(bulkOps);
    res.status(200).json({
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("Error bulk updating providers:", err);
    res.status(500).json({ error: "Failed to bulk update providers" });
  }
};

// ----------------- Delete Provider -----------------
const deleteProvider = async (req, res) => {
  try {
    const deletedProvider = await Provider.findByIdAndDelete(req.params.id);
    if (!deletedProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json({ message: "Provider deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete provider" });
  }
};

const getProviderByName = async (req, res) => {
  try {
    const name = req.params.name;
    const provider = await Provider.findOne({ name: name });
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = {
  getAllProviders,
  getProviderById,
  createProvider,
  addProvider,
  bulkInsertProviders,
  updateProvider,
  bulkUpdateProviders,
  deleteProvider,
  getProviderByName,
};