import React from "react";
import "./FeaturedResources.css";

function FeaturedResources() {
  const resources = [
    { name: "Organic Seeds", price: "rs.10" },
    { name: "Tractor Rental", price: "rs.200/day" },
    { name: "Fertilizer Pack", price: "rs.30" },
    { name: "Greenhouse Setup", price: "rs.500" }
  ];

  return (
    <section className="featured">
      <h2>Featured Resources</h2>
      <div className="resource-grid">
        {resources.map((r, i) => (
          <div key={i} className="resource-card">
            <h3>{r.name}</h3>
            <p>{r.price}</p>
            <button className="btn">Request</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedResources;