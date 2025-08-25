import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section 
      className="hero" 
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Premium Car Rental in India</h1>
          <p className="hero-subtitle">Choose from our extensive fleet of well-maintained vehicles</p>
          <p className="hero-description">From compact hatchbacks to luxury SUVs, we have the perfect car for your journey.</p>
          <div className="hero-buttons">
            <Link to="/cars" className="btn btn-primary">Browse Cars</Link>
            <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
