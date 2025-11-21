import express from "express";
import { createPost, getPosts, getPostById, updatePost, deletePost } from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
// ✅ Create post (protected)
router.post("/", protect, createPost);

// ✅ Get all posts
router.get("/", getPosts);

// ✅ Get single post by ID
router.get("/:id", getPostById);

// ✅ Update post (protected)
router.put("/:id", protect, updatePost);

//delete post
router.delete("/:id", protect, deletePost);

export default router;
