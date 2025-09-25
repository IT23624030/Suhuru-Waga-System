const Bcancelorder = require("../Model/BcancelorderModel");

// Create a cancel order
const createBcancelorder = async (req, res) => {
  try {
    const { cancel_id, order_id, reason, refund_status } = req.body;

    const newCancel = new Bcancelorder({
      cancel_id,
      order_id,
      reason,
      refund_status
    });

    const saved = await newCancel.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all cancel orders
const getBcancelorders = async (req, res) => {
  try {
    const cancels = await Bcancelorder.find().populate("order_id");
    res.status(200).json(cancels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get single cancel order by ID
const getBcancelorderById = async (req, res) => {
  try {
    const cancel = await Bcancelorder.findById(req.params.id).populate("order_id");
    if (!cancel) return res.status(404).json({ error: "Cancel order not found" });
    res.status(200).json(cancel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete cancel order
const deleteBcancelorder = async (req, res) => {
  try {
    const deleted = await Bcancelorder.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Cancel order not found" });
    }
    res.status(200).json({ message: "Cancel order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBcancelorder,
  getBcancelorders,
  getBcancelorderById,
  deleteBcancelorder   // ✅ added export
};
