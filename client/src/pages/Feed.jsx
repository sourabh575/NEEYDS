import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // logged-in user data

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted post from UI instantly
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="feed-root">
        <div className="feed-inner">
          <p className="feed-loading">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-root">
      <div className="feed-inner">
        <header className="feed-header">
          <div>
            <h2>Roommate & Room Listings</h2>
            <p>Browse fresh posts from people looking to share or find a room.</p>
          </div>
          {user && (
            <div className="feed-user-pill">
              <div className="feed-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="feed-user-meta">
                <span className="feed-user-name">{user.name}</span>
                <span className="feed-user-sub">Logged in</span>
              </div>
            </div>
          )}
        </header>

        {posts.length === 0 && (
          <div className="feed-empty">
            <h4>No posts yet</h4>
            <p>Be the first to add a post and help someone find their next home.</p>
          </div>
        )}

        <div className="feed-grid">
          {posts.map((post) => (
            <article key={post._id} className="feed-card">
              <div className="feed-card-header">
                <h3>{post.title}</h3>
                <span className={`feed-badge feed-badge-${post.type}`}>
                  {post.type === "join-flat" && "I Have a Room"}
                  {post.type === "partner-up" && "Need a Room"}
                </span>
              </div>

              <dl className="feed-meta">
                <div>
                  <dt>Location</dt>
                  <dd>{post.location || "Not specified"}</dd>
                </div>
                <div>
                  <dt>Rent</dt>
                  <dd>{post.rent ? `₹${post.rent}` : "Not specified"}</dd>
                </div>
                <div>
                  <dt>Preferred Gender</dt>
                  <dd>{post.genderPref || "Any"}</dd>
                </div>
              </dl>

              {post.desc && <p className="feed-desc">{post.desc}</p>}

              <footer className="feed-footer">
                {post.createdBy && (
                  <span className="feed-author">
                    Posted by <strong>{post.createdBy.name}</strong>
                  </span>
                )}

                {token &&
                  user &&
                  post.createdBy &&
                  post.createdBy._id === user._id && (
                    <button
                      className="feed-delete"
                      onClick={() => deletePost(post._id)}
                    >
                      Delete
                    </button>
                  )}
              </footer>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
