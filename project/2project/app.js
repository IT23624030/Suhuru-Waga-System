//7MurVj5RdGyLPFRN
const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");
const landRoutes = require("./routes/landRoutes");
const bidRoutes = require("./Routes/bidRoutes");
const path = require("path");

//dewmina
const dotenv = require("dotenv");
const farmerRoutes = require("./Route/FarmerRoutes");
const resourcesRoutes = require("./Route/ResourcesRoutes");
const bookingRoutes = require("./Route/BookingRoute");


// LandForm routes (for uploading and listing land forms)
const landFormRoutes = require("./Route/LandFormRoute");

//ravindu
const nrouter = require("./Route/NoticeRoute");
const alertRouter = require("./Route/AlertRoute");
const formRouter = require("./Route/FormRoute");

//chalakshana
const routerA= require("./Route/UserRoutesB");         //changed adding A
const confirmbRouter = require("./Route/ConfirmbRoute");
const cropRoutesD = require("./Route/BcropRoutes");
const paymentRoutes = require("./Route/BpaymentRoutes");
const BcancelorderRoutes =require("./Route/BcancelorderRoutes");
const AcropRoutes = require ("./Route/cropRoutesD")


const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');

// Utility: escape user input for regex usage
function escapeRegex(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Middleware
app.use(express.json());
app.use(cors());
app.use("/users", router);
app.use("/api/lands", landRoutes);
app.use("/api/bids", bidRoutes);
app.use(bodyParser.json());

// LandForm API endpoints
app.use("/landforms", landFormRoutes);

//chalakshana
app.use("/uploads", express.static("uploads"));
app.use("/cropsD", AcropRoutes);



//dewmina
// Routes (prefix with /api for clarity)
app.use("/farmers", farmerRoutes);
app.use("/resources", resourcesRoutes);
app.use("/bookings", bookingRoutes); 
//dewmina
const demandRoutes = require("./Route/DemandRoutes");
app.use("/api/demand", demandRoutes);


//ravindu
app.use("/notices",nrouter);  //1
app.use("/alerts", alertRouter);
app.use("/forms", formRouter);
app.use("/formfiles", express.static("formfiles")); // serve uploaded forms
app.use("/files", express.static("files")); //resource uploads


//chalakshana
//Use the router
app.use("/usersby",routerA);     //change
app.use("/confirmb", confirmbRouter);         //change
app.use("/api", cropRoutesD);
app.use("/api/payments", paymentRoutes);
app.use("/api/crops", cropRoutesD)
app.use("/api", BcancelorderRoutes);


// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/landformfiles', express.static('landformfiles'));


// -------------------- MongoDB Connection --------------------
mongoose.connect("mongodb+srv://admin:7MurVj5RdGyLPFRN@cluster0.2j9renw.mongodb.net/test?retryWrites=true&w=majority")
  .then(() => console.log("connected to MongoDB"))
  .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));
// -------------------- User Model --------------------
require("./Model/UserModel");
const User = mongoose.model("UserModel");

app.post("/usermodel", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.create({ name, email, password });
    res.send({ status: "ok" });
  } catch (err) {
    res.send({ status: "err" });
  }
});

app.post("/users", async (req, res) => {
  const {
    fullname, age, gender, NIC, contact_number,
    email, address, distric, city, experience, agri_activities, password
  } = req.body;

  // Validate required fields
  if (!fullname || !email || !password || !NIC) {
    return res.status(400).json({ status: "error", message: "Missing required fields." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { NIC }] });
    if (existingUser) {
      return res.status(409).json({ status: "error", message: "User with this email or NIC already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullname,
      age,
      gender,
      NIC,
      contact_number,
      email,
      address,
      distric,
      city,
      experience,
      agri_activities,
      password: hashedPassword
    });

    await newUser.save();
    return res.status(201).json({ status: "ok", message: "User successfully created", user: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ status: "error", message: "Server error while creating user." });
  }
});

// Login model
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Use email field
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "failed", message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ status: "failed", message: "Incorrect password." });
    }

    // Return full user object except password
    const { password: pwd, ...userWithoutPassword } = user._doc;
    return res.json({
      status: "ok",
      message: "Login successful",
      user: userWithoutPassword
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});
// -------------------- Market Model --------------------
const MarketSchema = new mongoose.Schema({
  vegname: { type: String, required: true },
  price: { type: Number, required: true },
}, { collection: "market" });
const Market = mongoose.model("Market", MarketSchema);

// Endpoint to fetch all vegetables (for the dropdown)
app.get("/market", async (req, res) => {
  try {
    const vegetables = await Market.find({});
    res.json(vegetables);
  } catch (err) {
    console.error("Error fetching vegetables:", err);
    res.status(500).json({ message: "Error fetching vegetables" });
  }
});

// Get all Market items
app.get("/markets", async (req, res) => {
  try {
    const markets = await Market.find({});
    res.json(markets);
  } catch (err) {
    console.error("Error fetching Market items:", err);
    res.status(500).json({ message: "Server error while fetching Market items." });
  }
});

// Create a new Market item
app.post("/market", async (req, res) => {
  const { vegname, price } = req.body;

  if (!vegname || !price) {
    return res.status(400).json({ message: "vegname and price are required." });
  }

  try {
    const newMarket = new Market({ vegname, price });
    const savedMarket = await newMarket.save();
    res.status(201).json(savedMarket);
  } catch (err) {
    console.error("Error creating Market item:", err);
    res.status(500).json({ message: "Server error while creating Market item." });
  }
});

// Update a Market item
app.put("/market/:id", async (req, res) => {
  const { id } = req.params;
  const { vegname, price } = req.body;

  try {
    const updatedMarket = await Market.findByIdAndUpdate(
      id,
      { vegname, price },
      { new: true, runValidators: true }
    );

    if (!updatedMarket) return res.status(404).json({ message: "Market item not found." });

    res.json({ message: "Market item updated successfully", updatedMarket });
  } catch (err) {
    console.error("Error updating Market item:", err);
    res.status(500).json({ message: "Server error while updating Market item." });
  }
});

// Get a Market item by ID
app.get("/market/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const market = await Market.findById(id);
    if (!market) return res.status(404).json({ message: "Market item not found." });
    res.json(market);
  } catch (err) {
    console.error("Error fetching Market item:", err);
    res.status(500).json({ message: "Server error while fetching Market item." });
  }
});

// Delete a Market item
app.delete("/market/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMarket = await Market.findByIdAndDelete(id);
    if (!deletedMarket) return res.status(404).json({ message: "Market item not found." });
    res.json({ message: "Market item deleted successfully" });
  } catch (err) {
    console.error("Error deleting Market item:", err);
    res.status(500).json({ message: "Server error while deleting Market item." });
  }
});


// -------------------- Search vegetables (new) --------------------
app.get("/market/search/:query", async (req, res) => {
  const { query } = req.params;
  try {
    const results = await Market.find({
      vegname: { $regex: new RegExp(query, "i") }
    });
    res.json(results);
  } catch (err) {
    console.error("Error searching vegetables:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- Calculator API --------------------
app.post("/calculate", async (req, res) => {
  const { vegetable, quantity, unit } = req.body;
  console.log("Received calculation request:", { vegetable, quantity, unit });

  try {
    const marketData = await Market.findOne({ vegname: vegetable });
    if (!marketData) {
      return res.status(404).json({ error: "Vegetable not found in DB" });
    }

    const qtyInKg = unit === "g" ? quantity / 1000 : quantity;
    const earnings = qtyInKg * marketData.price;

    res.json({
      vegetable: marketData.vegname,
      quantity,
      unit,
      pricePerKg: marketData.price,
      earnings: earnings.toFixed(2),
    });
  } catch (err) {
    console.error("Error during calculation:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- Crop Model --------------------
const CropSchema = new mongoose.Schema({
  district: { type: String, required: true },
  start: { type: String, required: true },
  whether: { type: String, required: true },
  crops: { type: String, required: true },
}, { collection: "crops" });
const Crop = mongoose.model("Crop", CropSchema);

// -------------------- CRUD Endpoints --------------------

// Get all crops (for table or dropdown)
app.get("/crops", async (req, res) => {
  try {
    const allCrops = await Crop.find({});
    res.json(allCrops);
  } catch (err) {
    console.error("Error fetching crops:", err);
    res.status(500).json({ message: "Error fetching crops" });
  }
});

// Get single crop by ID
app.get("/crop/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const crop = await Crop.findById(id);
    if (!crop) return res.status(404).json({ message: "Crop not found." });
    res.json(crop);
  } catch (err) {
    console.error("Error fetching crop:", err);
    res.status(500).json({ message: "Server error while fetching crop." });
  }
});

// Create new crop
app.post("/crop", async (req, res) => {
  const { district, start, whether, crops } = req.body;

  if (!district || !start || !whether || !crops) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newCrop = new Crop({ district, start, whether, crops });
    const savedCrop = await newCrop.save();
    res.status(201).json(savedCrop);
  } catch (err) {
    console.error("Error creating crop:", err);
    res.status(500).json({ message: "Server error while creating crop." });
  }
});

// Update crop
app.put("/crop/:id", async (req, res) => {
  const { id } = req.params;
  const { district, start, whether, crops } = req.body;

  try {
    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      { district, start, whether, crops },
      { new: true, runValidators: true }
    );

    if (!updatedCrop) return res.status(404).json({ message: "Crop not found." });

    res.json({ message: "Crop updated successfully", updatedCrop });
  } catch (err) {
    console.error("Error updating crop:", err);
    res.status(500).json({ message: "Server error while updating crop." });
  }
});

// Delete crop
app.delete("/crop/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCrop = await Crop.findByIdAndDelete(id);
    if (!deletedCrop) return res.status(404).json({ message: "Crop not found." });
    res.json({ message: "Crop deleted successfully" });
  } catch (err) {
    console.error("Error deleting crop:", err);
    res.status(500).json({ message: "Server error while deleting crop." });
  }
});

// -------------------- Crop Routes --------------------
// Unique districts
app.get("/districts", async (req, res) => {
  try {
    const districts = await Crop.distinct("district");
    res.json(districts);
  } catch (err) {
    console.error("Error fetching districts:", err);
    res.status(500).json({ message: "Error fetching districts" });
  }
});

// Get crops by district
app.get("/crops/:district", async (req, res) => {
  const { district } = req.params;
  try {
    const cropsFromDb = await Crop.find({
      district: { $regex: new RegExp(district, "i") }
    });
    if (!cropsFromDb || cropsFromDb.length === 0) {
      return res.status(404).json({ message: "No crops found for this district" });
    }

    const formattedCrops = cropsFromDb.map(doc => ({
      district: doc.district,
      whether: doc.whether,
      startMonths: [doc.start],
      crops: [{ cropname: doc.crops, _id: doc._id }],
    }));

    res.json(formattedCrops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching crops" });
  }
});

// -------------------- Plan Model --------------------
const PlanSchema = new mongoose.Schema({
  cropname: { type: String, required: true, unique: true },
  plan: { type: String, required: true },
}, { collection: "plan" });
const Plan = mongoose.model("Plan", PlanSchema);

// Get plan by crop name
app.get("/plan/:cropname", async (req, res) => {
  try {
    const { cropname } = req.params;
    const plan = await Plan.findOne({
      cropname: { $regex: new RegExp(`^${cropname}$`, "i") }
    });
    if (!plan) {
      return res.status(404).json({ message: "Plan not found for the specified crop." });
    }
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while fetching the plan." });
  }
});

// -------------------- NEW USER FEATURES --------------------

app.get("/user/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: "failed", message: "User not found." });
    res.json({ status: "ok", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Update user profile
app.put("/user/:email", async (req, res) => {
  const { email } = req.params;
  const { name, newEmail, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: "failed", message: "User not found." });

    if (name) user.name = name;
    if (newEmail) user.email = newEmail;
    if (password) user.password = password;

    await user.save();
    res.json({ status: "ok", message: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});


// -------------------- Update all user details --------------------
app.put("/user/updateAll/:email", async (req, res) => {
  const { email } = req.params;
  const updateData = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: "failed", message: "User not found" });

    // Update fields
    for (const key in updateData) {
      if (key === "password" && updateData.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(updateData.password, salt);
      } else if (key !== "email") {
        user[key] = updateData[key];
      }
    }

    await user.save();

    const { password, ...userWithoutPassword } = user._doc;
    res.json({ status: "ok", message: "User updated successfully", user: userWithoutPassword });

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// -------------------- Change password separately --------------------
app.put("/user/:email/password", async (req, res) => {
  const { email } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: "failed", message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ status: "failed", message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ status: "ok", message: "Password changed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Delete user account
app.delete("/user/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) return res.status(404).json({ status: "failed", message: "User not found." });

    res.json({ status: "ok", message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});


// -------------------- CreatePlan Model --------------------
const CreatePlan = require('./Model/CreatePlan'); // adjust path if needed

// Get all CreatePlans
app.get("/createPlans", async (req, res) => {
  try {
    const plans = await CreatePlan.find({});
    res.json(plans);
  } catch (err) {
    console.error("Error fetching CreatePlans:", err);
    res.status(500).json({ message: "Server error while fetching CreatePlans." });
  }
});

// Create a new CreatePlan
app.post("/createPlan", async (req, res) => {
  const { cropname, weather, plan } = req.body;

  if (!cropname || !weather || !plan) {
    return res.status(400).json({ message: "Crop name, weather, and plan are required." });
  }

  try {
    const newPlan = new CreatePlan({ cropname, weather, plan });
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    console.error("Error creating CreatePlan:", err);
    res.status(500).json({ message: "Server error while creating CreatePlan." });
  }
});

// Update a plan
app.put("/createPlan/:id", async (req, res) => {
  const { id } = req.params;
  const { cropname, weather, plan } = req.body;

  try {
    const updatedPlan = await CreatePlan.findByIdAndUpdate(
      id,
      { cropname, weather, plan },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) return res.status(404).json({ message: "CreatePlan not found." });

    res.json({ message: "CreatePlan updated successfully", updatedPlan });
  } catch (err) {
    console.error("Error updating CreatePlan:", err);
    res.status(500).json({ message: "Server error while updating CreatePlan." });
  }
});


// Get a plan by ID
app.get("/createPlan/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await CreatePlan.findById(id);
    if (!plan) return res.status(404).json({ message: "CreatePlan not found." });
    res.json(plan);
  } catch (err) {
    console.error("Error fetching CreatePlan:", err);
    res.status(500).json({ message: "Server error while fetching CreatePlan." });
  }
});



// Delete a plan
app.delete("/createPlan/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlan = await CreatePlan.findByIdAndDelete(id);
    if (!deletedPlan) return res.status(404).json({ message: "CreatePlan not found." });
    res.json({ message: "CreatePlan deleted successfully" });
  } catch (err) {
    console.error("Error deleting CreatePlan:", err);
    res.status(500).json({ message: "Server error while deleting CreatePlan." });
  }
});

// plan fetch by crop and weather
app.get("/createPlanByCrop/:cropname/:weather", async (req, res) => {
  const { cropname, weather } = req.params;
  try {
    const cropSafe = escapeRegex(cropname).trim();
    const weatherSafe = escapeRegex(weather).trim();
    console.log("[createPlanByCrop] incoming:", { cropname, weather });
    let plan = await CreatePlan.findOne({
      cropname: { $regex: new RegExp(`^\\s*${cropSafe}\\s*$`, "i") },
      weather: { $regex: new RegExp(`^\\s*${weatherSafe}\\s*$`, "i") },
    });

    // Fallback: looser contains match if exact trimmed match fails
    if (!plan) {
      plan = await CreatePlan.findOne({
        cropname: { $regex: new RegExp(cropSafe, "i") },
        weather: { $regex: new RegExp(weatherSafe, "i") },
      });
    }

    if (!plan) {
      console.warn("[createPlanByCrop] no plan found", { crop: cropSafe, weather: weatherSafe });
      return res.status(404).json({ message: `Plan not found for crop "${cropname}" with weather "${weather}".` });
    }
    res.json(plan);
  } catch (err) {
    console.error("Error fetching plan by crop and weather:", err);
    res.status(500).json({ message: "Server error while fetching plan." });
  }
});

app.post("/user/savePlan", async (req, res) => {
  try {
    const { userId, cropname, weather, plan } = req.body;
    if (!userId || !cropname || !weather || !plan) {
      return res.status(400).json({ status: "error", message: "Missing fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    user.savedPlans = user.savedPlans || [];
    user.savedPlans.push({ cropname, weather, plan });

    await user.save();
    return res.json({ status: "ok", message: "Plan saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Failed to save plan" });
  }
});

const UserPlan = require("./Model/UserPlan");

// Save a new plan
app.post("/userPlan/savePlan", async (req, res) => {
  try {
    const { email, cropname, weather, plan } = req.body;
    if (!email || !cropname || !weather || !plan) {
      return res.status(400).json({ status: "error", message: "Missing fields" });
    }

    const newPlan = new UserPlan({ email, cropname, weather, plan });
    await newPlan.save();

    res.json({ status: "ok", message: "Plan saved successfully" });
  } catch (err) {
    console.error("Error saving user plan:", err);
    res.status(500).json({ status: "error", message: "Failed to save plan" });
  }
});


// Delete a saved user plan by ID
app.delete("/userPlan/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the plan
    const deletedPlan = await UserPlan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ status: "error", message: "Plan not found" });
    }

    res.json({ status: "ok", message: "Plan deleted successfully" });
  } catch (err) {
    console.error("Error deleting user plan:", err);
    res.status(500).json({ status: "error", message: "Failed to delete plan" });
  }
});


// Get all plans for a specific user
app.get("/userPlan/getPlans/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const plans = await UserPlan.find({ email });

    res.json({ status: "ok", plans });
  } catch (err) {
    console.error("Error fetching user plans:", err);
    res.status(500).json({ status: "error", message: "Failed to fetch plans" });
  }
});

// ------------------ Endpoint to get counts ------------------
app.get("/users-count", async (req, res) => {
  try {
    // Count users with @gmail.com
    const usersCount = await User.countDocuments({ email: /@gmail\.com$/i });

    // Count workers with @suhuru.lk
    const workersCount = await User.countDocuments({ email: /@suhuru\.lk$/i });

    res.json({
      status: "ok",
      counts: {
        users: usersCount,
        workers: workersCount
      }
    });
  } catch (err) {
    console.error("Error fetching counts:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});


// -------------------- Market Data Endpoint for Chart --------------------
app.get("/api/market-data", async (req, res) => {
  try {
    const marketData = await Market.find({}, "vegname price");
    const formattedData = marketData.map(item => ({
      vegname: item.vegname,
      price: Number(item.price) // Ensure price is numeric
    }));
    res.json({ status: "ok", data: formattedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error fetching market data" });
  }
});


//Dewmina
// Default test route
app.get("/", (req, res) => {
  res.send("API is running...");
});


//ravindu

//pdf
const multer = require("multer");  
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
});

//Insert Model
require("./Model/ResourceModel");
const pdfSchema = mongoose.model("ResourceModel");
const upload = multer({ storage: storage });

app.post("/Resource/upload", upload.single("formFile"), async (req, res) => {
    console.log(req.file);
    const title=req.body.title;
    const pdf=req.file.filename;
    try{
        await pdfSchema.create({ title, pdf });
        console.log("PDF uploaded successfully");
        res.send({status:200});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading PDF" });
    }
});

//get file
app.get("/Resource/getpdf", async (req, res) => {
    try {
        const allPdf = await pdfSchema.find();
        res.send({ status: 200, data: allPdf });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching PDFs" });
    }
});