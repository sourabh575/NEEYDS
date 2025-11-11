import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/users/login", { email, password });

      // ✅ Save token + user data
      if (res.data.token && res.data._id) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
        }));

        // ✅ Redirect to profile - localStorage is synchronous so this is safe
        navigate("/profile", { replace: true });
      } else {
        setError("Invalid response from server. Please try again.");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-button" type="submit">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
