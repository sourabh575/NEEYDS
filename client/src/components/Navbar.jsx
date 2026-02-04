import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { getUserSafe, logoutToLogin } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  const user = getUserSafe();

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


