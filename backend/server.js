import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

dotenv.config();

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not set in environment variables");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not set in environment variables");
  process.exit(1);
}

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

//Routes
app.use("/api/users",userRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => res.send("API is running..."));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

