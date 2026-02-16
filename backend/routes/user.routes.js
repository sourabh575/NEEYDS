import express from "express";
import {
  getUserById,
  updateUser,
  getUserProfile,
  registerUser,
  loginUser,
  verifyEmail,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { googleLogin } from "../controllers/googleLogin.js";

const router = express.Router();

// Public routes
router.get("/verify-email", verifyEmail);
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.post("/google-login", googleLogin);

export default router;
