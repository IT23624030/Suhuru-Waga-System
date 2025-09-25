//AI add
/*const express = require("express");
const router = express.Router();
const Resource = require("../Model/ResourceModel");

// List all resources
router.get("/", async (req, res) => {
    try {
        const resources = await Resource.find().sort({ _id: -1 });
        res.json({ resources });
    } catch {
        res.status(500).json({ resources: [] });
    }
});

module.exports = router;*/