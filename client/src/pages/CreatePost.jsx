import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();

  const [type, setType] = useState("join-my-flat");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    profileImage: "",
    name: "",
    age: "",
    gender: "male",
    occupation: "working",
    location: "",
    genderPreference: "any",
    occupationPreference: "any",
    description: "",
    roomPhotos: [],
    sharingType: "single",
    roomType: "1BHK",
    currentOccupants: "",
    totalCapacity: "",
    independentType: "independent",
    rentPerPerson: "",
    amenities: [],
    restrictions: "",
    preferredLocation: "",
    movingDateFrom: "",
    movingDateTo: "",
    budget: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleInput = (e) => {
    const { name, value, type: t, checked } = e.target;
    if (t === "checkbox" && name === "amenities") {
      setForm((s) => {
        const set = new Set(s.amenities);
        if (checked) set.add(value);
        else set.delete(value);
        return { ...s, amenities: Array.from(set) };
      });
      return;
    }
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleImagePaste = (e, fieldName) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target.result;
          if (fieldName === "profileImage") {
            setForm((s) => ({ ...s, profileImage: base64Image }));
          } else if (fieldName === "roomPhotos") {
            setForm((s) => ({
              ...s,
              roomPhotos: [...s.roomPhotos, base64Image],
            }));
            e.preventDefault();
          }
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!form.profileImage.trim()) return setError("Profile image URL is required");
    if (!form.name || !form.age || !form.location || !form.description)
      return setError("Please fill required fields");

    if (type === "join-my-flat") {
      if (!form.rentPerPerson) return setError("Rent per person is required for Join My Flat");
      const urls = form.roomPhotos.map((u) => (typeof u === "string" ? u.trim() : "")).filter(Boolean);
      if (urls.length === 0) return setError("Add at least one room photo URL for Join My Flat");
    }

    if (type === "partner-up") {
      if (!form.budget || !form.movingDateFrom)
        return setError("Budget and moving date are required for Partner Up");
    }

    setLoading(true);
    try {
      const payload = { ...form };
      payload.type = type;

      if (type !== "join-my-flat") {
        delete payload.roomPhotos;
      } else {
        // Support newline/comma-separated URLs to avoid broken image parsing
        payload.roomPhotos = form.roomPhotos.filter(url => url.trim());
      }

      // Support newline/comma-separated URLs to avoid broken image parsing
      payload.roomPhotos = form.roomPhotos.filter(url => url.trim());

      if (payload.age) payload.age = Number(payload.age);
      if (payload.rentPerPerson) payload.rentPerPerson = Number(payload.rentPerPerson);
      if (payload.budget) payload.budget = Number(payload.budget);
      if (payload.currentOccupants) payload.currentOccupants = Number(payload.currentOccupants);
      if (payload.totalCapacity) payload.totalCapacity = Number(payload.totalCapacity);

      const res = await API.post("/posts", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg("Post created successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create post");
    } finally {
      setLoading(false);
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
          <div className="create-row create-row-two">
            <button
              type="button"
              className={type === "join-my-flat" ? "type-btn active" : "type-btn"}
              onClick={(e) => { e.preventDefault(); setType("join-my-flat"); }}
            >
              🏠 Join My Flat
            </button>
            <button
              type="button"
              className={type === "partner-up" ? "type-btn active" : "type-btn"}
              onClick={(e) => { e.preventDefault(); setType("partner-up"); }}
            >
              🔍 Need a Room
            </button>
          </div>

          <div className="create-row" style={{ background: type === "join-my-flat" ? "#e8f5e9" : "#e3f2fd", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <p style={{ margin: "0", fontSize: "14px" }}>
              {type === "join-my-flat"
                ? "You have a room available. Share room details and photos to find compatible roommates."
                : "You need a room. Share your preferences and profile to find available rooms."}
            </p>
          </div>

          <div className="create-row">
            <div className="create-field">
              <label>Profile Image (required) - Paste image from Chrome or enter URL</label>
              <input
                type="text"
                name="profileImage"
                placeholder="https://example.com/image.jpg"
                value={form.profileImage}
                onChange={handleInput}
                onPaste={(e) => handleImagePaste(e, "profileImage")}
                required
              />
              {form.profileImage && form.profileImage.startsWith("data:") && (
                <img src={form.profileImage} alt="Profile preview" style={{ maxHeight: "100px", marginTop: "10px", borderRadius: "5px" }} />
              )}
            </div>
          </div>

          <div className="create-row create-row-two">
            <div className="create-field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleInput} required />
            </div>
            <div className="create-field">
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handleInput} required />
            </div>
          </div>

          <div className="create-row create-row-two">
            <div className="create-field">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleInput}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="create-field">
              <label>Occupation</label>
              <select name="occupation" value={form.occupation} onChange={handleInput}>
                <option value="student">Student</option>
                <option value="working">Working</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="create-row create-row-two">
            <div className="create-field">
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleInput} required />
            </div>
            <div className="create-field">
              <label>Preferred Gender</label>
              <select name="genderPreference" value={form.genderPreference} onChange={handleInput}>
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Room Photo Upload - Only for Join My Flat */}
          {type === "join-my-flat" && (
            <div className="create-row">
              <div className="create-field">
                <label>Room Photo URLs (required) - one per line or comma separated - Paste images from Chrome</label>
              <textarea
                placeholder="Paste images from Chrome or enter URLs: https://example.com/room1.jpg"
                value={form.roomPhotos.join('\n')}
                onChange={(e) => {
                  const urls = e.target.value
                    .split(/[\n,]/)
                    .map((u) => u.trim())
                    .filter(Boolean);
                  setForm(s => ({ ...s, roomPhotos: urls }));
                }}
                onPaste={(e) => handleImagePaste(e, "roomPhotos")}
                rows={3}
              />
              {form.roomPhotos.length > 0 && (
                <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px" }}>
                  {form.roomPhotos.map((photo, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
                        src={photo}
                        alt={`Room ${idx + 1}`}
                        style={{ maxHeight: "80px", maxWidth: "100%", borderRadius: "5px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm(s => ({
                            ...s,
                            roomPhotos: s.roomPhotos.filter((_, i) => i !== idx),
                          }));
                        }}
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          padding: "0",
                          background: "red",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {type === "join-my-flat" && (
            <>
              <div className="create-row create-row-two">
              <div className="create-field">
                <label>Sharing Type</label>
                <select name="sharingType" value={form.sharingType} onChange={handleInput}>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                </select>
                </div>
                <div className="create-field">
                  <label>Room Type</label>
                  <select name="roomType" value={form.roomType} onChange={handleInput}>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="PG">PG</option>
                    <option value="Shared Room">Shared Room</option>
                  </select>
                </div>
              </div>

              <div className="create-row create-row-two">
                <div className="create-field">
                  <label>Current Occupants</label>
                  <input
                    name="currentOccupants"
                    type="number"
                    value={form.currentOccupants}
                    onChange={handleInput}
                  />
                </div>
                <div className="create-field">
                  <label>Total Capacity</label>
                  <input
                    name="totalCapacity"
                    type="number"
                    value={form.totalCapacity}
                    onChange={handleInput}
                  />
                </div>
              </div>

              <div className="create-row create-row-two">
                <div className="create-field">
                  <label>Independent / Dependent</label>
                  <select name="independentType" value={form.independentType} onChange={handleInput}>
                    <option value="independent">Independent</option>
                    <option value="dependent">Dependent</option>
                  </select>
                </div>
                <div className="create-field">
                  <label>Rent Per Person</label>
                  <input
                    name="rentPerPerson"
                    type="number"
                    value={form.rentPerPerson}
                    onChange={handleInput}
                  />
                </div>
              </div>

              <div className="create-row">
                <div className="create-field">
                  <label>Amenities</label>
                  <div className="amenities-grid">
                    {["wifi","ac","kitchen","geyser","washing-machine","power-backup","parking","security","lift","balcony","fridge"].map((a) => (
                      <label key={a} className="amenity">
                        <input
                          type="checkbox"
                          name="amenities"
                          value={a}
                          checked={form.amenities.includes(a)}
                          onChange={handleInput}
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="create-row">
                <div className="create-field">
                  <label>Restrictions</label>
                  <textarea
                    name="restrictions"
                    value={form.restrictions}
                    onChange={handleInput}
                    rows={2}
                  />
                </div>
              </div>
          </>
          )}

          {type === "partner-up" && (
            <>
              <div className="create-row create-row-two">
                <div className="create-field">
                  <label>Preferred Location</label>
                  <input
                    name="preferredLocation"
                    value={form.preferredLocation}
                    onChange={handleInput}
                  />
                </div>
                <div className="create-field">
                  <label>Budget</label>
                  <input
                    name="budget"
                    type="number"
                    value={form.budget}
                    onChange={handleInput}
                  />
                </div>
              </div>

              <div className="create-row create-row-two">
                <div className="create-field">
                  <label>Moving Date From</label>
                  <input
                    name="movingDateFrom"
                    type="date"
                    value={form.movingDateFrom}
                    onChange={handleInput}
                  />
                </div>
                <div className="create-field">
                  <label>Moving Date To</label>
                  <input
                    name="movingDateTo"
                    type="date"
                    value={form.movingDateTo}
                    onChange={handleInput}
                  />
                </div>
              </div>
            </>
          )}          <div className="create-row">
            <div className="create-field">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInput}
                rows={4}
                required
              />
            </div>
          </div>

          <div className="create-row">
            <button className="create-submit" type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CreatePost;
