import React from "react";
import "./Nav3.css";
import { FaBars } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import {
  IoSearchOutline,
  IoStorefrontOutline,
  IoDocumentOutline,
  IoPeopleOutline,
  IoCalculatorOutline,
  IoBulbOutline,
  IoLocationOutline
} from "react-icons/io5";

function Nav() {
  const menulist = [
    { path: "/features", name: "How to work", icon: <IoSearchOutline /> },
    { path: "/View", name: "Buy Lands", icon: <IoLocationOutline /> },
    { path: "/land", name: "Sell Lands", icon: <IoLocationOutline /> },
    { path: "/CropAdvisor", name: "Get Work Plan", icon: <IoDocumentOutline /> },
    { path: "/bview", name: "Find Buyers", icon: <IoPeopleOutline /> },
    { path: "/addcrop", name: "Sell Products", icon: <IoPeopleOutline /> },
    { path: "/Resources", name: "Find Resources", icon: <IoStorefrontOutline /> },
    { path: "/Calculator", name: "Earning Calculator", icon: <IoCalculatorOutline /> },
    { path: "/crop-suggest", name: "AI Suggestions", icon: <IoBulbOutline /> },
    { path: "/Vnotices", name: "Government Notice", icon: <IoDocumentOutline /> },
    { path: "/Vforms", name: "Government Forms", icon: <IoDocumentOutline /> },
    { path: "/Valerts", name: "Emergency Alerts", icon: <IoDocumentOutline /> },
    { path: "/Vresources", name: "Agriculture Resources", icon: <IoDocumentOutline /> },
    { path: "/bfinalhome", name: "Buyer Account", icon: <IoPeopleOutline /> },
  ];

  return (
    <div className="Sidebar">
      <div className="top_section">
        <FaBars className="bar" />
        <h1>Features</h1>
      </div>
      <nav className="nav-containerss">
        <ul className="navbar-linksr">
          {menulist.map((el, i) => (
            <NavLink
              to={el.path}
              key={i}
              className={({ isActive }) =>
                `link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">{el.icon}</span>
              <span className="link_text">{el.name}</span>
            </NavLink>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Nav;