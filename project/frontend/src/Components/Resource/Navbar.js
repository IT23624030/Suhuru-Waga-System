import React from 'react';
import './Navbar.css';
import { Link } from "react-router-dom";

// Import your logo image here. 
// The path should be relative to where your Nav.js file is located.
import logo from './logo.jpeg'; 

function Navbar() {
  return (
    <nav className="navbarr">
      <div className="navbar-left">
        {/* Use the imported 'logo' variable in the src attribute */}
        <img src={logo} alt="Logo" className="navbar-logo" /> 
        <div className="navbar-logo-text">
          <span className="navbar-logo-primary">Suhuru Waga</span>
        </div>
      </div>
      
      <ul className="navbar-links">
        <li><Link to="/Home/Home" className="active">Home</Link></li>
        <li><Link to="/about" className="active">About</Link></li>
        <li><Link to="/contact" className="active">Contact Us</Link></li>
        <li><Link to="/Login" className="active">Features</Link></li>
      </ul>
      
      <div className="navbar-right">
        <Link to="/Login" className="dashboard-button">LogIn</Link>
      </div>
    </nav>
  );
}

export default Navbar;