const express = require("express");
const router = express.Router();
const UserPlan = require("../models/UserPlan");

router.post("/savePlan", async (req, res) => {
  try {
    const { email, cropname, weather, plan } = req.body;

    if (!email || !cropname || !weather || !plan) {
      return res.status(400).json({ status: "error", message: "Missing fields" });
    }

    const newPlan = new UserPlan({ email, cropname, weather, plan });
    await newPlan.save();

    return res.json({ status: "ok", message: "Plan saved successfully" });
  } catch (err) {
    console.error("Error saving plan:", err);
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

module.exports = router;
