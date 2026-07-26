import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/CreatePost.css";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function CreatePost() {
  const navigate = useNavigate();

  const [postType, setPostType] = useState(null);
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

  const handleTypeSelect = (type) => {
    setPostType(type);
    setError("");
  };

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox" && name === "amenities") {
      setForm((current) => {
        const amenities = new Set(current.amenities);
        if (checked) amenities.add(value);
        else amenities.delete(value);
        return { ...current, amenities: Array.from(amenities) };
      });
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
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

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      event.target.value = "";
      return setError(validationError);
    }

    setError("");
    if (profileImage?.preview) URL.revokeObjectURL(profileImage.preview);
    setProfileImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleRoomImages = (event) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const existingKeys = new Set(
      roomImages.map(({ file }) => `${file.name}-${file.size}-${file.lastModified}`)
    );
    const newFiles = files.filter(
      (file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`)
    );
    const nextFiles = [...roomImages.map(({ file }) => file), ...newFiles];

    if (nextFiles.length > MAX_IMAGES) {
      event.target.value = "";
      return setError("You can upload a maximum of 5 room images.");
    }

    const validationError = newFiles.map(validateImage).find(Boolean);
    if (validationError) {
      event.target.value = "";
      return setError(validationError);
    }

    setError("");
    setRoomImages((current) => [
      ...current,
      ...newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
    event.target.value = "";
  };

  const removeRoomImage = (index) => {
    setRoomImages((current) => {
      const image = current[index];
      if (image?.preview) URL.revokeObjectURL(image.preview);
      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const validateFields = () => {
    const required = {
      common: ["name", "age", "location", "description"],
      joinMyFlat: ["sharingType", "roomType", "rentPerPerson"],
      partnerUp: ["preferredLocation", "movingDateFrom", "budget"],
    };

    const missing = [];

    if (!postType) missing.push("post type");

    required.common.forEach((field) => {
      if (!form[field]) missing.push(field);
    });

    if (postType === "join-my-flat") {
      if (roomImages.length === 0) missing.push("images");
      required.joinMyFlat.forEach((field) => {
        if (!form[field]) missing.push(field);
      });
    }

    if (postType === "partner-up") {
      if (!profileImage) missing.push("profileImage");
      required.partnerUp.forEach((field) => {
        if (!form[field]) missing.push(field);
      });
    }

    return missing;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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

  const typeHelpText = (() => {
    if (postType === "join-my-flat") {
      return "You have a room available. Share room details and photos to find compatible roommates.";
    }
    if (postType === "partner-up") {
      return "You want to partner up. Share your preferences and profile to find compatible roommates.";
    }
    return "Choose Join My Flat if you have a room, or Partner Up if you want to find someone to search with.";
  })();

  return (
    <div className="create-root">
      <div className="create-card">
        <div className="create-header">
          <h3>Create a Post</h3>
          <p>First choose the kind of listing you want to create.</p>
        </div>

        {msg && <p className="create-message success">{msg}</p>}
        {error && <p className="create-message error">{error}</p>}

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="create-row create-row-two">
            <button
              type="button"
              className={postType === "join-my-flat" ? "type-btn active" : "type-btn"}
              onClick={() => handleTypeSelect("join-my-flat")}
            >
              Join My Flat
            </button>
            <button
              type="button"
              className={postType === "partner-up" ? "type-btn active" : "type-btn"}
              onClick={() => handleTypeSelect("partner-up")}
            >
              Partner Up
            </button>
          </div>

          <div className={`create-row create-type-help ${postType || ""}`}>
            <p>{typeHelpText}</p>
          </div>

          {postType && (
            <>
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
                        className="create-image-preview create-image-preview-profile"
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
                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleInput}
                    required
                  />
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
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleInput}
                    required
                  />
                </div>
                <div className="create-field">
                  <label>Preferred Gender</label>
                  <select
                    name="genderPreference"
                    value={form.genderPreference}
                    onChange={handleInput}
                  >
                    <option value="any">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {postType === "join-my-flat" && (
                <>
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
                        <div className="create-image-grid">
                          {roomImages.map(({ file, preview }, index) => (
                            <div
                              key={`${file.name}-${file.lastModified}`}
                              className="create-image-thumb"
                            >
                              <img src={preview} alt={`Room ${index + 1}`} />
                              <button
                                type="button"
                                onClick={() => removeRoomImage(index)}
                                aria-label={`Remove room image ${index + 1}`}
                              >
                                x
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="create-row create-row-two">
                    <div className="create-field">
                      <label>Sharing Type</label>
                      <select
                        name="sharingType"
                        value={form.sharingType}
                        onChange={handleInput}
                      >
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
                      <select
                        name="independentType"
                        value={form.independentType}
                        onChange={handleInput}
                      >
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
                        {[
                          "wifi",
                          "ac",
                          "kitchen",
                          "geyser",
                          "washing-machine",
                          "power-backup",
                          "parking",
                          "security",
                          "lift",
                          "balcony",
                          "fridge",
                        ].map((amenity) => (
                          <label key={amenity} className="amenity">
                            <input
                              type="checkbox"
                              name="amenities"
                              value={amenity}
                              checked={form.amenities.includes(amenity)}
                              onChange={handleInput}
                            />
                            {amenity}
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
              )}

              <div className="create-row">
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
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
