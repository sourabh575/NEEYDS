import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await API.post("/users/login", { email, password });
          localStorage.setItem("token", res.data.token);
          alert("Login successful!");
           // (next page)
        } catch (err) {
          setError(err.response?.data?.message || "Login failed");
        }
      };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h3 className="mb-3 text-center">Login</h3>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" className="form-control mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="form-control mb-3" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-primary w-100" type="submit">Login</button>
        </form>
      </div>
    )
}
export default Login;