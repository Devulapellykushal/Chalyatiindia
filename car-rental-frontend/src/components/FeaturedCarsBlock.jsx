import React from "react";
import { Link } from "react-router-dom";
import RollingGallery from "./RollingGallery";
import Squares from "./Squares";

const FeaturedCarsBlock = () => {
  // Using local car images from assets
  const carImages = [
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
        
        {/* Gallery Content */}
        <div className="gallery-content-overlay">
          <RollingGallery 
            autoplay={true} 
            pauseOnHover={true} 
            images={carImages}
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/cars" className="btn btn-secondary">View All Cars</Link>
      </div>
    </section>
  );
};

export default FeaturedCarsBlock;
