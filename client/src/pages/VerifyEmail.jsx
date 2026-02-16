import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/Login.css";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const calledRef = useRef(false); // 🔒 prevents double call

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    // 🚨 Prevent double API call
    if (calledRef.current) return;
    calledRef.current = true;

    const verifyEmail = async () => {
      try {
        const res = await API.get(`/users/verify-email?token=${token}`);
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Email Verification</h2>
        </div>

        {status === "verifying" && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="success-message" style={{ marginBottom: "1rem" }}>
              {message}
            </div>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to="/login" className="login-button">
                Go to Login
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="error-message" style={{ marginBottom: "1rem" }}>
              {message}
            </div>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to="/register" style={{ color: "#4CAF50" }}>
                Register again
              </Link>
              {" or "}
              <Link to="/login" style={{ color: "#4CAF50" }}>
                try logging in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;

