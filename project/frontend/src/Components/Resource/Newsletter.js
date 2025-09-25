import React from "react";
import "./Newsletter.css";

function Newsletter() {
  return (
    <section className="newsletter">
      <h2>Subscribe for Updates</h2>
      <p>Get the latest resources and agriculture news in your inbox.</p>
      <div className="newsletter-input">
        <input type="email" placeholder="Enter your email" />
        <button className="btn">Subscribe</button>
      </div>
    </section>
  );
}

export default Newsletter;