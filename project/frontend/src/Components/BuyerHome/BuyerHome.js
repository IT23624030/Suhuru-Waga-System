import React from "react";
import { Link } from "react-router-dom";
import "./BuyerHome.css"; // Import the CSS file

function BuyerHome() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <ul className="sidebar-links">
          <li><Link to="/bfinalhome" className="dashboard-link">Buyer Home Page</Link></li>
          <li><Link to="/addbuy" className="dashboard-link">+ Add Buyer</Link></li>
          <li><Link to="/bprofiles" className="dashboard-link">Buyer Profile</Link></li>
          <li><Link to="/cropads" className="dashboard-link">Crop Advertisements</Link></li>
          <li><Link to="/addconfirms" className="dashboard-link">+ Add Order</Link></li>
          <li><Link to="/confirmorder" className="dashboard-link">Display Order Details</Link></li>
          <li><Link to="/bpay" className="dashboard-link">Payments</Link></li>
          <li><Link to="/bpaydisplay" className="dashboard-link">Payments Display</Link></li>
        </ul>
      </aside>
      
    </div>
  );
}

export default BuyerHome;