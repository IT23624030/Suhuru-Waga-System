const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadForm, listForms } = require("../Controller/FormControl");

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "formfiles/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post("/upload", upload.single("formFile"), uploadForm);
router.get("/list", listForms);

module.exports = router;