import { Link } from "react-router-dom";
import "./AuthNavbar.css";

function AuthNavbar({ isAuthed = false }) {
  return (
    <header className="auth-nav-root">
      <nav className="auth-nav-container">
        <Link to={isAuthed ? "/feed" : "/"} className="auth-nav-logo">
          <span className="auth-nav-logo-text">Neeyds</span>
          <span className="auth-nav-tagline">Find your perfect roommate</span>
        </Link>

        <div className="auth-nav-links auth-nav-links-primary">
          <a href="/#features" className="auth-nav-link">
            Features
          </a>
          <a href="/#about" className="auth-nav-link">
            About
          </a>
        </div>

        <div className="auth-nav-links">
          {isAuthed ? (
            <>
              <Link to="/feed" className="auth-nav-link">
                Feed
              </Link>
              <Link to="/profile" className="auth-nav-button">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-nav-link">
                Sign In
              </Link>
              <Link to="/register" className="auth-nav-button">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default AuthNavbar;
