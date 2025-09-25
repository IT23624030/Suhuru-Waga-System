import React, { useState, useEffect } from "react";
import "./Categories.css";
import { useNavigate } from "react-router-dom";

function Categories() {
  const [categories] = useState(["Equipment", "Supply", "Labor", "Other"]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [resources, setResources] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/resources")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setResources(data))
      .catch((err) => console.error("Error fetching resources:", err));
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleRequestClick = (id) => {
    navigate(`/request/${id}`);
  };

  const filteredResources =
    expandedCategory !== null
      ? resources.filter(
          (r) => r.category.toLowerCase() === expandedCategory.toLowerCase()
        )
      : [];

  return (
    <section className="categories">
      <h2>Resources by Category</h2>

      {/* Category buttons */}
      <div className="category-grid">
        {categories.map((c, i) => (
          <div
            key={i}
            className={`category-card ${
              expandedCategory === c ? "active" : ""
            }`}
            onClick={() => toggleCategory(c)}
          >
            <h3>{c}</h3>
          </div>
        ))}
      </div>

      {/* Smooth expandable wrapper */}
      <div className={`resources-wrapper ${expandedCategory ? "expanded" : ""}`}>
        {expandedCategory && (
          <div className="resources-section">
            <h3>{expandedCategory} Resources</h3>
            <div className="resources-grid">
              {filteredResources.length > 0 ? (
                filteredResources.map((r) => (
                  <div key={r._id} className="resource-card">
                    <img
                      src={r.imageUrl} 
                      alt={`Image of ${r.name}`} 
                      className="resource-card-image"
                    />
                    <h4>{r.name}</h4>
                    <p>
                      <strong>Price:</strong> Rs.{r.pricing?.baseRate}
                    </p>
                    <button
                      className="btn"
                      onClick={() => handleRequestClick(r._id)}
                    >
                      Request
                    </button>
                  </div>
                ))
              ) : (
                <p>No resources available in this category.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;