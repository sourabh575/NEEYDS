import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import AuthNavbar from "../components/AuthNavbar";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/users/register", formData);
      
      // Registration successful → show verification message
      if (res.status === 201) {
        setSuccess(true);
        setError("");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      // Extract error message from response
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Unable to connect to server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar />

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h2>Create Your Account</h2>
            <p>Join Neeyds and find your perfect roommate match</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {success && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <div className="success-content">
                <h3>Registration Successful!</h3>
                <p>
                  We've sent a verification email to{" "}
                  <strong>{formData.email}</strong>
                </p>
                <p className="success-note">
                  Please check your inbox and click the verification link to
                  activate your account.
                </p>
              </div>
            </div>
          )}

          {!success && (
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                className="register-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          <div className="register-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
