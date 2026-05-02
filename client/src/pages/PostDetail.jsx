import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import ImageGallery from "../components/ImageGallery";
import { normalizeImageUrl, normalizePhotoList } from "../utils/imageUrls";
import { ensureMobileNumber } from "../utils/phoneRequirement";
import "../styles/PostDetail.css";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactRequest, setContactRequest] = useState(null);
  const [contactMessage, setContactMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const fetchPost = useCallback(async () => {
    try {
      const [postRes, sentRes] = await Promise.all([
        API.get(`/posts/${id}`),
        API.get("/contact-request/sent").catch(() => ({ data: [] })),
      ]);
      const requestForPost = sentRes.data.find(
        (request) => (request.postId?._id || request.postId) === id
      );

      setPost(postRes.data);
      setEditForm(postRes.data);
      setContactRequest(requestForPost || null);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Post not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm(post);
  };

  const updatePost = async () => {
    try {
      const res = await API.put(`/posts/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost(res.data);
      setEditForm(res.data);
      setIsEditing(false);
      alert("Post updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted successfully!");
      navigate("/feed");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const sendContactRequest = async () => {
    if (!post?.createdBy?._id) return;

    try {
      setContactMessage("");
      const hasMobileNumber = await ensureMobileNumber(navigate);
      if (!hasMobileNumber) return;

      const res = await API.post("/contact-request/send", {
        receiverId: post.createdBy._id,
        postId: post._id,
      });
      setContactRequest(res.data);
      setContactMessage("Request sent");
    } catch (error) {
      setContactMessage(error.response?.data?.message || "Could not send request");
    }
  };

  const isOwner = token && user && post?.createdBy?._id === user._id;
  const isAccepted = contactRequest?.status === "accepted";

  if (loading) {
    return (
      <div className="post-detail-root">
        <div className="post-detail-container">
          <p className="post-detail-loading">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-root">
        <div className="post-detail-container">
          <p className="post-detail-error">{error || "Post not found"}</p>
          <button onClick={() => navigate("/feed")}>Back to Feed</button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-root">
      <div className="post-detail-container">
        <button className="post-detail-back" onClick={() => navigate("/feed")}>
          ← Back to Feed
        </button>

        {isEditing ? (
          <div className="post-detail-card editing">
            <h2>Edit Post</h2>
            <div className="post-detail-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={editForm.age || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, age: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editForm.location || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows="4"
                ></textarea>
              </div>

              {post.type === "join-my-flat" && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Rent Per Person (₹)</label>
                      <input
                        type="number"
                        value={editForm.rentPerPerson || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            rentPerPerson: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Sharing Type</label>
                      <select
                        value={editForm.sharingType || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            sharingType: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="triple">Triple</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {post.type === "partner-up" && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Budget (₹)</label>
                      <input
                        type="number"
                        value={editForm.budget || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, budget: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Preferred Location</label>
                      <input
                        type="text"
                        value={editForm.preferredLocation || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            preferredLocation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="post-detail-actions">
                <button className="btn-save" onClick={updatePost}>
                  Save Changes
                </button>
                <button className="btn-cancel" onClick={cancelEditing}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="post-detail-card">
            <div className="post-detail-header">
              <div>
                <h1>{post.name}</h1>
                <span
                  className={`post-badge ${
                    post.type === "join-my-flat"
                      ? "post-badge-join-my-flat"
                      : "post-badge-partner-up"
                  }`}
                >
                  {post.type === "join-my-flat" && "I Have a Room"}
                  {post.type === "partner-up" && "Need a Room"}
                </span>
              </div>
              {isOwner && (
                <div className="post-owner-actions">
                  <button className="btn-edit" onClick={startEditing}>
                    ✏️ Edit
                  </button>
                  <button className="btn-delete" onClick={deletePost}>
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>

            {post.type === "join-my-flat" ? (
              <div className="post-detail-hero">
                <ImageGallery
                  images={normalizePhotoList(post.roomPhotos)}
                  title={post.name || "Listing"}
                  roomType={post.roomType}
                  placeholderText="Room photos not provided yet"
                />
              </div>
            ) : (
              <div className="post-detail-hero post-detail-hero-partner">
                {post.profileImage ? (
                  <img
                    className="post-detail-profilehero-img"
                    src={normalizeImageUrl(post.profileImage)}
                    alt={post.name}
                  />
                ) : (
                  <div className="post-detail-profilehero-placeholder">
                    <div className="placeholder-icon">🔍</div>
                    <div className="placeholder-text">No image provided</div>
                  </div>
                )}
                <div className="post-detail-hero-partner-overlay">
                  Need a Room
                </div>
              </div>
            )}

            <div className="post-detail-meta">
              <div className="meta-item">
                <span className="meta-label">👤 Age & Gender</span>
                <span className="meta-value">{post.age} • {post.gender}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">📍 Location</span>
                <span className="meta-value">{post.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">💼 Occupation</span>
                <span className="meta-value">{post.occupation}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">👥 Gender Preference</span>
                <span className="meta-value">
                  {post.genderPreference?.charAt(0).toUpperCase() +
                    post.genderPreference?.slice(1)}
                </span>
              </div>

              {post.type === "join-my-flat" && post.rentPerPerson && (
                <div className="meta-item">
                  <span className="meta-label">💰 Rent Per Person</span>
                  <span className="meta-value">₹{post.rentPerPerson}/month</span>
                </div>
              )}

              {post.type === "partner-up" && post.budget && (
                <div className="meta-item">
                  <span className="meta-label">💰 Budget</span>
                  <span className="meta-value">₹{post.budget}/month</span>
                </div>
              )}
            </div>

            {post.type === "join-my-flat" && (
              <div className="post-detail-details">
                <h3>Room Details</h3>
                <div className="details-grid">
                  {post.sharingType && (
                    <p>
                      <strong>Sharing Type:</strong> {post.sharingType}
                    </p>
                  )}
                  {post.roomType && (
                    <p>
                      <strong>Room Type:</strong> {post.roomType}
                    </p>
                  )}
                  {post.currentOccupants && (
                    <p>
                      <strong>Current Occupants:</strong> {post.currentOccupants}
                    </p>
                  )}
                  {post.totalCapacity && (
                    <p>
                      <strong>Total Capacity:</strong> {post.totalCapacity}
                    </p>
                  )}
                  {post.amenities?.length > 0 && (
                    <p>
                      <strong>Amenities:</strong> {post.amenities.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {post.type === "partner-up" && (
              <div className="post-detail-details">
                <h3>Looking For</h3>
                <div className="details-grid">
                  {post.preferredLocation && (
                    <p>
                      <strong>Preferred Location:</strong>{" "}
                      {post.preferredLocation}
                    </p>
                  )}
                  {post.movingDateFrom && (
                    <p>
                      <strong>Moving From:</strong>{" "}
                      {new Date(post.movingDateFrom).toLocaleDateString()}
                    </p>
                  )}
                  {post.movingDateTo && (
                    <p>
                      <strong>Moving To:</strong>{" "}
                      {new Date(post.movingDateTo).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="post-detail-description">
              <h3>Description</h3>
              <p>{post.description}</p>
            </div>

            {post.createdBy && (
              <div className="post-detail-author">
                <div className="author-avatar">
                  {post.createdBy.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="author-info">
                  <span className="author-name">{post.createdBy.name}</span>
                  <span className="author-email">{post.createdBy.email}</span>
                </div>
              </div>
            )}

            {isOwner ? (
              <div className="contact-panel">
                <div>
                  <h3>Contact Requests</h3>
                  <p>Review interested users and approve contact sharing.</p>
                </div>
                <button
                  type="button"
                  className="contact-action-button"
                  onClick={() => navigate("/contact-requests")}
                >
                  Manage Requests
                </button>
              </div>
            ) : (
              <div className="contact-panel">
                <div>
                  <h3>Contact Sharing</h3>
                  {isAccepted ? (
                    <div className="contact-info-grid">
                      <div>
                        <span className="contact-info-label">Owner phone</span>
                        <strong>{contactRequest.receiverId?.phone || "Not provided"}</strong>
                      </div>
                      <div>
                        <span className="contact-info-label">Your phone</span>
                        <strong>{contactRequest.senderId?.phone || user?.phone || "Not provided"}</strong>
                      </div>
                    </div>
                  ) : (
                    <p>
                      Request approval from the owner to exchange phone numbers.
                    </p>
                  )}
                  {contactMessage && (
                    <span className="contact-message">{contactMessage}</span>
                  )}
                </div>

                {!contactRequest && (
                  <button
                    type="button"
                    className="contact-action-button"
                    onClick={sendContactRequest}
                  >
                    Interested
                  </button>
                )}

                {contactRequest?.status === "pending" && (
                  <button type="button" className="contact-action-button" disabled>
                    Requested
                  </button>
                )}

                {contactRequest?.status === "rejected" && (
                  <button type="button" className="contact-action-button" disabled>
                    Rejected
                  </button>
                )}

                {isAccepted && (
                  <button type="button" className="contact-action-button" disabled>
                    Contact Shared
                  </button>
                )}
              </div>
            )}

            <div className="post-detail-footer">
              <span className="post-date">
                Posted on{" "}
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;

