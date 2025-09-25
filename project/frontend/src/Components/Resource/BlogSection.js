import React from "react";
import "./BlogSection.css";

function BlogSection() {
  const blogs = [
    { title: "Best Practices for Organic Farming", date: "Aug 20, 2025" },
    { title: "How to Save Water in Agriculture", date: "Aug 15, 2025" },
    { title: "Top Fertilizers for Crops", date: "Aug 10, 2025" }
  ];

  return (
    <section className="blog">
      <h2>Latest from Our Blog</h2>
      <div className="blog-grid">
        {blogs.map((b, i) => (
          <div key={i} className="blog-card">
            <h3>{b.title}</h3>
            <small>{b.date}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BlogSection;