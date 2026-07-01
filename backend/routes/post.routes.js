import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";
import upload, { uploadErrorHandler } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "profileImage", maxCount: 1 },
  ]),
  createPost,
  uploadErrorHandler
);
router.get("/", getPosts);
router.get("/:id", getPostById); 
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "profileImage", maxCount: 1 },
  ]),
  updatePost,
  uploadErrorHandler
);
router.delete("/:id", protect, deletePost);

export default router;
