import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const FocusCarCard = React.memo(
  ({
    car,
    index,
    hovered,
    setHovered,
  }) => {
    const { id, title, brand, type, transmission, fuel, pricePerDay, seats, mileageKm, images, featured, description } = car;
    const imageUrl = images && images.length > 0 ? images[0] : '/img/placeholder.jpg';
    const navigate = useNavigate();

    const handleViewDetails = (e) => {
      e.preventDefault();
      console.log('Navigating to car:', id, title);
      // Use navigate instead of Link to prevent glitches
      navigate(`/cars/${id}`);
    };

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={`focus-car-card ${hovered !== null && hovered !== index ? 'focus-car-card-blur' : ''}`}
      >
        <img
          src={imageUrl}
          alt={title}
          className="focus-car-image"
          onError={(e) => {
            e.target.src = '/img/placeholder.jpg';
          }}
        />
        
        {/* Overlay with car info */}
        <div className={`focus-car-overlay ${hovered === index ? 'focus-car-overlay-active' : ''}`}>
          {/* Featured badge */}
          {featured && (
            <div className="focus-car-featured-badge">
              Featured
            </div>
          )}
          
          {/* Car title and brand */}
          <div className="focus-car-info">
            <h3 className="focus-car-title">{title}</h3>
            <p className="focus-car-brand">{brand}</p>
          </div>
          
          {/* Car specs */}
          <div className="focus-car-specs">
            <span className="focus-car-spec-chip">{type}</span>
            <span className="focus-car-spec-chip">{transmission}</span>
            <span className="focus-car-spec-chip">{fuel}</span>
            <span className="focus-car-spec-chip">{seats} seats</span>
          </div>
          
          {/* Price and action */}
          <div className="focus-car-actions">
            <div className="focus-car-price">
              <span className="focus-car-price-amount">₹{pricePerDay}</span>
              <span className="focus-car-price-unit">/day</span>
            </div>
            <button 
              onClick={handleViewDetails}
              className="focus-car-button"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }
);

FocusCarCard.displayName = 'FocusCarCard';

export function FocusCarCards({ cars }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="focus-cards-grid">
      {cars.map((car, index) => (
        <FocusCarCard
          key={car.id}
          car={car}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
