import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

const normalizeImageUrl = (url) => {
  if (url == null || typeof url !== "string") return "";
  let u = url.trim();
  if (!u) return "";

  if (/^data:image\//i.test(u)) return u;

  // People often copy a link with trailing punctuation (e.g. ")" or ",")
  u = u.replace(/^["'(<[]+/, "").replace(/["')>\\\],.]+$/, "");

  if (u.startsWith("//")) u = `https:${u}`;

  // Convert common share links to direct image URLs
  // so <img src="..."> actually renders.
  if (/drive\.google\.com/i.test(u)) {
    // Examples:
    // - https://drive.google.com/file/d/<id>/view?usp=sharing
    // - https://drive.google.com/thumbnail?id=<id>&sz=...
    // - https://drive.google.com/uc?export=view&id=<id>
    const idMatch =
      u.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i) ||
      u.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/i) ||
      u.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
    if (idMatch?.[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }

  if (/dropbox\.com/i.test(u)) {
    if (!/([?&](raw|dl)=)/i.test(u)) {
      const sep = u.includes("?") ? "&" : "?";
      u = `${u}${sep}raw=1`;
    }
  }

  if (!/^https?:\/\//i.test(u)) {
    u = u.replace(/^\/+/, "");
    u = `https://${u}`;
  }
  return u;
};

const normalizePhotoList = (raw) => {
  if (raw == null) return [];
  const list = Array.isArray(raw)
    ? raw
    : typeof raw === "string"
      ? raw
          .split(/[\n,]/)
          .map((x) => x.trim())
          .filter(Boolean)
      : [];
  const out = [];
  const seen = new Set();
  for (const item of list) {
    const n = normalizeImageUrl(typeof item === "string" ? item : String(item ?? ""));
    if (n && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
};

const COMMON_REQUIRED = [
  "type",
  "profileImage",
  "name",
  "age",
  "gender",
  "occupation",
  "location",
  "genderPreference",
  "description",
];

// Helper: validate presence of required fields
const ensureFields = (obj, fields) => {
  const missing = fields.filter((f) => {
    const v = obj[f];
    return v === undefined || v === null || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0);
  });
  return missing;
};

export const createPost = async (req, res) => {
  try {
    const data = req.body || {};
    const roomImageFiles = req.files?.images ?? [];
    const profileImageFile = req.files?.profileImage?.[0];

    // Common required
    const commonRequired =
      data.type === "partner-up"
        ? COMMON_REQUIRED.filter((field) => field !== "profileImage")
        : COMMON_REQUIRED;
    const missingCommon = ensureFields(data, commonRequired);
    if (missingCommon.length) {
      return res.status(400).json({ message: `Missing fields: ${missingCommon.join(", ")}` });
    }

    // Type-specific validations
    if (data.type === "join-my-flat") {
      const missing = ensureFields(data, ["sharingType", "roomType", "rentPerPerson"]);
      if (missing.length) {
        return res.status(400).json({ message: `Missing join-my-flat fields: ${missing.join(", ")}` });
      }

      if (!roomImageFiles.length) {
        return res.status(400).json({ message: "Upload at least one room image." });
      }
    } 

    if (data.type === "partner-up") {
      const missing = ensureFields(data, ["preferredLocation", "movingDateFrom", "budget"]);
      if (missing.length) {
        return res.status(400).json({ message: `Missing partner-up fields: ${missing.join(", ")}` });
      }

      if (!profileImageFile) {
        return res.status(400).json({ message: "Upload a profile image." });
      }
    }

    const profileImage =
      data.type === "partner-up"
        ? {
            public_id: profileImageFile.filename,
            url: profileImageFile.path,
          }
        : normalizeImageUrl(data.profileImage);
    const roomPhotos =
      data.type === "join-my-flat" ? normalizePhotoList(data.roomPhotos) : [];

    const images =
      data.type === "join-my-flat"
        ? roomImageFiles.map((file) => ({
            public_id: file.filename,
            url: file.path,
          }))
        : undefined;

    const {
      roomPhotos: _dropRoom,
      images: _dropImages,
      profileImage: _dropProfile,
      ...rest
    } = data;

    const post = await Post.create({
      ...rest,
      profileImage,
      ...(data.type === "join-my-flat" ? { roomPhotos, images } : {}),
      createdBy: req.user._id,
    });

    const populated = await post.populate("createdBy", "name email");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { type, genderPreference, budget, location } = req.query;

    const query = {};

    if (type) query.type = type;
    if (genderPreference) query.genderPreference = genderPreference;
    if (location) query.location = { $regex: location, $options: "i" };

    if (budget) {
      const num = Number(budget);
      if (!Number.isNaN(num)) {
        if (type === "join-my-flat") {
          query.rentPerPerson = { $lte: num };
        } else if (type === "partner-up") {
          query.budget = { $lte: num };
        } else {
          query.$or = [{ rentPerPerson: { $lte: num } }, { budget: { $lte: num } }];
        }
      }
    }

    const posts = await Post.find(query).populate("createdBy", "name email").sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("createdBy", "name email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const newImageFiles = req.files?.images ?? [];
    const newProfileImageFile = req.files?.profileImage?.[0];
    let oldImagePublicIds = [];
    let oldProfileImagePublicId;

    if (newImageFiles.length && (req.body.type ?? post.type) !== "join-my-flat") {
      return res.status(400).json({
        message: "Room images can only be uploaded for Join My Flat posts.",
      });
    }

    if (newProfileImageFile && (req.body.type ?? post.type) !== "partner-up") {
      return res.status(400).json({
        message: "Profile images can only be uploaded for Partner Up posts.",
      });
    }

    // fields allowed to update
    const allowed = [
      "type",
      "profileImage",
      "name",
      "age",
      "gender",
      "occupation",
      "location",
      "genderPreference",
      "occupationPreference",
      "description",
      // join-my-flat
      "roomPhotos",
      "sharingType",
      "roomType",
      "currentOccupants",
      "totalCapacity",
      "independentType",
      "rentPerPerson",
      "amenities",
      "restrictions",
      // partner-up
      "preferredLocation",
      "movingDateFrom",
      "movingDateTo",
      "budget",
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowed.includes(key)) {
        if (
          key === "profileImage" &&
          (req.body.type ?? post.type) === "partner-up"
        ) {
          return;
        }
        post[key] = req.body[key];
      }
    });

    if (
      req.body.profileImage !== undefined &&
      (req.body.type ?? post.type) !== "partner-up"
    ) {
      post.profileImage = normalizeImageUrl(req.body.profileImage);
    }
    if (req.body.roomPhotos !== undefined) {
      post.roomPhotos = normalizePhotoList(req.body.roomPhotos);
    }

    if (newImageFiles.length) {
      oldImagePublicIds = (post.images ?? [])
        .map((image) => image.public_id)
        .filter(Boolean);

      post.images = newImageFiles.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    if (newProfileImageFile) {
      oldProfileImagePublicId = post.profileImage?.public_id;
      post.profileImage = {
        public_id: newProfileImageFile.filename,
        url: newProfileImageFile.path,
      };
    }

    // Additional safety: if type is changed, ensure required fields for that type exist
    if (post.type === "join-my-flat") {
      const missing = ensureFields(post, ["sharingType", "roomType", "rentPerPerson"]);
      if (!post.images?.length && !post.roomPhotos?.length) {
        missing.push("images");
      }
      if (missing.length) return res.status(400).json({ message: `Missing join-my-flat fields: ${missing.join(", ")}` });
    }
    if (post.type === "partner-up") {
      const missing = ensureFields(post, ["preferredLocation", "movingDateFrom", "budget"]);
      if (missing.length) return res.status(400).json({ message: `Missing partner-up fields: ${missing.join(", ")}` });
    }

    if (oldImagePublicIds.length) {
      await Promise.all(
        oldImagePublicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
      );
    }

    if (oldProfileImagePublicId) {
      await cloudinary.uploader.destroy(oldProfileImagePublicId);
    }

    const updated = await post.save();
    await updated.populate("createdBy", "name email");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const publicIds = new Set();

    if (post.type === "join-my-flat") {
      (post.images ?? []).forEach((image) => {
        if (image.public_id) publicIds.add(image.public_id);
      });

      if (post.profileImage?.public_id) {
        publicIds.add(post.profileImage.public_id);
      }
    }

    if (post.type === "partner-up" && post.profileImage?.public_id) {
      publicIds.add(post.profileImage.public_id);
    }

    if (publicIds.size) {
      await Promise.all(
        [...publicIds].map((publicId) => cloudinary.uploader.destroy(publicId))
      );
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




