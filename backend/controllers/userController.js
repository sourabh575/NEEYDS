import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, phone } = req.body;

    console.log("Registration attempt:", {
      name,
      email,
      gender: gender ? "provided" : "missing",
    });

    if (!name || !email || !password || !phone?.trim()) {
      const missing = [];
      if (!name) missing.push("name");
      if (!email) missing.push("email");
      if (!password) missing.push("password");
      if (!phone?.trim()) missing.push("phone");

      return res.status(400).json({
        message: `Please provide all required fields: ${missing.join(", ")}`,
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      gender,
      phone,
      isEmailVerified: true,
    });

    console.log("User created successfully:", user._id);

    return res.status(201).json({
      message: "Registration successful!",
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === "email") {
        return res.status(400).json({
          message:
            "Email already exists. Please use a different email or try logging in.",
        });
      }
      return res.status(400).json({ message: `${field} already exists` });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    return res.status(500).json({
      message: error.message || "Server error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    console.log("Incoming Login Request:", { email });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -emailVerifyToken -emailVerifyExpires"
    );
    return res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const isOwnProfile = req.params.id === req.user._id.toString();
    const user = await User.findById(req.params.id).select(
      `-password -emailVerifyToken -emailVerifyExpires${isOwnProfile ? "" : " -phone"}`
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, gender, phone } = req.body;

    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = name;
    if (gender !== undefined) user.gender = gender;
    if (phone !== undefined && !phone.trim()) {
      return res.status(400).json({ message: "Mobile number is required" });
    }
    if (phone !== undefined) user.phone = phone;

    await user.save();

    const userResponse = await User.findById(user._id).select(
      "-password -emailVerifyToken"
    );

    return res.json({
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
