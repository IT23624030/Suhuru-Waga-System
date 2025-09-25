const Market = require('../Model/Market');

// ✅ Create new market item
exports.createMarket = async (req, res) => {
  const { vegname, price } = req.body;

  if (!vegname || !price) {
    return res.status(400).json({ message: "vegname and price are required." });
  }

  try {
    const newMarket = await Market.create({ vegname, price });
    res.status(201).json(newMarket);
  } catch (err) {
    console.error("Error creating market:", err);
    res.status(500).json({ message: "Server error while creating market item." });
  }
};

// ✅ Get all market items
exports.getMarkets = async (req, res) => {
  try {
    const markets = await Market.find();
    res.status(200).json(markets);
  } catch (err) {
    console.error("Error fetching markets:", err);
    res.status(500).json({ message: "Server error while fetching market items." });
  }
};

// ✅ Get market item by ID
exports.getMarketById = async (req, res) => {
  const { id } = req.params;
  try {
    const market = await Market.findById(id);
    if (!market) return res.status(404).json({ message: "Market item not found." });
    res.status(200).json(market);
  } catch (err) {
    console.error("Error fetching market item:", err);
    res.status(500).json({ message: "Server error while fetching market item." });
  }
};

// ✅ Update market item
exports.updateMarket = async (req, res) => {
  const { id } = req.params;
  const { vegname, price } = req.body;

  try {
    const updatedMarket = await Market.findByIdAndUpdate(
      id,
      { vegname, price },
      { new: true, runValidators: true }
    );
    if (!updatedMarket) return res.status(404).json({ message: "Market item not found." });

    res.status(200).json({ message: "Market item updated successfully", updatedMarket });
  } catch (err) {
    console.error("Error updating market item:", err);
    res.status(500).json({ message: "Server error while updating market item." });
  }
};

// ✅ Delete market item
exports.deleteMarket = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMarket = await Market.findByIdAndDelete(id);
    if (!deletedMarket) return res.status(404).json({ message: "Market item not found." });

    res.status(200).json({ message: "Market item deleted successfully" });
  } catch (err) {
    console.error("Error deleting market item:", err);
    res.status(500).json({ message: "Server error while deleting market item." });
  }
};
