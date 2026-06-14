import express from "express";
import {toggleWishlist} from "../controllers/wishlistController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.post("/toggle/:postId",protect,toggleWishlist);
 export default router;