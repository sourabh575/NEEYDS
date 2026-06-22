import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import API from "../api/axios";
import { getUserSafe, logoutToLogin } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  const user = getUserSafe();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const res = await API.get("/contact-request/received");
        setPendingCount(
          res.data.filter((request) => request.status === "pending").length
        );
      } catch {
        setPendingCount(0);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleLogout = () => {
    logoutToLogin();
  };

  return (
    <header className="nav-root">
      <nav className="nav-container">
        <div className="nav-left" onClick={() => navigate("/")}>
          <span className="nav-logo">Neeyds</span>
          <span className="nav-tagline">Find your perfect roommate</span>
        </div>

        <div className="nav-center">
          <Link className="nav-link" to="/feed">
            Feed
          </Link>
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
          <Link className="nav-link" to="/wishlist">
            ❤️ Wishlist
          </Link>
          <Link className="nav-link nav-link-with-badge" to="/contact-requests">
            Requests
            {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
          </Link>
        </div>

        <div className="nav-right">
          <Link className="nav-button nav-button-primary" to="/create-post">
            + Add Post
          </Link>
          {user && (
            <button
              type="button"
              className="nav-button nav-button-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;


