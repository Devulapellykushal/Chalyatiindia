import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCars } from '../state/CarsContext';
import { processCarImages } from '../utils/imageUtils';

const CarDetails = () => {
  const { id } = useParams();
  const { cars } = useCars();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDates: '',
    message: ''
  });

  const car = cars.find(c => c.id === id);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!car) {
    return (
      <div className="main">
        <div className="container">
          <div className="empty-state">
            <h3>Car not found</h3>
            <p>The car you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const { title, brand, type, transmission, fuel, pricePerDay, seats, mileageKm, images, featured, description } = car;
  
  const imageUrls = processCarImages(images);
  // const currentImage = imageUrls[selectedImageIndex] || '/img/placeholder.svg'; // Currently unused

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your enquiry! We will get back to you soon.');
    setShowEnquiryModal(false);
    setEnquiryForm({
      name: '',
      phone: '',
      email: '',
      preferredDates: '',
      message: ''
    });
  };

  const handleInputChange = (e) => {
    setEnquiryForm({
      ...enquiryForm,
      [e.target.name]: e.target.value
    });
  };

  const whatsappMessage = `Hi, I want to enquire about renting this car:

🚗 *${title}*
🏷️ Brand: ${brand}
🔧 Type: ${type}
⚙️ Transmission: ${transmission}
⛽ Fuel: ${fuel}
💺 Seats: ${seats}
📏 Mileage: ${mileageKm.toLocaleString()} km
💰 Price: ₹${pricePerDay}/month

Could you please provide more details about availability and booking process?`;
  const whatsappUrl = `https://wa.me/918099662446?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="main">
      <div className="container">
        <div className="car-details">
          {/* Image Carousel */}
          <div className="car-carousel">
            <div className="carousel-container">
              <div className="carousel-track" style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}>
                {imageUrls.map((image, index) => (
                  <div key={index} className="carousel-slide">
                    <img
                      src={image}
                      alt={`${title} ${index + 1}`}
                      className="carousel-image"
                      onError={(e) => {
                        e.target.src = '/img/placeholder.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows - Show when multiple images */}
              {imageUrls.length > 1 && (
                <>
                  <button 
                    className="carousel-arrow carousel-arrow-left"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === 0 ? imageUrls.length - 1 : prev - 1
                    )}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button 
                    className="carousel-arrow carousel-arrow-right"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === imageUrls.length - 1 ? 0 : prev + 1
                    )}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
              
              {/* Single Image Indicator */}
              {imageUrls.length === 1 && (
                <div className="single-image-indicator">
                  <span>📸 More images coming soon!</span>
                </div>
              )}
            </div>
            
            {/* Carousel Indicators - Show when multiple images */}
            {imageUrls.length > 1 && (
              <div className="carousel-indicators">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-indicator ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Car Information */}
          <div className="car-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h1>{title}</h1>
                {featured && <span className="featured-badge">Featured</span>}
              </div>
              <div className="car-price">₹{pricePerDay}/month</div>
            </div>

            <div className="car-specs-grid">
              <div className="spec-item">
                <span className="spec-label">Brand:</span>
                <span className="spec-value">{brand}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Type:</span>
                <span className="spec-value">{type}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Transmission:</span>
                <span className="spec-value">{transmission}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Fuel:</span>
                <span className="spec-value">{fuel}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Seats:</span>
                <span className="spec-value">{seats}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Mileage:</span>
                <span className="spec-value">{mileageKm.toLocaleString()} km</span>
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Description</h3>
            <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{description}</p>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <button 
              className="btn btn-primary"
              onClick={() => setShowEnquiryModal(true)}
            >
              Enquire / Book
            </button>
            
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
            >
              📱 WhatsApp Enquiry
            </a>
          </div>

          <div className="availability-note">
            * Availability calendar & payments will be enabled in Phase 2.
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="modal-overlay" onClick={() => setShowEnquiryModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Enquire about {title}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEnquiryModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEnquirySubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  name="name"
                  value={enquiryForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  className="form-input"
                  name="phone"
                  value={enquiryForm.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  name="email"
                  value={enquiryForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Preferred Dates</label>
                <input
                  type="text"
                  className="form-input"
                  name="preferredDates"
                  value={enquiryForm.preferredDates}
                  onChange={handleInputChange}
                  placeholder="e.g., Dec 25-30, 2024"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  name="message"
                  value={enquiryForm.message}
                  onChange={handleInputChange}
                  placeholder="Any specific requirements or questions..."
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Submit Enquiry
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEnquiryModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
