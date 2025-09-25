import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  useEffect(() => {
    // Add class when Hero mounts
    document.body.classList.add("agri-hero-page");

    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove("agri-hero-page");
    };
  }, []);

  return (
    <section className="agri-hero-section">
      <h1 className="agri-hero-title">Share Agricultural Resources Easily</h1>
      <p className="agri-hero-subtitle">
        Connect with farmers, suppliers, and buyers in one platform.
      </p>
      <Link to="/login" className="agri-hero-cta-btn">Get Started</Link>
    </section>
  );
}

export default Hero;
