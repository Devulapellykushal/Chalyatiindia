import React from 'react';
import CarCard from '../components/CarCard';
import Hero from '../components/Hero';
import { useCars } from '../state/CarsContext';

const Home = () => {
  const { cars } = useCars();
  const featuredCars = cars.filter(car => car.featured).slice(0, 8);

  return (
    <div className="main">
      <div className="container">
        {/* Hero Section */}
        <Hero />

        {/* Featured Cars */}
        <section className="featured-section">
          <h2 className="section-title">Featured Cars</h2>
          <div className="cars-grid">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          {featuredCars.length === 0 && (
            <div className="empty-state">
              <h3>No featured cars available</h3>
              <p>Check back later for our featured vehicles.</p>
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Choose Your Car</h3>
              <p className="step-description">Browse our extensive fleet and select the perfect vehicle for your needs.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Book & Confirm</h3>
              <p className="step-description">Make your reservation and receive instant confirmation for your booking.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Enjoy Your Ride</h3>
              <p className="step-description">Pick up your car and enjoy a comfortable, safe journey with our well-maintained vehicles.</p>
            </div>
          </div>
        </section>

        {/* Special Offers */}
        <section className="offers-section">
          <h2 className="section-title">Special Offers</h2>
          <div className="offers-list">
            <ul>
              <li>Weekly and monthly rental discounts</li>
              <li>Corporate fleet rental packages</li>
              <li>Long-term rental special rates</li>
              <li>Weekend getaway packages</li>
              <li>Student and senior citizen discounts</li>
              <li>Loyalty program benefits</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
