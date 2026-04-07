import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/UserProfileDetail.css";

function UserProfileDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock user data - replace with API call
  const user = {
    id: userId || "1",
    name: "Eshank Rawat",
    age: 22,
    gender: "Male",
    occupation: "M.L. Engineer",
    location: "MP Nagar, Bhopal",
    profileImage: "https://via.placeholder.com/120/6366f1/ffffff?text=ER",
    rent: "₹15,000",
    roomType: "Private Room",
    bhk: "2 BHK",
    description:
      "I'm a friendly M.L. Engineer looking for a compatible roommate. I believe in maintaining a clean and organized living space while respecting personal boundaries.",
    preferences: [
      { icon: "🏠", label: "Clean & Organized" },
      { icon: "🌙", label: "Night Owl" },
      { icon: "🍽️", label: "Vegetarian" },
      { icon: "🎨", label: "Minimalist" },
    ],
    amenities: [
      "Wi-Fi",
      "AC",
      "Kitchen",
      "Washing Machine",
      "Power Backup",
      "Parking",
    ],
    genderPreference: "Any",
    movingDate: "Immediate",
    description2: "Looking for someone who is responsible and values privacy.",
  };

  const handleChat = () => {
    console.log("Opening chat with:", user.name);
    // Add chat functionality
  };

  const handleCall = () => {
    console.log("Calling:", user.name);
    // Add call functionality
  };

  return (
    <div className="profile-detail-root">
      <div className="profile-detail-container">
        {/* Left Sidebar */}
        <aside className="profile-sidebar">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-image-wrapper">
              <img
                src={user.profileImage}
                alt={user.name}
                className="profile-image"
              />
            </div>

            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-subtitle">
              {user.age} yrs • {user.gender}
            </p>
            <p className="profile-occupation">{user.occupation}</p>

            <div className="profile-buttons">
              <button className="btn-chat" onClick={handleChat}>
                💬 Chat
              </button>
              <button className="btn-call" onClick={handleCall}>
                📞 Call
              </button>
            </div>
          </div>

          {/* Premium Card */}
          <div className="premium-card">
            <div className="premium-badge">Popular</div>
            <p className="premium-text">Premium Member</p>
            <div className="premium-price">
              <span className="price">₹15,000</span>
              <span className="period">/month</span>
            </div>
            <button className="btn-premium">View Room</button>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="profile-main">
          {/* Location Section */}
          <section className="profile-section">
            <div className="section-header">
              <span className="section-icon">📍</span>
              <h2 className="section-title">Location</h2>
            </div>
            <p className="section-content">{user.location}</p>
          </section>

          {/* Basic Info Section */}
          <section className="profile-section">
            <h2 className="section-title">Basic Info</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">👥</span>
                <span className="info-label">Gender</span>
                <span className="info-value">{user.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">💰</span>
                <span className="info-label">Rent</span>
                <span className="info-value">{user.rent}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🏘️</span>
                <span className="info-label">Room Type</span>
                <span className="info-value">{user.roomType}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🏠</span>
                <span className="info-label">BHK</span>
                <span className="info-value">{user.bhk}</span>
              </div>
            </div>
          </section>

          {/* Looking For Section */}
          <section className="profile-section">
            <h2 className="section-title">Looking For</h2>
            <div className="looking-for-grid">
              <div className="looking-item">
                <span className="looking-icon">👥</span>
                <span className="looking-label">{user.genderPreference}</span>
              </div>
              <div className="looking-item">
                <span className="looking-icon">📅</span>
                <span className="looking-label">{user.movingDate}</span>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="profile-section">
            <h2 className="section-title">Preferences</h2>
            <div className="preferences-grid">
              {user.preferences.map((pref, idx) => (
                <div key={idx} className="preference-item">
                  <div className="preference-icon">{pref.icon}</div>
                  <span className="preference-label">{pref.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Amenities Section */}
          <section className="profile-section">
            <h2 className="section-title">Amenities</h2>
            <div className="amenities-list">
              {user.amenities.map((amenity, idx) => (
                <span key={idx} className="amenity-tag">
                  {amenity}
                </span>
              ))}
            </div>
          </section>

          {/* About Section */}
          <section className="profile-section">
            <h2 className="section-title">About</h2>
            <p className="about-text">{user.description}</p>
            <p className="about-text">{user.description2}</p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default UserProfileDetail;
