import React, { useEffect } from 'react';
import './About.css';
import Nav from "../Home/Nav/Nav";

function About() {
     useEffect(() => {
    const sections = document.querySelectorAll('.reveal-section');

    if (sections.length === 0) {
      // No sections to observe, do nothing
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // Optional: entry.target.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.3, // Percentage of the target element which is visible
      rootMargin: "0px 0px -50px 0px" // Start animating a bit before it hits bottom
    });

    sections.forEach(section => {
      observer.observe(section);
    });

    // Cleanup function: stop observing elements when the component unmounts
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
      observer.disconnect(); // Disconnect the observer entirely
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return (
    <div className="about-page-wrapper">
      <Nav /> {/* Your navigation component */}

      <section className="hero-about reveal-section">
        <div className="hero-content">
          <h1>Our Story: Growing with Nature</h1>
          <p className="subtitle">Cultivating a sustainable future, one seed at a time.</p>
        </div>
      </section>

      <section className="about-section introduction reveal-section">
        <div className="container">
          <div className="content-block">
            <h2 className="section-title">Rooted in Tradition, Growing for Tomorrow</h2>
            <p>
              Suhuru Waga began with a simple vision: to connect people with the wholesome goodness of nature's bounty.
              What started as a small family farm several generations ago has blossomed into a thriving agricultural hub,
              dedicated to sustainable practices and innovative farming techniques. We believe in respecting the land,
              nurturing our crops with care, and delivering fresh, high-quality produce to your table.
            </p>
          </div>
          <div className="image-block">
            <img src="/home.jpg" alt="Heritage farm landscape" />
          </div>
        </div>
      </section>

      <section className="about-section mission-values reveal-section">
        <div className="container reverse-on-mobile">
          <div className="image-block">
            <img src="/home.jpg" alt="Green sustainable field" />
          </div>
          <div className="content-block">
            <h2 className="section-title">Our Mission & Values</h2>
            <p>
              Our mission is to lead the way in sustainable agriculture, providing nourishing food while preserving our planet's resources.
              We are committed to:
            </p>
            <ul>
              <li><strong>Sustainability:</strong> Practicing methods that protect soil health, water, and biodiversity.</li>
              <li><strong>Quality:</strong> Ensuring every product meets the highest standards of freshness and taste.</li>
              <li><strong>Community:</strong> Fostering strong relationships with our local community and partners.</li>
              <li><strong>Innovation:</strong> Continuously seeking new ways to improve farming efficiency and ecological impact.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section team-section reveal-section">
        <div className="container">
          <h2 className="section-title">Meet Our Cultivators</h2>
          <p className="team-intro">The heart of Suhuru Waga lies in the hands and minds of our dedicated team.</p>
          <div className="team-grid">
            <div className="team-member">
              <img src="/home.jpg" alt="Portrait of team member 1" />
              <h3>John Doe</h3>
              <p>Founder & Head Farmer</p>
            </div>
            <div className="team-member">
              <img src="/home.jpg" alt="Portrait of team member 2" />
              <h3>Jane Smith</h3>
              <p>Operations Manager</p>
            </div>
            <div className="team-member">
        <img src="/home.jpg" alt="..." />              <h3>Alex Green</h3>
              <p>Agricultural Scientist</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section call-to-action reveal-section">
        <div className="container">
          <h2 className="section-title">Join Our Journey</h2>
          <p>
            Explore our fields, discover our products, or simply learn more about sustainable agriculture.
            We invite you to be a part of the Suhuru Waga family.
          </p>
          <a href="/contact" className="cta-button">Contact Us</a> {/* Link to your contact page */}
        </div>
      </section>
    </div>
  );
}

export default About;