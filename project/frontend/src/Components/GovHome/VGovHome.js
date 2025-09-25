import React from 'react';
import './GovHome.css';
import Nav from '../Nav/Nav';

                                                     

const VGovHome = () => {
  
  const cardData = [
    {
      title: "Government Notice Board",
      icon: "📋",
      description: "View latest government notices and announcements",
      path: "/Vnotices"
    },
    {
      title: "Forms & Applications",
      icon: "📄",
      description: "Access and submit government forms online",
      path: "/Vforms"
    },
    {
      title: "Emergency Alerts",
      icon: "🚨",
      description: "Stay updated with emergency notifications",
      path: "/Valerts"
    },
    {
      title: "Agriculture Resources",
      icon: "🌱",
      description: "Access farming guides and resources",
      path: "/Vresources"
    }
  ];

  return (
    
    


    <div className="home-container">
      <Nav />
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Government Information Management Portal</h1>
          <p className="hero-subtitle">
            Your gateway to government agricultural services and information
          </p>
        </div>
      </div>

      <div className="main-content">
        <div className="cards-grid">
          {cardData.map((card, index) => (
            <div key={index} className="info-card" onClick={() => window.location.href = card.path}>
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-number">1,250+</div>
          <div className="stat-label">Active Farmers</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Forms Processed</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">95%</div>
          <div className="stat-label">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  );
};

export default VGovHome;