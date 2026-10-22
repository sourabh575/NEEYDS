import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
import "../styles/UserProfileDetail.css";

function UserProfileDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    API.get(`/users/${userId}`)
      .then((response) => {
        if (active) setUser(response.data);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || "Could not load this profile.");
        }
      });

    return () => {
      active = false;
    };
  }, [userId]);

  if (error) {
    return <p className="profile-detail-root">{error}</p>;
  }

  if (!user) {
    return <p className="profile-detail-root">Loading profile...</p>;
  }

  return (
    <main className="profile-detail-root">
      <section className="profile-detail-container">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-image-wrapper">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="profile-image" />
              ) : (
                <div className="profile-image profile-avatar-placeholder">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <h1 className="profile-name">{user.name}</h1>
            {user.gender && <p className="profile-subtitle">{user.gender}</p>}
          </div>
        </aside>

        <section className="profile-main">
          <div className="profile-section">
            <h2 className="section-title">About this member</h2>
            <p className="section-content">
              This profile shows the public information shared by the member.
            </p>
          </div>
          <div className="profile-section">
            <h2 className="section-title">Contact privacy</h2>
            <p className="section-content">
              Contact details are shared only through an accepted listing request.
            </p>
          </div>
          <Link className="btn-premium" to="/feed">Back to listings</Link>
        </section>
      </section>
    </main>
  );
}

export default UserProfileDetail;
