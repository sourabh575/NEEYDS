import { useEffect, useState } from "react";
import API from "../api/axios";

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

  if (loading) return <h3 className="text-center mt-5">Loading posts...</h3>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Roommate & Room Listings</h2>

      {posts.length === 0 && (
        <p className="text-center text-muted">No posts available</p>
      )}

      <div className="row">
        {posts.map((post) => (
          <div key={post._id} className="col-md-4 mb-4">
            <div className="card shadow-sm">

              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>

                <span className="badge bg-primary mb-2">
                  {post.type === "join-flat" && "I Have a Room"}
                  {post.type === "partner-up" && "Need a Room"}
                </span>

                <p className="card-text">
                  <strong>Location:</strong> {post.location} <br />
                  <strong>Rent:</strong> ₹{post.rent} <br />
                  <strong>Preferred Gender:</strong> {post.genderPref} <br />
                </p>

                <p className="card-text text-muted" style={{ fontSize: "14px" }}>
                  {post.desc}
                </p>

                {post.createdBy && (
                  <p className="text-secondary" style={{ fontSize: "13px" }}>
                    <strong>Posted by:</strong> {post.createdBy.name}
                  </p>
                )}

                {/* DELETE BUTTON — only if current user owns the post */}
                {token &&
                  user &&
                  post.createdBy &&
                  post.createdBy._id === user._id && (
                    <button
                      className="btn btn-danger w-100 mt-2"
                      onClick={() => deletePost(post._id)}
                    >
                      Delete Post
                    </button>
                  )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Feed;
