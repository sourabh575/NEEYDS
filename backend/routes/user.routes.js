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

router.get("/profile", protect, getUserProfile);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
