import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { ensureMobileNumber } from "../utils/phoneRequirement";
import "../styles/ContactRequests.css";

function ContactRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === "pending").length,
    [requests]
  );

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/contact-request/received");
      setRequests(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (requestId, action) => {
    try {
      if (action === "accept") {
        const hasMobileNumber = await ensureMobileNumber(navigate);
        if (!hasMobileNumber) return;
      }

      const res = await API.put(`/contact-request/${action}/${requestId}`);
      setRequests((current) =>
        current.map((request) => (request._id === requestId ? res.data : request))
      );
      setMessage(action === "accept" ? "Request accepted" : "Request rejected");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update request");
    }
  };

  if (loading) {
    return (
      <main className="requests-root">
        <section className="requests-shell">
          <p className="requests-muted">Loading contact requests...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="requests-root">
      <section className="requests-shell">
        <header className="requests-header">
          <div>
            <h1>Contact Requests</h1>
            <p>
              {pendingCount} pending {pendingCount === 1 ? "request" : "requests"}
            </p>
          </div>
        </header>

        {message && <div className="requests-message">{message}</div>}

        {requests.length === 0 ? (
          <div className="requests-empty">
            <h2>No requests yet</h2>
            <p>Incoming interest from your posts will appear here.</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <article className="request-card" key={request._id}>
                <div className="request-main">
                  <div className="request-avatar">
                    {request.senderId?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="request-title-row">
                      <h2>{request.senderId?.name || "Interested user"}</h2>
                      <span className={`request-status request-status-${request.status}`}>
                        {request.status}
                      </span>
                    </div>
                    <p>
                      Interested in{" "}
                      <strong>{request.postId?.name || "your post"}</strong>
                    </p>
                    <span className="request-meta">
                      {request.postId?.location ||
                        request.postId?.preferredLocation ||
                        "Location not shared"}
                    </span>
                  </div>
                </div>

                {request.status === "accepted" && (
                  <div className="request-contact-grid">
                    <div>
                      <span>Sender phone</span>
                      <strong>{request.senderId?.phone || "Not provided"}</strong>
                    </div>
                    <div>
                      <span>Your phone</span>
                      <strong>{request.receiverId?.phone || "Not provided"}</strong>
                    </div>
                  </div>
                )}

                {request.status === "pending" && (
                  <div className="request-actions">
                    <button
                      type="button"
                      className="request-button request-button-accept"
                      onClick={() => updateStatus(request._id, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="request-button request-button-reject"
                      onClick={() => updateStatus(request._id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ContactRequests;
