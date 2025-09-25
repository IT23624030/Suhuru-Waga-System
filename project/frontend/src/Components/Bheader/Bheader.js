import React from 'react';
import './Bheader.css';
import { Link } from "react-router-dom";

// Import your logo image here. 
// The path should be relative to where your Nav.js file is located.
import logo from './lgo.png'; 

function Bheader() {
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
        <li><Link to="/bfinalhome" className="active">Home</Link></li>
        <li><Link to="/addbuy" className="active">Register</Link></li>
        
        <li><Link to="/cropads" className="active">Advertisments</Link></li>
           <li><Link to="/confirmorder" className="active">Orders</Link></li>
 <li><Link to="/bpaydisplay" className="active">Payments</Link></li>
         
            <li><Link to="/addcrop" className="active">AddCrop</Link></li>
           <li><Link to="/features" className="active">feature</Link></li>
           <li><Link to="/UserDetails" className="active">Profile</Link></li>
      </ul>
      
      <div className="navbar-right">
        <p>Hi,Chalakshana Jayasinghe</p>
        <Link to="/mainhome" className="dashboard-button">LogOut</Link>
      </div>
    </nav>
  );
}

export default Bheader;