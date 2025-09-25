const Alert = require("../Model/AlertModel");

// Get all alerts
const getAllAlerts = async (req, res) => {
    let alerts;
    try {
        alerts = await Alert.find();
    } catch (err) {
        return res.status(500).json({ message: "Error fetching alerts" });
    }
    if (!alerts) return res.status(404).json({ message: "No alerts found" });
    return res.status(200).json({ alerts });
};

// Add alert
const addAlert = async (req, res) => {
    const { type, title, content } = req.body;
    let alert;
    try {
        alert = new Alert({ type, title, content });
        await alert.save();
    } catch (err) {
        return res.status(500).json({ message: "Unable to add alert" });
    }
    return res.status(200).json({ alert });
};

// Get by ID
const getById = async (req, res) => {
    const id = req.params.id;
    let alert;
    try {
        alert = await Alert.findById(id);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching alert" });
    }
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    return res.status(200).json({ alert });
};

// Update
const updateAlert = async (req, res) => {
    const id = req.params.id;
    const { type, title, content } = req.body;
    let alert;
    try {
        alert = await Alert.findByIdAndUpdate(id, { type, title, content }, { new: true });
    } catch (err) {
        return res.status(500).json({ message: "Unable to update alert" });
    }
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    return res.status(200).json({ alert });
};

// Delete
const deleteAlert = async (req, res) => {
    const id = req.params.id;
    let alert;
    try {
        alert = await Alert.findByIdAndDelete(id);
    } catch (err) {
        return res.status(500).json({ message: "Unable to delete alert" });
    }
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    return res.status(200).json({ alert });
};

exports.getAllAlerts = getAllAlerts;
exports.addAlert = addAlert;
exports.getById = getById;
exports.updateAlert = updateAlert;
exports.deleteAlert = deleteAlert;