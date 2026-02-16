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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/users/login", { email, password });

      setAuth({
        token: res.data.token,
        user: res.data,
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/users/google-login", {
        token: credentialResponse.credential,
      });

      setAuth({
        token: res.data.token,
        user: res.data,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google login failed", error);
      setError("Google login failed");
    }
  };

  return (
    <>
      <AuthNavbar />
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p>OR</p>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
            />
          </div>

          <div className="login-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
