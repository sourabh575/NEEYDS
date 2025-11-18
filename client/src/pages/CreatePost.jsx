import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    title: "",
    type: "join-flat",
    rent: "",
    location: "",
    genderPref: "any",
    desc: "",
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/posts",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg("Post created successfully!");
      setError("");

      setTimeout(() => {
        navigate("/"); // go to home / feed page
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="create-root">
      <div className="create-card">
        <div className="create-header">
          <h3>Create a Post</h3>
          <p>Share a room or find your next roommate in a few simple steps.</p>
        </div>

        {msg && <p className="create-message success">{msg}</p>}
        {error && <p className="create-message error">{error}</p>}

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="create-row">
            <div className="create-field">
              <label htmlFor="title">Post Title</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Looking for a roommate near HSR Layout"
                value={postData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="create-row create-row-two">
            <div className="create-field">
              <label htmlFor="type">Post Type</label>
              <select
                id="type"
                name="type"
                value={postData.type}
                onChange={handleChange}
              >
                <option value="join-flat">Join My Flat (I have a room)</option>
                <option value="partner-up">Partner Up (I need a roommate)</option>
              </select>
            </div>

            <div className="create-field">
              <label htmlFor="rent">Monthly Rent (₹)</label>
              <input
                id="rent"
                type="number"
                name="rent"
                placeholder="15000"
                value={postData.rent}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="create-row create-row-two">
            <div className="create-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="City / Area"
                value={postData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-field">
              <label htmlFor="genderPref">Preferred Gender</label>
              <select
                id="genderPref"
                name="genderPref"
                value={postData.genderPref}
                onChange={handleChange}
              >
                <option value="any">Any</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>
            </div>
          </div>

          <div className="create-row">
            <div className="create-field">
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                name="desc"
                placeholder="Describe the room, flat, and the kind of roommate you’re looking for."
                value={postData.desc}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
          </div>

          <button className="create-submit" type="submit">
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
