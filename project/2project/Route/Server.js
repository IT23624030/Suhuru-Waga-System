const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Import routes
const bookingRoutes = require("./Route/BookingRoute");
const resourceRoutes = require("./Route/ResourcesRoutes");
const demandRoutes = require("./Route/DemandRoutes");
const farmerRoutes = require("./Route/FarmerRoute");
const providerRoutes = require("./Route/ProviderRoutes");

dotenv.config();

const app = express();

// ===== Middleware =====
// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:3000", // your React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if using cookies/auth
  })
);

// Parse incoming JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Routes =====
app.use("/bookings", bookingRoutes);
app.use("/resources", resourceRoutes);
app.use("/demand", demandRoutes);
app.use("/farmers", farmerRoutes);
app.use("/providers", providerRoutes);

// Optional health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ===== Database Connection =====
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yourDB";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===== Start Server =====
const PORT = process.env.PORT || 5000; // make sure it matches your frontend fetch URL
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);