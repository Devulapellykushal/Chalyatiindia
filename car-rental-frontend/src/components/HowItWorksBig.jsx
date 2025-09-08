import React from "react";

const steps = [
  {
    n: "1",
    title: "Find the right car",
    desc: "Choose from Chalyati Assured cars with 300+ checks.",
  },
  {
    n: "2",
    title: "Get online approval",
    desc: "Submit documents and get quick eligibility approval.",
  },
  {
    n: "3",
    title: "Drive worry-free",
    desc: "Just drive like it’s yours—insurance & service included.",
  },
];

const HowItWorksBig = () => (
  <section className="full-viewport">
    <h2 className="section-title">How Chalyati Works</h2>
    <div className="steps-grid">
      {steps.map((s, i) => (
        <div key={i} className="step-card">
          <div className="step-number">{s.n}</div>
          <h3 className="step-title">{s.title}</h3>
          <p className="step-description">{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorksBig;
