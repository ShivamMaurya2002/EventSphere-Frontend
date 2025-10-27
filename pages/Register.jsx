import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../assets/CSS/RegisterForm.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // --- Basic Validation ---
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required!");
      return;
    }

    // --- Gmail Specific Validation ---
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.(com|in|org)$/;
    if (!gmailPattern.test(email)) {
      setError(
        "Please enter a valid Gmail address (@gmail.com / @gmail.in / @gmail.org)."
      );
      return;
    }

    // --- Password Validation ---
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // --- Duplicate Email Check (LocalStorage) ---
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some((u) => u.email === email);

    if (emailExists) {
      setError("This email is already registered!");
      return;
    }

    // --- Save New User ---
    const newUser = { id: Date.now(), name, email, password };
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Save current logged-in user
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // --- Register via Context ---
    if (register) {
      await register({ name, email, password });
    }

    alert("Registration successful!");
    navigate("/"); // Redirect to login or home page
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h3 className="register-title">Register</h3>

        {error && <div className="register-error">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Gmail address"
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (min 6 chars)"
            required
          />

          <button type="submit" className="button-register">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
