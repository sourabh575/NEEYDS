import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        budget: "",
        location: "",
      });

      const [error, setError] = useState("");
      const navigate = useNavigate();

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await API.post("/users/register", formData);
          alert("Registered successfully!");
          navigate("/login");
        } catch (err) {
          setError(err.response?.data?.message || "Registration failed");
        }
      };

      return (
        <div  className="container mt-5" style={{ maxWidth: "400px" }}>
         <h3 className="mb-3 text-center">Sign Up</h3>
         {error && <p className="text-danger">{error}</p>}
         <form onSubmit={handleSubmit}>
         <input type="text" className="form-control mb-2" name="name" placeholder="Name" onChange={handleChange} />
        <input type="email" className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" className="form-control mb-2" name="password" placeholder="Password" onChange={handleChange} />
        <input type="text" className="form-control mb-2" name="location" placeholder="Location" onChange={handleChange} />
        <input type="number" className="form-control mb-2" name="budget" placeholder="Budget" onChange={handleChange} />
        <select name="gender" className="form-control mb-3" onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button className="btn btn-primary w-100" type="submit">Register</button>
        </form>
        </div>
      )
}
export default Register;