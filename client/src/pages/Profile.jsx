import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  // ✅ Check authentication and get user info
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // ✅ Get user info from API
  useEffect(() => {
    const fetchUser = async () => {
      if (!userInfo?._id) return;

      try {
        setLoading(true);
        setError("");
        // Axios interceptor automatically adds the token
        const res = await API.get(`/users/${userInfo._id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
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

  // ✅ Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!userInfo?._id) {
      navigate("/login");
      return;
    }

    try {
      // Axios interceptor automatically adds the token
      const res = await API.put(`/users/${userInfo._id}`, user);
      setMsg("Profile updated successfully!");
      setUser(res.data.user || user);
      // Update localStorage with new user data
      if (res.data.user) {
        const updatedUser = { ...userInfo, ...res.data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserInfo(updatedUser);
      }
      // Clear message after 3 seconds
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Update failed. Please try again.");
      }
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Show loading state while checking auth or fetching data
  if (loading || !userInfo) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          {user?.email && <p className="user-email">{user.email}</p>}
        </div>

        {msg && <div className="success-message">{msg}</div>}
        {error && <div className="error-message">{error}</div>}

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={user?.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              className="form-input"
              placeholder="Enter your location"
              value={user?.location || ""}
              onChange={(e) => setUser({ ...user, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget (₹)</label>
            <input
              id="budget"
              type="number"
              className="form-input"
              placeholder="Enter your budget"
              value={user?.budget || ""}
              onChange={(e) => setUser({ ...user, budget: e.target.value })}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferences">Preferences</label>
            <textarea
              id="preferences"
              className="form-textarea"
              placeholder="Tell us about your preferences (e.g., non-smoker, tidy, vegetarian)"
              value={user?.preferences || ""}
              onChange={(e) => setUser({ ...user, preferences: e.target.value })}
            />
          </div>

          <button className="profile-button" type="submit">
            Save Changes
          </button>
        </form>

        <div className="profile-actions">
          <button className="logout-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

