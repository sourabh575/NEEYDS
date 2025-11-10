import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Profile() {
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("user"));

  // ✅ Redirect if no login
  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  // ✅ Get user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/users/${userInfo._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        setError("Could not load profile");
      }
    };

    fetchUser();
  }, []);

  // ✅ Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        `/users/${userInfo._id}`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsg("Profile updated!");
    } catch (error) {
      setError("Update failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h3 className="mb-3">My Profile</h3>

      {msg && <p className="text-success">{msg}</p>}
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Name"
          value={user?.name || ""}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />

        {/* Location */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Location"
          value={user?.location || ""}
          onChange={(e) => setUser({ ...user, location: e.target.value })}
        />

        {/* Budget */}
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Budget"
          value={user?.budget || ""}
          onChange={(e) => setUser({ ...user, budget: e.target.value })}
        />

        {/* Preferences */}
        <textarea
          className="form-control mb-2"
          placeholder="Preferences"
          value={user?.preferences || ""}
          onChange={(e) => setUser({ ...user, preferences: e.target.value })}
        />

        <button className="btn btn-primary w-100" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}

export default Profile;

