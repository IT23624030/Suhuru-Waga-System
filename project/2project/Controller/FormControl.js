const Form = require("../Model/FormModel");

// Upload form
const uploadForm = async (req, res) => {
    const { title } = req.body;
    if (!req.file || !title) {
        return res.status(400).json({ message: "File and title are required" });
    }
    try {
        const form = new Form({
            title: title,
            file: req.file.filename
        });
        await form.save();
        res.status(200).json({ message: "Form uploaded", form });
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
};

// List all forms
const listForms = async (req, res) => {
    try {
        const forms = await Form.find().sort({ _id: -1 });
        res.json({ forms });
    } catch {
        res.status(500).json({ forms: [] });
    }
};

module.exports = { uploadForm, listForms };