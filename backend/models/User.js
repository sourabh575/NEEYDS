import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
      type: String 
      // Not required because Google users won't have password
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false, // Google users may not provide this
    },

    // 🔹 Google OAuth fields
    googleId: {
      type: String,
    },

    avatar: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // 🔹 Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifyToken: String,
    emailVerifyExpires: Date,
  },
  { timestamps: true }
);



// 🔒 Encrypt password before saving (ONLY for local users)
userSchema.pre("save", async function (next) {
  if (!this.password) return next(); // skip for Google users
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// 🧠 Compare passwords (login)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google users don't have password
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;


