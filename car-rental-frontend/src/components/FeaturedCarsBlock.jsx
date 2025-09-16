import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../services/api";
import RollingGallery from "./RollingGallery";
import Squares from "./Squares";

const FeaturedCarsBlock = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fallback images if API fails
  const fallbackImages = [
    '/assets/AUDI Q3 IMAGE.jpeg',
    '/assets/KWID IMAGE.jpeg',
    '/assets/SELTOS IMAGE.jpeg',
    '/assets/MERCEDES C220D IMAGE.jpeg',
    '/assets/HONDA CITY IMAGE.jpeg',
    '/assets/BALENO IMAGE.jpeg',
    '/assets/BREZZA IMAGE.jpeg',
    '/assets/NEXON IMAGE.jpeg',
    '/assets/I20 IMAGE.jpeg',
    '/assets/ALTROZ IMAGE.jpeg'
  ];

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        // Add cache-busting parameter to ensure fresh data
        const response = await apiService.getGalleryImages('featured');
        if (response.success && response.data.length > 0) {
          // Use uploaded gallery images (even if fewer than 6)
          // The RollingGallery component will handle duplication for smooth rolling
          const imageUrls = response.data.map(img => img.imageUrl);
          setGalleryImages(imageUrls);
        } else {
          // Use fallback images only if no gallery images are uploaded
          setGalleryImages(fallbackImages);
        }
      } catch (error) {
        console.error('Failed to load gallery images:', error);
        setError('Failed to load gallery images');
        // Fallback to local images
        setGalleryImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryImages();
    
    // Refresh gallery images every 30 seconds to catch new uploads
    const refreshInterval = setInterval(loadGalleryImages, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Add error handling for images
  const handleImageError = (e, imageUrl) => {
    console.warn(`Failed to load image: ${imageUrl}`);
    e.target.src = '/img/placeholder.svg';
    e.target.onerror = null; // Prevent infinite loop
  };

  return (
    <section className="full-viewport featured-cars-section">
      <div className="gallery-container-with-bg" style={{ position: "relative" }}>
        {/* Squares Background - Only behind the gallery */}
        <div className="squares-background-gallery">
          <Squares 
            speed={0.5} 
            squareSize={40}
            direction='diagonal'
            borderColor='rgba(255, 255, 255, 0.3)'
            hoverFillColor='rgba(255, 255, 255, 0.1)'
          />
        </div>
        
        {/* Gallery Content */}
        <div className="gallery-content-overlay">
          {loading ? (
            <div className="gallery-loading">
              <div className="spinner"></div>
              <p>Loading gallery...</p>
            </div>
          ) : (
            <RollingGallery 
              autoplay={true} 
              pauseOnHover={true} 
              images={galleryImages}
              onImageError={handleImageError}
            />
          )}
          {error && (
            <div className="gallery-error">
              <p>Using fallback images</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/cars" className="btn btn-secondary">View All Cars</Link>
      </div>
    </section>
  );
};

export default FeaturedCarsBlock;
