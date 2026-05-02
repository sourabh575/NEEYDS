import express from "express";
import {
  acceptContactRequest,
  getReceivedRequests,
  getSentRequests,
  rejectContactRequest,
  sendContactRequest,
} from "../controllers/contactRequestController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendContactRequest);
router.get("/received", protect, getReceivedRequests);
router.get("/sent", protect, getSentRequests);
router.put("/accept/:id", protect, acceptContactRequest);
router.put("/reject/:id", protect, rejectContactRequest);

export default router;
