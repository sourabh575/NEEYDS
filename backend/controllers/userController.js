import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, budget, location, preferences } = req.body;

    // Validate required fields
    if (!name || !email || !password || !gender) {
      return res.status(400).json({ message: "Please provide name, email, password, and gender" });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      gender,
      budget,
      location,
      preferences,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });

  } catch (error) {
    console.error("❌ Register Error:", error);
    
    // Handle validation errors from Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    console.log("Incoming Login Request:", { email });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ GET USER PROFILE (PROTECTED)
export const getUserProfile = async (req, res) => {
  try {
    return res.json(req.user); 
  } catch (error) {
    console.error("❌ Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { name, gender, budget, location,email, preferences } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name ?? user.name;
    user.gender = gender ?? user.gender;
    user.budget = budget ?? user.budget;
    user.location = location ?? user.location;
    user.preferences = preferences ?? user.preferences;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



  