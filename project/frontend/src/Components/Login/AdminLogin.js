import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: user.email,
        password: user.password,
      });

      const data = res.data;

      if (data.status === "ok") {
        alert("Login successful!");
        // Store both email and fullname in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({ email: data.user.email, fullname: data.user.fullname,_id: data.user._id})
        );
        navigate("/Adminhome");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-containerr">
        <div className="login-form-section">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1>Log in</h1>
            <input
              type="text"
              placeholder="Enter Email"
              value={user.email}
              onChange={handleInputChange}
              name="email"
              required
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInputChange}
              name="password"
              required
            /><br />
            <a href="#" className="forgot-password">Forgot your password?</a>
            <button type="submit">Log In</button>
          </form>
        </div>
        <div className="welcome-section">
          <h1>WELCOME !</h1>
          <p>Log in to continue</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;