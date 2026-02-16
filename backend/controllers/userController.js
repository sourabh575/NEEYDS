import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/emailService.js";

// ✅ Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    console.log("📝 Registration attempt:", { name, email, gender: gender ? "provided" : "missing" });

    // Validate required fields
    if (!name || !email || !password || !gender) {
      const missing = [];
      if (!name) missing.push("name");
      if (!email) missing.push("email");
      if (!password) missing.push("password");
      if (!gender) missing.push("gender");
      return res.status(400).json({ 
        message: `Please provide all required fields: ${missing.join(", ")}` 
      });
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

    // Generate secure verification token
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    const emailVerifyExpires = new Date();
    emailVerifyExpires.setHours(emailVerifyExpires.getHours() + 24); // 24 hours from now

    // Create new user with isEmailVerified = false
    const user = await User.create({
      name,
      email,
      password,
      gender,
      isEmailVerified: false,
      emailVerifyToken,
      emailVerifyExpires,
    });

    console.log("✅ User created successfully:", user._id);

    // Send verification email
    const emailResult = await sendVerificationEmail(email, emailVerifyToken, name);
    
    if (!emailResult.success) {
      console.error("❌ Failed to send verification email:", emailResult.error);
      // Still return success, but log the error
      // User can request resend later if needed
    } else {
      console.log("✅ Verification email sent successfully");
    }

    // Don't return token - user needs to verify email first
    return res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error("❌ Register Error:", error);
    
    // Handle duplicate email error (MongoDB unique constraint)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === "email") {
        return res.status(400).json({ message: "Email already exists. Please use a different email or try logging in." });
      }
      return res.status(400).json({ message: `${field} already exists` });
    }
    
    // Handle validation errors from Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    
    // Handle other errors
    return res.status(500).json({ 
      message: error.message || "Server error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: "Please verify your email first.",
        requiresVerification: true 
      });
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
    // Return user without sensitive fields
    const user = await User.findById(req.user._id).select("-password -emailVerifyToken -emailVerifyExpires");
    return res.json(user); 
  } catch (error) {
    console.error("❌ Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -emailVerifyToken -emailVerifyExpires");

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
    const { name, gender } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Only update provided fields
    if (name !== undefined) user.name = name;
    if (gender !== undefined) user.gender = gender;

    await user.save();

    // Return user without sensitive data
    const userResponse = await User.findById(user._id).select("-password -emailVerifyToken");

    return res.json({
      message: "Profile updated successfully",
      user: userResponse,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    // Find user with matching token and check expiration
    const user = await User.findOne({
      emailVerifyToken: token,
      emailVerifyExpires: { $gt: new Date() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired verification token. Please request a new verification email." 
      });
    }

    // Mark email as verified and remove token fields
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    return res.json({
      message: "Email verified successfully! You can now log in.",
      verified: true,
    });

  } catch (error) {
    console.error("❌ Email Verification Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



  