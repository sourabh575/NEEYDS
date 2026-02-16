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
        clearAuth();
        navigate("/login", { replace: true });
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
        logoutToLogin();
      } else {
        setError(err.response?.data?.message || "Update failed. Please try again.");
      }
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    logoutToLogin();
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
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              className="form-select"
              value={user?.gender || ""}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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

