import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import API from "../api/axios";
import { setAuth } from "../utils/auth";
import AuthNavbar from "../components/AuthNavbar";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔐 Normal login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/users/login", { email, password });

      if (res.data.token && res.data._id) {
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
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await API.post("/users/google-login", {
        token: credentialResponse.credential,
      });

      setAuth({
        token: res.data.token,
        user: {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
        },
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google login failed. Try again.");
    }
  };

  return (
    <>
      <AuthNavbar />

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Normal Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: "20px 0", textAlign: "center" }}>
            <p>OR</p>
          </div>

          {/* Google Login Button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Google Login Failed");
                setError("Google login failed.");
              }}
            />
          </div>

          <div className="login-footer">
            Don’t have an account?{" "}
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
