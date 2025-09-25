import React, { useState } from 'react';
import './Nav.css';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">🌾</span>
          <span className="logo-text">Suhuru Waga</span>
        </div>
        
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <a href="/Adminhome" className="nav-link" onClick={() => setIsOpen(false)}>
            Home
          </a>
          <a href="/notices" className="nav-link" onClick={() => setIsOpen(false)}>
            Notices
          </a>
          <a href="/forms" className="nav-link" onClick={() => setIsOpen(false)}>
            Forms
          </a>
          <a href="/alerts" className="nav-link" onClick={() => setIsOpen(false)}>
            Alerts
          </a>
          <a href="/resourcesR" className="nav-link" onClick={() => setIsOpen(false)}>
            Resources
          </a>
        </div>

        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Nav;