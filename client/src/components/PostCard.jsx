import ImageGallery from "./ImageGallery";
import { normalizePhotoList, normalizeImageUrl } from "../utils/imageUrls";

function PostCard({
  post,
  isSaved = false,
  onOpen,
  onWishlistToggle,
  contactAction,
}) {
  const getPostImages = () =>
    post?.type === "join-my-flat" ? normalizePhotoList(post.roomPhotos) : [];

  const handleOpen = () => {
    onOpen?.(post._id);
  };

  const handleWishlistClick = (event) => {
    event.stopPropagation();
    onWishlistToggle?.(post._id);
  };

  const actionColumnsClass = contactAction ? "" : "card-actions-single";

  return (
    <article
      className={`feed-card feed-card-${post.type}`}
      onClick={handleOpen}
    >
      {post.type === "join-my-flat" && (
        <>
          <div className="card-image card-image-join">
            <ImageGallery
              images={getPostImages()}
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
                  <span className="avatar-initial">
                    {(post.name || "U").charAt(0).toUpperCase()}
                  </span>
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
              {post.roomType && <span className="meta-tag">{post.roomType}</span>}
              {post.sharingType && (
                <span className="meta-tag">{post.sharingType}</span>
              )}
              {post.amenities && post.amenities.length > 0 && (
                <span className="meta-tag">{post.amenities.length} Amenities</span>
              )}
            </div>

            <div className={`card-actions ${actionColumnsClass}`}>
              {contactAction && (
                <button
                  type="button"
                  className="card-action card-action-primary"
                  onClick={contactAction.onClick}
                  disabled={contactAction.disabled}
                >
                  {contactAction.label}
                </button>
              )}
              <button
                type="button"
                className={`card-action wishlist-btn ${isSaved ? "wishlist-btn-saved" : ""}`}
                onClick={handleWishlistClick}
              >
                {isSaved ? "❤️ Saved" : "🤍 Save"}
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
                  {post.occupationPreference === "any"
                    ? "Any Profession"
                    : post.occupationPreference}
                </span>
              )}
              <span className="meta-tag">Non-Smoker</span>
              <span className="meta-tag">Working</span>
              <span className="meta-tag">Clean</span>
            </div>

            <div className={`card-actions ${actionColumnsClass}`}>
              {contactAction && (
                <button
                  type="button"
                  className="card-action card-action-primary"
                  onClick={contactAction.onClick}
                  disabled={contactAction.disabled}
                >
                  {contactAction.label}
                </button>
              )}
              <button
                type="button"
                className={`card-action wishlist-btn ${isSaved ? "wishlist-btn-saved" : ""}`}
                onClick={handleWishlistClick}
              >
                {isSaved ? "❤️ Saved" : "🤍 Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default PostCard;
