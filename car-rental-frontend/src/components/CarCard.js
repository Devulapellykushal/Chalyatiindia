import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  const { id, title, brand, type, transmission, fuel, pricePerDay, seats, mileageKm, images, featured, description } = car;
  
  const imageUrl = images && images.length > 0 ? images[0] : '/img/placeholder.jpg';

  return (
    <div className="car-card">
      <img 
        src={imageUrl} 
        alt={title} 
        className="car-image"
        onError={(e) => {
          e.target.src = '/img/placeholder.jpg';
        }}
      />
      
      <div className="car-content">
        <div className="car-header">
          <div>
            <h3 className="car-title">{title}</h3>
            {featured && <span className="featured-badge">Featured</span>}
          </div>
          <div className="car-price">₹{pricePerDay}/day</div>
        </div>
        
        <div className="car-specs">
          <span className="spec-chip">{brand}</span>
          <span className="spec-chip">{type}</span>
          <span className="spec-chip">{transmission}</span>
          <span className="spec-chip">{fuel}</span>
          <span className="spec-chip">{seats} seats</span>
          <span className="spec-chip">{mileageKm.toLocaleString()} km</span>
        </div>
        
        <p className="car-description">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        
        <Link to={`/cars/${id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
