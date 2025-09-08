import React from 'react';
import ComparisonTable from "../components/ComparisonTable";
import FAQ from "../components/FAQ";
import FeaturedCarsBlock from "../components/FeaturedCarsBlock";
import Hero from '../components/Hero';
import Testimonials from "../components/Testimonials";
import USPGrid from "../components/USPGrid";


const Home = () => {

  return (
    <div className="main">
      <div className="container">
        {/* Hero Section */}
        <Hero />

        {/* Extra Sections (just added, not replacing anything) */}
        <USPGrid />
        <ComparisonTable />
        <FeaturedCarsBlock />
        <Testimonials />
        <FAQ />

        {/* Special Offers */}
        <section className="offers-section full-viewport">
          <h2 className="section-title">Special Offers</h2>
          <div className="offers-container">
            {/* Top Row - 3 items */}
            <div className="offers-row offers-top">
              {[
                "Weekly and monthly rental discount",
                "Corporate fleet rental and Lease packages",
                "Long-term Lease Offers",
              ].map((offer, idx) => (
                <div key={idx} className="offer-card">
                  <div className="offer-icon">✓</div>
                  <p className="offer-text">{offer}</p>
                </div>
              ))}
            </div>
            
            {/* Bottom Row - 2 items centered */}
            <div className="offers-row offers-bottom">
              {[
                "Weekend Gateway packages",
                "Loyalty Program benefits",
              ].map((offer, idx) => (
                <div key={idx + 3} className="offer-card">
                  <div className="offer-icon">✓</div>
                  <p className="offer-text">{offer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
