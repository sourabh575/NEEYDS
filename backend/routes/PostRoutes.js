import express from "express";
import { createPost, getPosts, getPostById, deletePost } from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
// ✅ Create post (protected)
router.post("/", protect, createPost);

// ✅ Get all posts
router.get("/", getPosts);

// ✅ Get single post by ID
router.get("/:id", getPostById);

//delte post
router.delete("/:id", protect, deletePost);

export default router;
