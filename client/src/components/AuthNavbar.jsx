import { Link } from "react-router-dom";
import "./AuthNavbar.css";

function AuthNavbar() {
  return (
    <header className="auth-nav-root">
      <nav className="auth-nav-container">
        <Link to="/" className="auth-nav-logo">
          <span className="auth-nav-logo-text">Neeyds</span>
          <span className="auth-nav-tagline">Find your perfect roommate</span>
        </Link>

        <div className="auth-nav-links">
          <Link to="/login" className="auth-nav-link">
            Sign In
          </Link>
          <Link to="/register" className="auth-nav-button">
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default AuthNavbar;
