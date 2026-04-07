import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Profile.css";
import { clearAuth, logoutToLogin } from "../utils/auth";

function Profile() {
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Check authentication and get user info
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        navigate("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUserInfo(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
        clearAuth();
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  // Get user info from API
  useEffect(() => {
    const fetchUser = async () => {
      if (!userInfo?._id) return;

      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/users/${userInfo._id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.response?.status === 401) {
          logoutToLogin();
        } else {
          setError("Could not load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?._id) {
      fetchUser();
    }
  }, [userInfo, navigate]);

  // Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!userInfo?._id) {
      navigate("/login");
      return;
    }

    try {
      const res = await API.put(`/users/${userInfo._id}`, user);
      setMsg("Profile updated successfully!");
      setUser(res.data.user || user);
      if (res.data.user) {
        const updatedUser = { ...userInfo, ...res.data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserInfo(updatedUser);
      }
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.status === 401) {
        logoutToLogin();
      } else {
        setError(err.response?.data?.message || "Update failed. Please try again.");
      }
    }
  };

  // Logout function
  const handleLogout = () => {
    logoutToLogin();
  };

  // Show loading state
  if (loading || !userInfo) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-loading">
            <div className="profile-loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="profile-user-name">{user?.name || "Your Name"}</h2>
            <p className="profile-user-email">{user?.email || "email@example.com"}</p>
          </div>
        </div>

        {/* Messages */}
        {msg && <div className="profile-success-message">{msg}</div>}
        {error && <div className="profile-error-message">{error}</div>}

        {/* Form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-form-group">
            <label className="profile-form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="profile-form-input"
              placeholder="Enter your name"
              value={user?.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div className="profile-form-group">
            <label className="profile-form-label" htmlFor="age">Age (Optional)</label>
            <input
              id="age"
              type="number"
              className="profile-form-input"
              placeholder="Enter your age"
              value={user?.age || ""}
              onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) || "" })}
            />
          </div>

          <div className="profile-form-group">
            <label className="profile-form-label" htmlFor="gender">Gender</label>
            <select
              id="gender"
              className="profile-form-select"
              value={user?.gender || ""}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            >
              <option value="">Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="profile-form-group">
            <label className="profile-form-label" htmlFor="location">Location (Optional)</label>
            <input
              id="location"
              type="text"
              className="profile-form-input"
              placeholder="e.g., Mumbai, Bangalore"
              value={user?.location || ""}
              onChange={(e) => setUser({ ...user, location: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="profile-buttons">
            <button className="profile-button" type="submit">
              Save Changes
            </button>
            <button className="logout-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;

