import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    /* ===========================
       LISTING TYPE
    ============================ */
    type: {
      type: String,
      enum: ["join-my-flat", "partner-up"],
      required: true,
    },

    /* ===========================
       COMMON (BOTH TYPES)
    ============================ */

    profileImage: {
      type: String, // Cloudinary URL
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    occupation: {
      type: String,
      enum: ["student", "working", "other"],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    genderPreference: {
      type: String,
      enum: ["male", "female", "any"],
      required: true,
    },

    occupationPreference: {
      type: String,
      enum: ["student", "working", "any"],
      default: "any",
    },

    description: {
      type: String,
      required: true,
    }, 

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ===========================
       JOIN MY FLAT (Have Room)
    ============================ */

    roomPhotos: [
      {
        type: String, // multiple image URLs
      },
    ],

    sharingType: {
      type: String,
      enum: ["single", "double", "triple"],
    },

    roomType: {
      type: String,
      enum: ["1BHK", "2BHK", "3BHK", "PG", "Shared Room"],
    },

    currentOccupants: Number,

    totalCapacity: Number,

    independentType: {
      type: String,
      enum: ["independent", "dependent"],
    },

    rentPerPerson: Number,

    amenities: [
      {
        type: String,
        enum: [
          "wifi",
          "ac",
          "kitchen",
          "geyser",
          "washing-machine",
          "power-backup",
          "parking",
          "security",
          "lift",
          "balcony",
          "fridge",
        ],
      },
    ],

    restrictions: String,

    /* ===========================
       PARTNER UP (Looking for Room)
    ============================ */

    preferredLocation: String,

    movingDateFrom: Date,

    movingDateTo: Date,

    budget: Number,
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;




