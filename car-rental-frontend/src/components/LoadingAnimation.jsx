import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="car">
        {/* Car body */}
        <div className="car-body">
          <div className="car-top"></div>
          <div className="car-bottom"></div>
        </div>
        
        {/* Wheels with fire */}
        <div className="wheel wheel-front">
          <div className="tire"></div>
          <div className="fire fire-1"></div>
          <div className="fire fire-2"></div>
          <div className="fire fire-3"></div>
        </div>
        
        <div className="wheel wheel-back">
          <div className="tire"></div>
          <div className="fire fire-1"></div>
          <div className="fire fire-2"></div>
          <div className="fire fire-3"></div>
        </div>
        
        {/* Car details */}
        <div className="car-lights">
          <div className="light light-left"></div>
          <div className="light light-right"></div>
        </div>
        
        <div className="car-windows">
          <div className="window window-front"></div>
          <div className="window window-back"></div>
        </div>
      </div>
      
      {/* Road */}
      <div className="road">
        <div className="road-line"></div>
        <div className="road-line"></div>
        <div className="road-line"></div>
      </div>
      
      {/* Loading text */}
      <div className="loading-text">
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  );
};

export default LoadingAnimation;
