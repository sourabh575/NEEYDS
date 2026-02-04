import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/PostDetail.css";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    type: "",
    rent: "",
    location: "",
    genderPref: "",
    desc: "",
  });

  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setPost(res.data);
      setEditForm({
        title: res.data.title,
        type: res.data.type,
        rent: res.data.rent,
        location: res.data.location,
        genderPref: res.data.genderPref,
        desc: res.data.desc,
      });
    } catch (error) {
      console.error("Error fetching post:", error.message);
      alert("Post not found");
      navigate("/feed");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({
      title: post.title,
      type: post.type,
      rent: post.rent,
      location: post.location,
      genderPref: post.genderPref,
      desc: post.desc,
    });
  };

  const updatePost = async () => {
    try {
      const res = await API.put(`/posts/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost(res.data);
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

  const isOwner = token && user && post?.createdBy?._id === user._id;

  if (loading) {
    return (
      <div className="post-detail-root">
        <div className="post-detail-container">
          <p className="post-detail-loading">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-root">
        <div className="post-detail-container">
          <p className="post-detail-error">Post not found</p>
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
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Post Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) =>
                    setEditForm({ ...editForm, type: e.target.value })
                  }
                >
                  <option value="join-flat">I Have a Room</option>
                  <option value="partner-up">Need a Room</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rent (₹)</label>
                  <input
                    type="number"
                    placeholder="Rent"
                    value={editForm.rent}
                    onChange={(e) =>
                      setEditForm({ ...editForm, rent: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Gender</label>
                <select
                  value={editForm.genderPref}
                  onChange={(e) =>
                    setEditForm({ ...editForm, genderPref: e.target.value })
                  }
                >
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Description"
                  value={editForm.desc}
                  onChange={(e) =>
                    setEditForm({ ...editForm, desc: e.target.value })
                  }
                  rows="6"
                ></textarea>
              </div>

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
                <h1>{post.title}</h1>
                <span className={`post-badge post-badge-${post.type}`}>
                  {post.type === "join-flat" && "I Have a Room"}
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

            <div className="post-detail-meta">
              <div className="meta-item">
                <span className="meta-label">📍 Location</span>
                <span className="meta-value">{post.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">💰 Rent</span>
                <span className="meta-value">₹{post.rent}/month</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">👥 Gender Preference</span>
                <span className="meta-value">
                  {post.genderPref.charAt(0).toUpperCase() +
                    post.genderPref.slice(1)}
                </span>
              </div>
            </div>

            <div className="post-detail-description">
              <h3>Description</h3>
              <p>{post.desc}</p>
            </div>

            {post.createdBy && (
              <div className="post-detail-author">
                <div className="author-avatar">
                  {post.createdBy.name.charAt(0).toUpperCase()}
                </div>
                <div className="author-info">
                  <span className="author-name">{post.createdBy.name}</span>
                  <span className="author-email">{post.createdBy.email}</span>
                  {post.createdBy.location && (
                    <span className="author-location">
                      📍 {post.createdBy.location}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="post-detail-footer">
              <span className="post-date">
                Posted on {new Date(post.createdAt).toLocaleDateString("en-US", {
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

