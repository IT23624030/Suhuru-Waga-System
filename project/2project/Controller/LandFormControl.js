const LandForm = require("../Model/LandForm.js");

// Upload a new land form
const uploadLandForm = async (req, res) => {
    const { title } = req.body;
    // Check if both the file and title are present in the request
    if (!req.file || !title) {
        return res.status(400).json({ message: "File and title are required" });
    }
    try {
        // Create a new LandForm document in the database
        const landForm = new LandForm({
            title: title,
            file: req.file.filename // Use the filename provided by multer
        });
        await landForm.save();
        res.status(200).json({ message: "Land form uploaded successfully", landForm });
    } catch (err) {
        // Handle database or server errors
        res.status(500).json({ message: "Upload failed due to a server error." });
    }
};

// List all uploaded land forms
const listLandForms = async (req, res) => {
    try {
        // Find all documents and sort them by creation date
        const landForms = await LandForm.find().sort({ _id: -1 });
        res.json({ landForms });
    } catch {
        res.status(500).json({ landForms: [] });
    }
};

module.exports = { uploadLandForm, listLandForms };
