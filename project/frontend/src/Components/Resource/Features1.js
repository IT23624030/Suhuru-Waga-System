import React from "react";
import "./Features1.css";

function Features1() {
  const features = [
    { title: "Verified Resources", desc: "All listings are verified for quality." },
    { title: "Community Driven", desc: "Connect with local farmers & suppliers." },
    { title: "Secure Payments", desc: "Safe and reliable transactions." },
    { title: "Wide Network", desc: "Reach across multiple regions." }
  ];

  return (
    <section className="features">
      {features.map((f, i) => (
        <div key={i} className="feature-box">
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </section>
  );
}

export default Features1;