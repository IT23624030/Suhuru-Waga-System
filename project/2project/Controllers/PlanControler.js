const CreatePlan = require('../Model/CreatePlan');

// Create a new crop plan
exports.createCreatePlan = async (req, res) => {
  const { cropname, weather, plan } = req.body;

  if (!cropname || !weather || !plan) {
    return res.status(400).json({ message: "Crop name, weather, and plan are required." });
  }

  try {
    const newPlan = await CreatePlan.create({ cropname, weather, plan });
    res.status(201).json(newPlan);  // ✅ return JSON
  } catch (err) {
    console.error("Error creating plan:", err);
    res.status(500).json({ message: "Server error while creating plan." });
  }
};

// Get all plans
exports.getCreatePlans = async (req, res) => {
  try {
    const createPlans = await CreatePlan.find();
    res.status(200).json(createPlans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Server error while fetching plans.' });
  }
};

// Get a single plan by ID (optional)
exports.getCreatePlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await CreatePlan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found." });
    res.status(200).json(plan);
  } catch (err) {
    console.error('Error fetching plan:', err);
    res.status(500).json({ message: 'Server error while fetching plan.' });
  }
};

// Update a plan by ID
exports.updateCreatePlan = async (req, res) => {
  const { id } = req.params;
  const { cropname, weather, plan } = req.body;

  try {
    const updatedPlan = await CreatePlan.findByIdAndUpdate(
      id,
      { cropname, weather, plan },
      { new: true, runValidators: true }
    );
    if (!updatedPlan) return res.status(404).json({ message: "Plan not found." });
    res.status(200).json({ message: "Plan updated successfully", updatedPlan });
  } catch (err) {
    console.error('Error updating plan:', err);
    res.status(500).json({ message: 'Server error while updating plan.' });
  }
};

// Delete a plan by ID
exports.deleteCreatePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlan = await CreatePlan.findByIdAndDelete(id);
    if (!deletedPlan) return res.status(404).json({ message: "Plan not found." });
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error('Error deleting plan:', err);
    res.status(500).json({ message: 'Server error while deleting plan.' });
  }
};
