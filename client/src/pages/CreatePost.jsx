import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

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
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4 text-center">Create a Post</h3>

      {msg && <p className="text-success">{msg}</p>}
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <select
          name="type"
          className="form-control mb-3"
          onChange={handleChange}
        >
          <option value="join-flat">Join My Flat (I have a room)</option>
          <option value="partner-up">Partner Up (I need a roommate)</option>
        </select>

        <input
          type="number"
          name="rent"
          placeholder="Monthly Rent"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location (City/Area)"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <select
          name="genderPref"
          className="form-control mb-3"
          onChange={handleChange}
        >
          <option value="any">Any</option>
          <option value="male">Male Only</option>
          <option value="female">Female Only</option>
        </select>

        <textarea
          name="desc"
          placeholder="Description"
          className="form-control mb-3"
          onChange={handleChange}
        ></textarea>

        <button className="btn btn-primary w-100" type="submit">
          Submit Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
