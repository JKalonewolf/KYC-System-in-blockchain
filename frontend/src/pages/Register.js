import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ 1. Add this
import "../styles/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ 2. Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      console.log(response.data);
      setMessage("Registration successful ✅");

      setTimeout(() => {
        navigate("/login"); // ✅ 3. Redirect after short delay
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Registration failed ❌");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="register-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="register-input"
          >
            <option value="customer">Customer</option>
            <option value="bank">Bank</option>
          </select>
          <button type="submit" className="register-button">
            Register
          </button>
          <p className="register-message">{message}</p>
        </form>
      </div>
    </div>
  );
}

export default Register;
