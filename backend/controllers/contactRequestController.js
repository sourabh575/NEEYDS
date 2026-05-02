import ContactRequest from "../models/ContactRequest.js";
import Post from "../models/Post.js";

const userPublicFields = "name email phone";
const postPublicFields = "name type location preferredLocation rentPerPerson budget createdBy";

const stripPhone = (user) => {
  if (!user) return user;
  const plain = user.toObject ? user.toObject() : { ...user };
  delete plain.phone;
  return plain;
};

const serializeRequest = (request) => {
  const plain = request.toObject ? request.toObject() : request;
  if (plain.status !== "accepted") {
    plain.senderId = stripPhone(plain.senderId);
    plain.receiverId = stripPhone(plain.receiverId);
  }
  return plain;
};

const populateRequest = (query) =>
  query
    .populate("senderId", userPublicFields)
    .populate("receiverId", userPublicFields)
    .populate("postId", postPublicFields);

const hasPhone = (user) => Boolean(user?.phone?.trim());

export const sendContactRequest = async (req, res) => {
  try {
    const { receiverId, postId } = req.body;
    const senderId = req.user._id;

    if (!hasPhone(req.user)) {
      return res.status(400).json({ message: "Please add your mobile number before sending a request" });
    }

    if (!receiverId || !postId) {
      return res.status(400).json({ message: "receiverId and postId are required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.createdBy.toString() !== receiverId.toString()) {
      return res.status(400).json({ message: "Receiver must be the post owner" });
    }

    if (post.createdBy.toString() === senderId.toString()) {
      return res.status(400).json({ message: "You cannot request contact details for your own post" });
    }

    const existing = await ContactRequest.findOne({ senderId, postId });
    if (existing) {
      return res.status(409).json({ message: "Contact request already exists" });
    }

    const request = await ContactRequest.create({
      senderId,
      receiverId,
      postId,
      status: "pending",
    });

    const populated = await populateRequest(ContactRequest.findById(request._id));
    return res.status(201).json(serializeRequest(populated));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Contact request already exists" });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await populateRequest(
      ContactRequest.find({ receiverId: req.user._id }).sort({ createdAt: -1 })
    );
    return res.json(requests.map(serializeRequest));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSentRequests = async (req, res) => {
  try {
    const requests = await populateRequest(
      ContactRequest.find({ senderId: req.user._id }).sort({ createdAt: -1 })
    );
    return res.json(requests.map(serializeRequest));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateRequestStatus = async (req, res, status) => {
  try {
    const request = await ContactRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Contact request not found" });

    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the receiver can update this request" });
    }

    if (status === "accepted" && !hasPhone(req.user)) {
      return res.status(400).json({ message: "Please add your mobile number before accepting a request" });
    }

    request.status = status;
    await request.save();

    const populated = await populateRequest(ContactRequest.findById(request._id));
    return res.json(serializeRequest(populated));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const acceptContactRequest = (req, res) =>
  updateRequestStatus(req, res, "accepted");

export const rejectContactRequest = (req, res) =>
  updateRequestStatus(req, res, "rejected");
