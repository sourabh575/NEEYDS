import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing");
  process.exit(1);
}

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://neeyds.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl requests or mobile apps)
      if (!origin) return callback(null, true);
      
      // Allow localhost in development
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }
      
      // Check against whitelist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      console.error(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
