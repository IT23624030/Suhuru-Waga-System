const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadLandForm, listLandForms } = require("../Controller/LandFormControl.js");

// Multer storage configuration for land form files
const storage = multer.diskStorage({
    // Store files in the 'landformfiles' directory
    destination: (req, file, cb) => cb(null, "landformfiles/"),
    // Create a unique filename using the current timestamp and original extension
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Define the API routes for uploading and listing land forms
router.post("/upload", upload.single("landFormFile"), uploadLandForm);
router.get("/list", listLandForms);

module.exports = router;
