import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Google token is required",
      });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        message: "Invalid Google token",
      });
    }

    const {
      email,
      name,
      picture,
      email_verified,
      sub: googleId,
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        message: "Google email not verified",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        authProvider: "google",
        isEmailVerified: true, // Google already verifies email
      });
    } else {
      // If user exists but originally registered via email
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        user.isEmailVerified = true;
        await user.save();
      }
    }

    const jwtToken = generateToken(user._id);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: jwtToken,
    });

  } catch (error) {
    console.error("Google Login Error:", error.message);

    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
};
