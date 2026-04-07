import { Link } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import "../styles/LandingPage.css";

const featureCards = [
  {
    eyebrow: "Need a Room",
    title: "Discover the right roommate match fast",
    description:
      "Browse curated profiles, compare budgets, and shortlist people who fit your lifestyle.",
  },
  {
    eyebrow: "Join My Flat",
    title: "Post your room and fill vacancies with confidence",
    description:
      "Share your flat details, add room photos, and reach serious people actively looking to move.",
  },
  {
    eyebrow: "Smart Matching",
    title: "Focus on compatibility, not just availability",
    description:
      "Filter by city, rent, move-in date, and preferences to connect with better-fit flatmates.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Profile",
    description: "Set up your profile with your preferences, budget, and lifestyle details.",
  },
  {
    step: "02",
    title: "Post or Browse",
    description: "List your room or explore roommate opportunities across major cities in India.",
  },
  {
    step: "03",
    title: "Connect and Move",
    description: "Start conversations, compare options, and lock in the right place to live.",
  },
];

const trustPoints = [
  "Verified users",
  "Easy posting",
  "Smart matching",
  "Secure messaging",
];

function LandingPage() {
  return (
    <div className="landing-shell">
      <AuthNavbar />

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <span className="landing-kicker">Roommate search, simplified</span>
            <h1>Find Your Perfect Flatmate in Minutes</h1>
            <p>
              Join thousands of users finding compatible roommates across India
              with a faster, more trustworthy renting experience.
            </p>

            <div className="landing-hero-actions">
              <Link to="/register" className="landing-button landing-button-primary">
                Get Started
              </Link>
              <Link
                to="/login"
                state={{ authPrompt: "Please login to browse available rooms" }}
                className="landing-button landing-button-secondary"
              >
                Browse Rooms
              </Link>
            </div>

            <div className="landing-proof-strip">
              <div>
                <strong>10k+</strong>
                <span>profiles explored</span>
              </div>
              <div>
                <strong>45+</strong>
                <span>cities covered</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>access to listings</span>
              </div>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="hero-dashboard-card hero-dashboard-primary">
              <div className="hero-card-header">
                <span className="hero-card-pill">Smart Match</span>
                <span className="hero-card-score">94% fit</span>
              </div>
              <h3>Ananya, 24</h3>
              <p>Looking for a female flatmate in Bangalore, budget under Rs 16,000.</p>
              <div className="hero-card-tags">
                <span>Working</span>
                <span>Non-smoker</span>
                <span>Move-in April</span>
              </div>
            </div>

            <div className="hero-dashboard-card hero-dashboard-secondary">
              <div className="hero-mini-label">Join My Flat</div>
              <h4>2BHK in HSR Layout</h4>
              <p>Private room, furnished, Wi-Fi, washing machine, balcony.</p>
              <div className="hero-price-row">
                <strong>Rs 14,500</strong>
                <span>per month</span>
              </div>
            </div>

            <div className="hero-floating-stat">
              <span>Verified users only</span>
              <strong>Safer conversations</strong>
            </div>
          </div>
        </section>

        <section className="landing-section" id="features">
          <div className="landing-section-heading">
            <span>What you can do</span>
            <h2>Everything needed to find the right roommate flow</h2>
          </div>
          <div className="landing-feature-grid">
            {featureCards.map((feature, index) => (
              <article key={feature.title} className="landing-feature-card">
                <div className="feature-icon">{index + 1}</div>
                <span className="feature-eyebrow">{feature.eyebrow}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section landing-steps-section">
          <div className="landing-section-heading">
            <span>How it works</span>
            <h2>Three simple steps from profile to move-in</h2>
          </div>
          <div className="landing-steps-grid">
            {steps.map((item) => (
              <article key={item.step} className="landing-step-card">
                <span className="step-index">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section landing-why-section">
          <div className="landing-section-heading">
            <span>Why choose us</span>
            <h2>Designed to feel professional, trustworthy, and easy to use</h2>
          </div>
          <div className="landing-trust-grid">
            {trustPoints.map((point) => (
              <div key={point} className="landing-trust-card">
                <div className="trust-mark">+</div>
                <h3>{point}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section landing-preview-section">
          <div className="landing-section-heading">
            <span>App preview</span>
            <h2>Preview the kind of listings users can trust</h2>
          </div>
          <div className="landing-preview-grid">
            <article className="preview-card preview-card-room">
              <span className="preview-type">Need a Room</span>
              <h3>Priya wants a clean, calm flat near Koramangala</h3>
              <p>
                Budget up to Rs 18,000, prefers female flatmates, moving in by mid-April.
              </p>
              <div className="preview-meta">
                <span>Bangalore</span>
                <span>Working professional</span>
              </div>
            </article>

            <article className="preview-card preview-card-flat">
              <span className="preview-type">Join My Flat</span>
              <h3>Sunny room available in a furnished 3BHK</h3>
              <p>
                Near metro access, secure building, Wi-Fi included, ideal for young professionals.
              </p>
              <div className="preview-meta">
                <span>Delhi NCR</span>
                <span>Rs 12,500 per month</span>
              </div>
            </article>
          </div>
        </section>

        <section className="landing-section landing-about-section" id="about">
          <div className="landing-section-heading">
            <span>About us</span>
            <h2>Neevys helps people find compatible roommates quickly and easily</h2>
            <p>
              We simplify the roommate search experience with clearer profiles,
              better discovery, and a polished flow that feels reliable from the first click.
            </p>
          </div>
        </section>

        <section className="landing-cta-section">
          <div className="landing-cta-card">
            <div>
              <span className="landing-kicker">Ready to find your roommate?</span>
              <h2>Start your search with a profile that stands out</h2>
            </div>
            <Link to="/register" className="landing-button landing-button-primary">
              Sign Up Now
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <strong>Neevys</strong>
          <span>Better roommate decisions for modern renters.</span>
        </div>
        <div className="landing-footer-links">
          <Link to="/#about">About</Link>
          <Link to="/login" state={{ authPrompt: "Please login to contact support" }}>
            Contact
          </Link>
          <Link to="/register">Privacy</Link>
          <Link to="/register">Terms</Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
