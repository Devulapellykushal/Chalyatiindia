import React from "react";

const stories = [
  { title: "Chalyati raises fresh equity to expand subscriptions", cta: "Read More..." },
  { title: "Chalyati bets big on flexible mobility", cta: "Read More..." },
  { title: "Auto startup Chalyati on a national expansion drive", cta: "Read More..." },
  { title: "Used-car subscription—Chalyati leads the way", cta: "Read More..." },
];

const MediaCoverage = () => (
  <section className="full-viewport">
    <h2 className="section-title">Media Coverage</h2>
    <p className="hero-description" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      Unveiling a world beyond headlines: our latest news & features.
    </p>
    <div className="cars-grid">
      {stories.map((s, i) => (
        <div key={i} className="car-item">
          <h3 className="car-title" style={{ marginBottom: "0.5rem" }}>{s.title}</h3>
          <p className="car-description">—</p>
          <button className="focus-car-button"> {s.cta} </button>
        </div>
      ))}
    </div>
  </section>
);

export default MediaCoverage;
