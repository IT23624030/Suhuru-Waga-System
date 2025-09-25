import React, { useState } from "react";
import "./nav.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.jpeg";

function Nav() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/mainhome");
  };

  return (
    <nav className="navbarrr">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <div className="navbar-logo-text">
          <span className="navbar-logo-primary">Suhuru Waga</span>
        </div>
      </div>

      <ul className="navbar-links">
        <li><Link to="/home2" className="activer">Home</Link></li>
        <li><Link to="/contact" className="activer">Contact Us</Link></li>
        <li><Link to="/features" className="activer">Features</Link></li>
        <li><Link to="/UserDetails" className="activer">Profile</Link></li>
      </ul>

      <div className="navbar-right">
        {userData ? (
          <>
            <span className="navbar-username">Hello, {userData.fullname}</span>
            <button className="dashboard-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/Login" className="dashboard-button">LogIn</Link>
        )}
      </div>
    </nav>
  );
}

export default Nav;