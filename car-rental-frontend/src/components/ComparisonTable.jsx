import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ComparisonTable = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all animated elements
    [titleRef.current, descriptionRef.current, tableRef.current].forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleBrowseCars = () => {
    navigate('/cars');
  };

  const features = [
    "Zero Down Payment & Road Tax",
    "No Financing Process",
    "Cheaper than EMI",
    "Annual Insurance Included",
    "Free Car Service & Maintenance",
    "Free 24x7 All India Road Side Assistance",
    "End to End Warranty",
    "Doorstep Pick & Drop for Service & Maintenance",
    "Hassle Free Insurance Claims",
    "Stress Free Car Maintenance",
    "Wide Range of PPP Certified Cars to Choose",
    "Flexible Tenure & Easy Extension Process",
    "No Dealer Visit at Time of Purchase/Sale"
  ];

  return (
    <section className="full-viewport comparison-section" ref={sectionRef}>
      <div className="container">
        <h2 
          ref={titleRef}
          className="section-title animate-on-scroll"
        >
          Save money with<br />
          <span className="highlight-text">Chalyati Subscription</span>
        </h2>
        <p 
          ref={descriptionRef}
          className="hero-description animate-on-scroll" 
          style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 3rem" }}
        >
          Subscribing to a car is not just flexible and convenient, it might also save your money as compared to buying a car on loan.
        </p>

        <div className="comparison-table-container" ref={tableRef}>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-column">Features</div>
              <div className="subscription-column">Chalyati Subscription</div>
              <div className="buy-column">Buy</div>
            </div>
            
            <div className="comparison-body">
              {features.map((feature, index) => (
                <div key={index} className="comparison-row">
                  <div className="feature-cell">{feature}</div>
                  <div className="subscription-cell">
                    <div className="check-icon">✓</div>
                  </div>
                  <div className="buy-cell">
                    <div className="cross-icon">✗</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="comparison-cta">
            <button className="browse-cars-btn" onClick={handleBrowseCars}>
              Browse Cars →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
