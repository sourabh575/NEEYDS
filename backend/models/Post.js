import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // Post Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Type of post: has room or needs room
    type: {
      type: String,
      enum: ["join-flat", "partner-up", "pg-owner"], // future use: pg-owner
      required: true,
    },

    // Monthly rent or cost
    rent: {
      type: Number,
      required: true,
    },

    // City or location
    location: {
      type: String,
      required: true,
    },

    // Preferred roommate gender
    genderPref: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },

    // Description about the room/post
    desc: {
      type: String,
      required: true,
    },

    // Relation → Which user created this post
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // stores the user's MongoDB _id
      ref: "User", // connects to the User model
      required: true,
    },
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

const Post = mongoose.model("Post", postSchema);

export default Post;
// {
//   "_id": "post123",
//   "title": "Looking for a roommate near Koramangala",
//   "type": "join-flat",
//   "rent": 8000,
//   "location": "Bangalore",
//   "genderPref": "male",
//   "desc": "2BHK apartment, neat & calm environment.",
//   "createdBy": "user456"
// }



