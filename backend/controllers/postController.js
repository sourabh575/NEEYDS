import Post from "../models/Post.js";

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

    // Common required
    const missingCommon = ensureFields(data, COMMON_REQUIRED);
    if (missingCommon.length) {
      return res.status(400).json({ message: `Missing fields: ${missingCommon.join(", ")}` });
    }

    // Type-specific validations
    if (data.type === "join-my-flat") {
      const missing = ensureFields(data, ["roomPhotos", "sharingType", "roomType", "rentPerPerson"]);
      if (missing.length) {
        return res.status(400).json({ message: `Missing join-my-flat fields: ${missing.join(", ")}` });
      }
    } 

    if (data.type === "partner-up") {
      const missing = ensureFields(data, ["preferredLocation", "movingDateFrom", "budget"]);
      if (missing.length) {
        return res.status(400).json({ message: `Missing partner-up fields: ${missing.join(", ")}` });
      }
    }

    const profileImage = normalizeImageUrl(data.profileImage);
    const roomPhotos =
      data.type === "join-my-flat" ? normalizePhotoList(data.roomPhotos) : [];

    if (data.type === "join-my-flat" && roomPhotos.length === 0) {
      return res.status(400).json({ message: "Add at least one valid room photo URL" });
    }

    const { roomPhotos: _dropRoom, profileImage: _dropProfile, ...rest } = data;

    const post = await Post.create({
      ...rest,
      profileImage,
      ...(data.type === "join-my-flat" ? { roomPhotos } : {}),
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
        post[key] = req.body[key];
      }
    });

    if (req.body.profileImage !== undefined) {
      post.profileImage = normalizeImageUrl(req.body.profileImage);
    }
    if (req.body.roomPhotos !== undefined) {
      post.roomPhotos = normalizePhotoList(req.body.roomPhotos);
    }

    // Additional safety: if type is changed, ensure required fields for that type exist
    if (post.type === "join-my-flat") {
      const missing = ensureFields(post, ["roomPhotos", "sharingType", "roomType", "rentPerPerson"]);
      if (missing.length) return res.status(400).json({ message: `Missing join-my-flat fields: ${missing.join(", ")}` });
    }
    if (post.type === "partner-up") {
      const missing = ensureFields(post, ["preferredLocation", "movingDateFrom", "budget"]);
      if (missing.length) return res.status(400).json({ message: `Missing partner-up fields: ${missing.join(", ")}` });
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
    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




