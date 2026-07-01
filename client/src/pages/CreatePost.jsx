import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePost.css";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function CreatePost() {
  const navigate = useNavigate();

  const [postType, setPostType] = useState(null); // null, "join-my-flat", or "partner-up"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [roomImages, setRoomImages] = useState([]);

  const [form, setForm] = useState({
    name: "", 
    age: "",
    gender: "male", 
    occupation: "working",
    location: "",
    genderPreference: "any",
    occupationPreference: "any",
    description: "",
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

  // Handle type selection
  const handleTypeSelect = (type) => {
    setPostType(type);
    setError("");
  };

  // Handle input changes
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

  const validateImage = (file) => {
    if (!file.type.startsWith("image/")) {
      return `"${file.name}" is not an image file.`;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `"${file.name}" must be 5MB or smaller.`;
    }
    return "";
  };

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      e.target.value = "";
      return setError(validationError);
    }

    setError("");
    if (profileImage?.preview) URL.revokeObjectURL(profileImage.preview);
    setProfileImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleRoomImages = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (files.length > MAX_IMAGES) {
      e.target.value = "";
      return setError("You can upload a maximum of 5 room images.");
    }

    const validationError = files.map(validateImage).find(Boolean);
    if (validationError) {
      e.target.value = "";
      return setError(validationError);
    }

    setError("");
    roomImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
    setRoomImages(
      files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
    );
  };

  // Validate required fields
  const validateFields = () => {
    const required = {
      common: ["name", "age", "location", "description"],
      joinMyFlat: ["sharingType", "roomType", "rentPerPerson"],
      partnerUp: ["preferredLocation", "movingDateFrom", "budget"],
    };

    const missing = [];

    // Check common fields
    required.common.forEach((field) => {
      if (!form[field] || (Array.isArray(form[field]) && form[field].length === 0)) {
        missing.push(field);
      }
    });

    // Check type-specific fields
    if (postType === "join-my-flat") {
      if (roomImages.length === 0) missing.push("images");
      required.joinMyFlat.forEach((field) => {
        if (!form[field] || (Array.isArray(form[field]) && form[field].length === 0)) {
          missing.push(field);
        }
      }); 
    }

    if (postType === "partner-up") {
      if (!profileImage) missing.push("profileImage");
      required.partnerUp.forEach((field) => {
        if (!form[field]) {
          missing.push(field);
        }
      });
    }

    return missing;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const missing = validateFields();
    if (missing.length > 0) {
      return setError(`Missing fields: ${missing.join(", ")}`);
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const payload = new FormData();
      payload.append("type", postType);

      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => payload.append(key, item));
        } else if (value !== "") {
          payload.append(key, value);
        }
      });

      if (postType === "join-my-flat") {
        roomImages.forEach(({ file }) => payload.append("images", file));
      }

      if (postType === "partner-up") {
        payload.append("profileImage", profileImage.file);
      }

      await API.post("/posts", payload, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (event) => {
          if (!event.total) return;
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
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
              className={postType === "join-my-flat" ? "type-btn active" : "type-btn"}
              onClick={(e) => { e.preventDefault(); handleTypeSelect("join-my-flat"); }}
            >
              🏠 Join My Flat
            </button>
            <button
              type="button"
              className={postType === "partner-up" ? "type-btn active" : "type-btn"}
              onClick={(e) => { e.preventDefault(); handleTypeSelect("partner-up"); }}
            >
              🔍 Need a Room
            </button>
          </div>

          <div className="create-row" style={{ background: postType === "join-my-flat" ? "#e8f5e9" : "#e3f2fd", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <p style={{ margin: "0", fontSize: "14px" }}>
              {postType === "join-my-flat"
                ? "You have a room available. Share room details and photos to find compatible roommates."
                : "You need a room. Share your preferences and profile to find available rooms."}
            </p>
          </div>

          {postType === "partner-up" && (
            <div className="create-row">
              <div className="create-field">
                <label>Profile Image (required)</label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleProfileImage}
                  required
                />
                {profileImage && (
                  <img
                    src={profileImage.preview}
                    alt="Profile preview"
                    style={{ maxHeight: "120px", marginTop: "10px", borderRadius: "5px" }}
                  />
                )}
              </div>
            </div>
          )}

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
          {postType === "join-my-flat" && (
            <div className="create-row">
              <div className="create-field">
                <label>Room Images (required, maximum 5)</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleRoomImages}
                  required
                />
              {roomImages.length > 0 && (
                <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px" }}>
                  {roomImages.map(({ file, preview }, idx) => (
                    <div key={`${file.name}-${file.lastModified}`} style={{ position: "relative" }}>
                      <img
                        src={preview}
                        alt={`Room ${idx + 1}`}
                        style={{ maxHeight: "80px", maxWidth: "100%", borderRadius: "5px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(preview);
                          setRoomImages((images) => images.filter((_, i) => i !== idx));
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

          {postType === "join-my-flat" && (
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

          {postType === "partner-up" && (
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
          {loading && (
            <div className="create-row" aria-live="polite">
              <div className="create-field">
                <label htmlFor="upload-progress">Uploading: {uploadProgress}%</label>
                <progress
                  id="upload-progress"
                  value={uploadProgress}
                  max="100"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
export default CreatePost;
