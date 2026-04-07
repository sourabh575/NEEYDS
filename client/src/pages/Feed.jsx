import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import ImageGallery from "../components/ImageGallery";
import { normalizePhotoList, normalizeImageUrl } from "../utils/imageUrls";
import "../styles/Feed.css";

function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    genderPreference: "",
    budget: "",
    location: "",
  });
  const [showFilters, setShowFilters] = useState(false);

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
      if (filters.genderPreference) params.append("genderPreference", filters.genderPreference);
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
      genderPreference: "",
      budget: "",
      location: "",
    });
  };

  const hasActiveFilters = () =>
    filters.type || filters.genderPreference || filters.budget || filters.location;

  const getPostImages = (post) =>
    post?.type === "join-my-flat" ? normalizePhotoList(post.roomPhotos) : [];

  const openPost = (postId) => {
    navigate(`/post/${postId}`);
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
                    onChange={(event) => handleFilterChange("genderPreference", event.target.value)}
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

        {!loading && (
          <div className="feed-results-info">
            <span className="results-count">
              {posts.length} {posts.length === 1 ? "listing" : "listings"} found
              {hasActiveFilters() && " with active filters"}
            </span>
          </div>
        )}

        {posts.length === 0 && !loading && (
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
            <article
              key={post._id}
              className={`feed-card feed-card-${post.type}`}
              onClick={() => openPost(post._id)}
            >
              {post.type === "join-my-flat" && (
                <>
                  <div className="card-image card-image-join">
                    <ImageGallery
                      images={getPostImages(post)}
                      title={post.name || "Listing"}
                      roomType={post.roomType}
                      placeholderText="No room photos"
                      compact
                    />
                    <div className="card-media-overlay">
                      <span className="media-badge media-badge-price">
                        {post.rentPerPerson
                          ? `₹${Number(post.rentPerPerson).toLocaleString()}`
                          : "Price on request"}
                      </span>
                      <span className="media-badge">Join My Flat</span>
                    </div>
                  </div>

                  <div className="card-content join-flat-content">
                    <div className="card-user-row">
                      <div className="card-user-mini-avatar">
                        {post.profileImage ? (
                          <img src={normalizeImageUrl(post.profileImage)} alt={post.name} />
                        ) : (
                          <span className="avatar-initial">{(post.name || "U").charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="card-user-mini-info">
                        <span className="user-mini-name">{post.name || "User"}</span>
                        <span className="user-mini-details">
                          {post.age ? `${post.age} yrs` : "Age not shared"}
                        </span>
                      </div>
                    </div>

                    <div className="card-price-block">
                      <div className="room-rent">
                        <span className="rent-label">
                          {post.rentPerPerson
                            ? `₹${Number(post.rentPerPerson).toLocaleString()} / month`
                            : "Price on request"}
                        </span>
                      </div>
                      <div className="card-location">
                        <span>{post.location || "Location TBD"}</span>
                      </div>
                    </div>

                    <div className="tag-row">
                      {post.roomType && (
                        <span className="meta-tag">{post.roomType}</span>
                      )}
                      {post.sharingType && (
                        <span className="meta-tag">{post.sharingType}</span>
                      )}
                      {post.amenities && post.amenities.length > 0 && (
                        <span className="meta-tag">{post.amenities.length} Amenities</span>
                      )}
                    </div>

                    <div className="card-actions card-actions-single">
                      <button
                        type="button"
                        className="card-action card-action-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          openPost(post._id);
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </>
              )}

              {post.type === "partner-up" && (
                <div className="partner-card-shell">
                  <div className="card-media-overlay card-media-overlay-static">
                    <span className="media-badge media-badge-price">
                      {post.budget ? `₹${Number(post.budget).toLocaleString()}` : "Flexible"}
                    </span>
                    <span className="media-badge">Need a Room</span>
                  </div>
                  <div className="partner-profile-section">
                    <div className="partner-avatar-large">
                      {post.profileImage ? (
                        <img
                          src={normalizeImageUrl(post.profileImage)}
                          alt={post.name}
                          className="partner-profile-image"
                        />
                      ) : (
                        <div className="partner-avatar-placeholder">
                          <span>{(post.name || "U").charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-content partner-content">
                    <div className="partner-heading">
                      <h3 className="partner-name">{post.name || "User"}</h3>
                      <div className="partner-bio">
                        <span>{post.age ? `${post.age} yrs` : "Age not shared"}</span>
                        <span>•</span>
                        <span className="capitalize">{post.gender || "Any gender"}</span>
                        <span>•</span>
                        <span className="capitalize">{post.occupation || "Working"}</span>
                      </div>
                    </div>

                    <div className="info-chip-grid">
                      <div className="info-chip">
                        <span className="info-chip-label">Budget</span>
                        <span className="info-chip-value">
                          {post.budget ? `₹${Number(post.budget).toLocaleString()}` : "Flexible"}
                        </span>
                      </div>
                      <div className="info-chip">
                        <span className="info-chip-label">Move-in</span>
                        <span className="info-chip-value">
                          {post.movingDateFrom
                            ? new Date(post.movingDateFrom).toLocaleDateString()
                            : "Flexible"}
                        </span>
                      </div>
                      <div className="info-chip">
                        <span className="info-chip-label">City</span>
                        <span className="info-chip-value">
                          {post.preferredLocation || post.location || "Open"}
                        </span>
                      </div>
                    </div>

                    <div className="tag-row">
                      {post.genderPreference && (
                        <span className="meta-tag capitalize">
                          {post.genderPreference === "any" ? "Any Gender" : post.genderPreference}
                        </span>
                      )}
                      {post.occupationPreference && (
                        <span className="meta-tag capitalize">
                          {post.occupationPreference === "any" ? "Any Profession" : post.occupationPreference}
                        </span>
                      )}
                      <span className="meta-tag">Non-Smoker</span>
                      <span className="meta-tag">Working</span>
                      <span className="meta-tag">Clean</span>
                    </div>

                    <div className="card-actions card-actions-single">
                      <button
                        type="button"
                        className="card-action card-action-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          openPost(post._id);
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
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
