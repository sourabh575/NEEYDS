import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { setAuth } from "../utils/auth";
import AuthNavbar from "../components/AuthNavbar";
import "../styles/Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
      });

      if (res.status === 201 && res.data.token && res.data._id) {
        setAuth({
          token: res.data.token,
          user: {
            _id: res.data._id,
            name: res.data.name,
            email: res.data.email,
          },
        });

        navigate("/", { replace: true });
      } else {
        setError("Registration succeeded, but automatic login failed. Please sign in.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = "Registration failed. Please try again.";

      if (err.response) {
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = "Unable to connect to server. Please check your connection.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar />
      <div className="auth-page-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us to find your perfect roommate</p>
          </div>

          {error && <div className="auth-error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="auth-input"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="auth-input"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="auth-input"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="gender">Gender (Optional)</label>
              <select
                id="gender"
                name="gender"
                className="auth-select"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button className="auth-button-primary" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
