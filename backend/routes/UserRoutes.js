import express from "express";
import {
  getUserById,
  updateUser,
  getUserProfile,
  registerUser,
  loginUser
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// CURRENT USER
router.get("/profile", protect, getUserProfile);

// ✅ GET user by ID
router.get("/:id", protect, getUserById);

// ✅ UPDATE user by ID
router.put("/:id", protect, updateUser);
router.post("/register",registerUser);
router.post("/login",loginUser);

export default router;




