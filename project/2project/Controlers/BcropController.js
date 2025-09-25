const CropD = require("../Model/BcropModel");

// 🔹 Add Crop
const addCrop = async (req, res) => {
  try {
    const { name, category, price, location, description } = req.body;

    const newCrop = new CropD({
      name,
      category,
      price,
      location,
      description
    });

    await newCrop.save();
    res.status(201).json(newCrop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get Crops (Search + Filter + Sort)
const getCrops = async (req, res) => {
  try {
    const { search_keyword, category, min_price, max_price, location, sort_by } = req.query;

    let filter = {};

    if (search_keyword) {
      filter.name = { $regex: search_keyword, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = Number(min_price);
      if (max_price) filter.price.$lte = Number(max_price);
    }

    // 🔹 Sorting
    let sortOption = {};
    if (sort_by === "price_low_high") sortOption.price = 1;
    if (sort_by === "price_high_low") sortOption.price = -1;
    if (sort_by === "newest") sortOption.createdAt = -1;

    const cropsD = await CropD.find(filter).sort(sortOption);
    res.json(cropsD);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addCrop, getCrops };
