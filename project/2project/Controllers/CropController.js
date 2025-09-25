const Crop = require('../Model/Crop');

// ✅ Create new crop
exports.createCrop = async (req, res) => {
  const { district, start, whether, crops } = req.body;

  if (!district || !start || !whether || !crops) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newCrop = await Crop.create({ district, start, whether, crops });
    res.status(201).json(newCrop);
  } catch (err) {
    console.error("Error creating crop:", err);
    res.status(500).json({ message: "Server error while creating crop." });
  }
};

// ✅ Get all crops
exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json(crops);
  } catch (err) {
    console.error("Error fetching crops:", err);
    res.status(500).json({ message: "Server error while fetching crops." });
  }
};

// ✅ Get crop by ID
exports.getCropById = async (req, res) => {
  const { id } = req.params;
  try {
    const crop = await Crop.findById(id);
    if (!crop) return res.status(404).json({ message: "Crop not found." });
    res.status(200).json(crop);
  } catch (err) {
    console.error("Error fetching crop:", err);
    res.status(500).json({ message: "Server error while fetching crop." });
  }
};

// ✅ Update crop
exports.updateCrop = async (req, res) => {
  const { id } = req.params;
  const { district, start, whether, crops } = req.body;

  try {
    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      { district, start, whether, crops },
      { new: true, runValidators: true }
    );
    if (!updatedCrop) return res.status(404).json({ message: "Crop not found." });

    res.status(200).json({ message: "Crop updated successfully", updatedCrop });
  } catch (err) {
    console.error("Error updating crop:", err);
    res.status(500).json({ message: "Server error while updating crop." });
  }
};

// ✅ Delete crop
exports.deleteCrop = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCrop = await Crop.findByIdAndDelete(id);
    if (!deletedCrop) return res.status(404).json({ message: "Crop not found." });

    res.status(200).json({ message: "Crop deleted successfully" });
  } catch (err) {
    console.error("Error deleting crop:", err);
    res.status(500).json({ message: "Server error while deleting crop." });
  }
};
