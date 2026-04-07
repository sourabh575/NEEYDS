import React from "react";
import "../styles/UserProfileCard.css";

function UserProfileCard({ user, createdAt }) {
  const formatDate = (date) => {
    if (!date) return "Recently";
    const postDate = new Date(date);
    const today = new Date();
    const diffMs = today - postDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    }
    return postDate.toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGenderBadgeColor = (gender) => {
    if (!gender) return "#94a3b8";
    const g = gender.toLowerCase();
    if (g === "male") return "#3b82f6";
    if (g === "female") return "#ec4899";
    return "#8b5cf6";
  };

  const getOccupationIcon = (occupation) => {
    const occ = occupation?.toLowerCase();
    if (occ === "student") return "🎓";
    if (occ === "working") return "💼";
    return "👤";
  };

  return (
    <div className="user-profile-card">
      <div className="user-avatar" style={{ "--avatar-color": "#6366f1" }}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="avatar-image" />
        ) : (
          <div className="initials">{getInitials(user?.name)}</div>
        )}
      </div>

      <div className="user-info">
        <div className="user-header">
          <h4 className="user-name">{user?.name || "Anonymous"}</h4>
          {user?.age && <span className="user-age">, {user.age}</span>}
        </div>

        <div className="user-meta">
          {user?.gender && (
            <span className="meta-badge" style={{ "--badge-color": getGenderBadgeColor(user.gender) }}>
              {user.gender}
            </span>
          )}
          {user?.occupation && (
            <span className="meta-badge occupation">
              {getOccupationIcon(user.occupation)} {user.occupation}
            </span>
          )}
        </div>

        <div className="user-timestamp">
          <span className="timestamp-icon">🕐</span>
          <span className="timestamp-text">{formatDate(createdAt)}</span>
        </div>

        <div className="user-status">
          <span className="status-indicator"></span>
          <span className="status-text">Active</span>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;
