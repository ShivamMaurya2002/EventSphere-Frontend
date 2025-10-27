import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "/src/assets/css/LoginForm.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // --- Empty field validation ---
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    // --- Gmail validation ---
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.(com|in|org)$/;
    if (!gmailPattern.test(email)) {
      setError("Enter a valid Gmail address (@gmail.com / @gmail.in / @gmail.org).");
      return;
    }

    // --- Check localStorage for registered users ---
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existingUser) {
      setError("No account found with this email. Please register first.");
      return;
    }

    if (existingUser.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // --- Set currentUser in localStorage ---
    localStorage.setItem("currentUser", JSON.stringify(existingUser));

    // --- Optional: Login via context if needed ---
    if (login) await login({ email, password });

    alert(`Welcome back, ${existingUser.name}!`);

    // --- Navigate to dashboard or home ---
    navigate("/dashboard"); 
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Gmail"
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <div className="login-buttons">
            <button type="submit" className="btn-login">Login</button>
            <Link to="/register" className="btn-register">Register</Link>
          </div>
        </form>

        <p className="login-tip">
          Tip: Use an email containing <b>".org"</b> to log in as an organizer.
        </p>
      </div>
    </div>
  );
}
