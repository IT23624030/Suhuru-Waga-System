const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(200).json({ status: "error", message: "No users found" });
        }
        return res.status(200).json({ status: "ok", users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: "Server error while fetching users." });
    }
};

// Add new user
const addUsers = async (req, res) => {
    const { fullname, age, gender, NIC, contact_number, email, address, distric, city, experience, agri_activities, password } = req.body;

    if (!fullname || !email || !password || !NIC) {
        return res.status(200).json({ status: "error", message: "Missing required fields." });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { NIC }] });
        if (existingUser) {
            return res.status(200).json({ status: "error", message: "A user with this email or NIC already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
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
            password: hashedPassword,
        });

        await newUser.save();
        return res.status(201).json({ status: "ok", message: "User successfully created", user: newUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: "Failed to save user to the database." });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({ status: "error", message: "Email and password are required." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(200).json({ status: "error", message: "Invalid credentials." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(200).json({ status: "error", message: "Invalid credentials." });
        }

        return res.status(200).json({
            status: "ok",
            message: "Login successful.",
            user: {
                id: existingUser._id,
                fullname: existingUser.fullname,
                email: existingUser.email,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: "Error while verifying password." });
    }
};