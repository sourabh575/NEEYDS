import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Feed.css";

function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    genderPref: "",
    budget: "",
    location: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // logged-in user data

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.genderPref) params.append("genderPref", filters.genderPref);
      if (filters.budget) params.append("budget", filters.budget);
      if (filters.location) params.append("location", filters.location);

      const res = await API.get(`/posts?${params.toString()}`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      genderPref: "",
      budget: "",
      location: "",
    });
  };

  const hasActiveFilters = () => {
    return filters.type || filters.genderPref || filters.budget || filters.location;
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

        {/* Filter Section */}
        <div className="feed-filter-container">
          <div className="feed-filter-header">
            <button
              className="feed-filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="filter-icon">🔍</span>
              <span>Filters</span>
              {hasActiveFilters() && (
                <span className="filter-badge">{Object.values(filters).filter(Boolean).length}</span>
              )}
              <span className={`filter-arrow ${showFilters ? "open" : ""}`}>▼</span>
            </button>
            {hasActiveFilters() && (
              <button className="feed-filter-clear" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>

          {showFilters && (
            <div className="feed-filter-panel">
              <div className="filter-group">
                <label>Post Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="join-flat">I Have a Room</option>
                  <option value="partner-up">Need a Room</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Gender Preference</label>
                <select
                  value={filters.genderPref}
                  onChange={(e) => handleFilterChange("genderPref", e.target.value)}
                >
                  <option value="">Any Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="any">Any</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Max Budget (₹)</label>
                <input
                  type="number"
                  placeholder="e.g., 10000"
                  value={filters.budget}
                  onChange={(e) => handleFilterChange("budget", e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g., Bangalore"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="feed-results-info">
            <span>
              {posts.length} {posts.length === 1 ? "post" : "posts"} found
              {hasActiveFilters() && " with filters"}
            </span>
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="feed-empty">
            <h4>No posts found</h4>
            <p>
              {hasActiveFilters()
                ? "Try adjusting your filters to see more results."
                : "Be the first to add a post and help someone find their next home."}
            </p>
          </div>
        )}

        <div className="feed-grid">
          {posts.map((post) => (
            <article
              key={post._id}
              className="feed-card"
              onClick={() => navigate(`/post/${post._id}`)}
            >
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

              {post.desc && (
                <p className="feed-desc">
                  {post.desc.length > 100
                    ? `${post.desc.substring(0, 100)}...`
                    : post.desc}
                </p>
              )}

              {post.createdBy && (
                <div className="feed-author-info">
                  <span className="feed-author">
                    Posted by <strong>{post.createdBy.name}</strong>
                  </span>
                  <span className="feed-view-more">View Details →</span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
