import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCars } from "../state/CarsContext";
import { FocusCarCards } from "./FocusCarCards";
import RollingGallery from "./RollingGallery";
import Squares from "./Squares";
import { getCarImageUrl } from "../utils/imageUtils";

const FeaturedCarsBlock = () => {
  const { getFeaturedCars, loading, error, cars } = useCars();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [carImages, setCarImages] = useState([]);

  useEffect(() => {
    const featuredCarsList = getFeaturedCars();
    const limitedCars = featuredCarsList.slice(0, 6); // Limit to 6 cars
    setFeaturedCars(limitedCars);
    
    // Extract images for rolling gallery
    const images = limitedCars.map(car => {
      const imageUrl = getCarImageUrl(car.images && car.images.length > 0 ? car.images[0] : null);
      return imageUrl;
    });
    setCarImages(images);
  }, [cars, getFeaturedCars]);

  return (
    <section className="full-viewport featured-cars-section">
      <div className="results-header" style={{ background: "transparent", borderBottom: "none", padding: 0 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Cars</h2>
      </div>

      <div className="gallery-container-with-bg" style={{ marginTop: "2rem", position: "relative" }}>
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
        
        {/* Featured Cars Content */}
        <div className="gallery-content-overlay">
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '300px',
              color: 'white',
              fontSize: '18px'
            }}>
              Loading featured cars...
            </div>
          ) : error ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '300px',
              color: 'white',
              fontSize: '18px',
              textAlign: 'center'
            }}>
              Error loading featured cars: {error}
            </div>
          ) : (
            <>
              {/* Rolling Gallery with real car images */}
              <RollingGallery 
                autoplay={true} 
                pauseOnHover={true} 
                images={carImages}
              />
              
              {/* Detailed Car Cards below the gallery */}
              <div style={{ marginTop: '3rem' }}>
                <FocusCarCards cars={featuredCars} />
              </div>
            </>
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
