import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import { ensureMobileNumber } from "../utils/phoneRequirement";
import "../styles/Feed.css";

function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [requestMap, setRequestMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    genderPreference: "",
    budget: "",
    location: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const wishlistSet = useMemo(() => new Set(wishlist), [wishlist]);

  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.genderPreference) {
        params.append("genderPreference", filters.genderPreference);
      }
      if (filters.budget) params.append("budget", filters.budget);
      if (filters.location) params.append("location", filters.location);

      const [postsRes, sentRes] = await Promise.all([
        API.get(`/posts?${params.toString()}`),
        API.get("/contact-request/sent").catch(() => ({ data: [] })),
      ]);

      const requestsByPost = {};
      sentRes.data.forEach((request) => {
        const postId = request.postId?._id || request.postId;
        if (postId) requestsByPost[postId] = request;
      });

      setPosts(postsRes.data);
      setRequestMap(requestsByPost);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await API.get("/wishlist");
      const savedPosts = res.data?.wishlist || res.data?.posts || [];
      setWishlist(savedPosts.map((post) => post._id || post));
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchWishlist();
  }, [fetchPosts, fetchWishlist]);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      genderPreference: "",
      budget: "",
      location: "",
    });
  };

  const hasActiveFilters = () =>
    filters.type || filters.genderPreference || filters.budget || filters.location;

  const openPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleInterest = async (event, post) => {
    event.stopPropagation();

    try {
      const hasMobileNumber = await ensureMobileNumber(navigate);
      if (!hasMobileNumber) return;

      const res = await API.post("/contact-request/send", {
        receiverId: post.createdBy?._id || post.createdBy,
        postId: post._id,
      });

      setRequestMap((current) => ({
        ...current,
        [post._id]: res.data,
      }));
      alert("Request sent");
    } catch (error) {
      alert(error.response?.data?.message || "Could not send request");
    }
  };

  const getContactAction = (post) => {
    const isOwner = user?._id && (post.createdBy?._id || post.createdBy) === user._id;
    if (isOwner) {
      return {
        label: "Manage Post",
        disabled: false,
        onClick: (event) => {
          event.stopPropagation();
          openPost(post._id);
        },
      };
    }

    const request = requestMap[post._id];
    if (!request) {
      return {
        label: "Interested",
        disabled: false,
        onClick: (event) => handleInterest(event, post),
      };
    }

    if (request.status === "accepted") {
      return {
        label: "View Contact",
        disabled: false,
        onClick: (event) => {
          event.stopPropagation();
          openPost(post._id);
        },
      };
    }

    return {
      label: request.status === "rejected" ? "Rejected" : "Requested",
      disabled: true,
      onClick: (event) => event.stopPropagation(),
    };
  };

  const handleWishlist = async (postId) => {
    const wasSaved = wishlist.includes(postId);

    setWishlist((current) =>
      wasSaved ? current.filter((id) => id !== postId) : [...current, postId]
    );

    try {
      const res = await API.post(`/wishlist/toggle/${postId}`);
      setWishlist((current) => {
        const withoutPost = current.filter((id) => id !== postId);
        return res.data.saved ? [...withoutPost, postId] : withoutPost;
      });
    } catch (error) {
      setWishlist((current) =>
        wasSaved
          ? [...current.filter((id) => id !== postId), postId]
          : current.filter((id) => id !== postId)
      );
      alert(error.response?.data?.message || "Could not update wishlist");
    }
  };

  if (loading) {
    return (
      <div className="feed-root">
        <div className="feed-inner">
          <div className="feed-loading-container">
            <div className="loading-spinner"></div>
            <p className="feed-loading">Loading listings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-root">
      <div className="feed-inner">
        <header className="feed-header">
          <div className="feed-header-content">
            <div className="feed-title-group">
              <h1 className="feed-title">Find Your Perfect Space</h1>
              <p className="feed-subtitle">
                Browse verified listings from people in your city
              </p>
            </div>
            {user && (
              <div className="feed-user-badge">
                <div className="badge-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span className="avatar-initials">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="badge-info">
                  <span className="badge-greeting">Welcome back</span>
                  <span className="badge-name">{user.name}</span>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="feed-filter-section">
          <div className="filter-header">
            <button
              className={`filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="filter-icon">Filter</span>
              <span>Filters</span>
              {hasActiveFilters() && (
                <span className="filter-count">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
              <span className="filter-arrow">▼</span>
            </button>
            {hasActiveFilters() && (
              <button className="filter-clear-btn" onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="filter-panel">
              <div className="filter-grid">
                <div className="filter-group">
                  <label htmlFor="type-filter">Post Type</label>
                  <select
                    id="type-filter"
                    value={filters.type}
                    onChange={(event) => handleFilterChange("type", event.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="join-my-flat">I Have a Room</option>
                    <option value="partner-up">Need a Room</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="gender-filter">Gender Preference</label>
                  <select
                    id="gender-filter"
                    value={filters.genderPreference}
                    onChange={(event) =>
                      handleFilterChange("genderPreference", event.target.value)
                    }
                  >
                    <option value="">Any Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="any">Any</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="budget-filter">Max Budget (₹)</label>
                  <input
                    id="budget-filter"
                    type="number"
                    placeholder="e.g., 10000"
                    value={filters.budget}
                    onChange={(event) => handleFilterChange("budget", event.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="location-filter">Location</label>
                  <input
                    id="location-filter"
                    type="text"
                    placeholder="e.g., Bangalore, Mumbai"
                    value={filters.location}
                    onChange={(event) => handleFilterChange("location", event.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="feed-results-info">
          <span className="results-count">
            {posts.length} {posts.length === 1 ? "listing" : "listings"} found
            {hasActiveFilters() && " with active filters"}
          </span>
        </div>

        {posts.length === 0 && (
          <div className="feed-empty-state">
            <h3>No listings found</h3>
            <p>
              {hasActiveFilters()
                ? "Try adjusting your filters to see more results."
                : "Be the first to create a listing and help someone find their perfect roommate."}
            </p>
            {token && (
              <button
                className="empty-action-btn"
                onClick={() => navigate("/create-post")}
              >
                Create new listing
              </button>
            )}
          </div>
        )}

        <div className="feed-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              isSaved={wishlistSet.has(post._id)}
              onOpen={openPost}
              onWishlistToggle={handleWishlist}
              contactAction={getContactAction(post)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
