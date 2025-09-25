const Crop = require("../Model/CropModel");

// Add new crop
const addCrop = async (req, res) => {
  try {
    const { crop_name, category, price, quantity_available, location, farmer_id } = req.body;
    const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    const crop = new Crop({
      crop_name,
      category,
      price,
      quantity_available,
      location,
      farmer_id,
      image,
    });

    await crop.save();
    res.status(201).json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all crops
const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get crop by ID (Display single)
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update crop
const updateCrop = async (req, res) => {
  try {
    const { crop_name, category, price, quantity_available, location, farmer_id } = req.body;
    const updateData = { crop_name, category, price, quantity_available, location, farmer_id };

    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const crop = await Crop.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    res.json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete crop
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    res.json({ message: "Crop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addCrop, getCrops, getCropById, updateCrop, deleteCrop };