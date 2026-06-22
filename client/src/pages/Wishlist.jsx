import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import "../styles/Feed.css";

function Wishlist() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/wishlist");
      setPosts(res.data?.wishlist || res.data?.posts || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const openPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const removeFromWishlist = async (postId) => {
    const previousPosts = posts;
    setPosts((current) => current.filter((post) => post._id !== postId));

    try {
      const res = await API.post(`/wishlist/toggle/${postId}`);
      if (res.data.saved) {
        setPosts(previousPosts);
      }
    } catch (error) {
      setPosts(previousPosts);
      alert(error.response?.data?.message || "Could not remove from wishlist");
    }
  };

  if (loading) {
    return (
      <div className="feed-root">
        <div className="feed-inner">
          <div className="feed-loading-container">
            <div className="loading-spinner"></div>
            <p className="feed-loading">Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-root">
      <div className="feed-inner">
        <header className="feed-header wishlist-header">
          <div className="feed-title-group">
            <h1 className="feed-title">My Wishlist</h1>
            <p className="feed-subtitle">Saved rooms and roommate listings</p>
          </div>
        </header>

        {posts.length === 0 ? (
          <div className="feed-empty-state wishlist-empty-state">
            <h3>No Saved Posts Yet</h3>
            <p>
              Save rooms and roommate listings from the feed and they will appear here.
            </p>
          </div>
        ) : (
          <div className="feed-grid">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                isSaved
                onOpen={openPost}
                onWishlistToggle={removeFromWishlist}
                contactAction={{
                  label: "View Listing",
                  disabled: false,
                  onClick: (event) => {
                    event.stopPropagation();
                    openPost(post._id);
                  },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
