import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Redirect to landing page after 2 seconds
          setTimeout(() => {
            navigate('/');
          }, 100);
          return 100;
        }
        return prev + 2; // Increment by 2% every 40ms to complete in 2 seconds
      });
    }, 40);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="loading-page">
      <div className="loading-content">
        <img src={logo} alt="Company Logo" className="loading-logo" />
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
        {/* <p className="loading-text">Loading...</p> */}
      </div>
    </div>
  );
};

export default LoadingPage;
