import Post from "../models/Post.js";

// ✅ Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, type, rent, location, genderPref, desc } = req.body;

    // Validation
    if (!title || !type || !rent || !location || !desc) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Create new post
    const post = new Post({
      title,
      type,
      rent,
      location,
      genderPref,
      desc,
      createdBy: req.user._id, // from JWT
    });

    const savedPost = await post.save();

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "name email location")
      .sort({ createdAt: -1 }); // latest first

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("createdBy", "name email location");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



