import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navLogo from '../assets/navlogo.png';

const Footer = () => {
  const location = useLocation();
  const [logoClickCount, setLogoClickCount] = useState(0);
  const resetTimeoutRef = useRef(null);
  
  const whatsappMessage = `Hi! I'm interested in learning more about CHALYATI car rental services.

Could you please provide more details about:
• Available car categories and models
• Daily rental rates and packages
• Booking process and requirements
• Pickup and delivery options
• Service areas across India

I'm looking for a reliable car rental service and would like to understand your offerings better.

Thank you!`;

  const whatsappUrl = `https://wa.me/918099662446?text=${encodeURIComponent(whatsappMessage)}`;

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If already on home page, scroll to hero section
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        heroElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // If on different page, navigate to home and then scroll to hero
      window.location.href = '/';
    }
  };

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    
    // Clear existing timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    
    if (newCount >= 5) {
      // Reset counter and redirect to admin portal
      setLogoClickCount(0);
      window.location.href = '/admin';
    } else {
      // Show a subtle visual feedback
      const logo = document.querySelector('.footer-logo-image');
      if (logo) {
        logo.style.transform = 'scale(0.9)';
        setTimeout(() => {
          logo.style.transform = 'scale(1)';
        }, 150);
      }
      
      // Set timeout to reset counter after 10 seconds of inactivity
      resetTimeoutRef.current = setTimeout(() => {
        setLogoClickCount(0);
      }, 10000);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src={navLogo} 
                alt="CHALYATI" 
                className="footer-logo-image" 
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
                title={`Click ${5 - logoClickCount} more times to access admin portal`}
              />
              {logoClickCount > 0 && logoClickCount < 5 && (
                <div className="click-progress">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span 
                      key={i} 
                      className={`progress-dot ${i < logoClickCount ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <p>Lease or Rent! We have cars for every one. Choose from our extensive fleet of well-maintained vehicles for your travel needs.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="/" onClick={handleHomeClick}>Home</a>
            <Link to="/cars">Browse Cars</Link>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </a>
          </div>
          
          <div className="footer-section">
            <h3>Legal</h3>
            <Link to="/legal/terms">Terms of Service</Link>
            <Link to="/legal/privacy">Privacy Policy</Link>
            <Link to="/legal/refund">Refund Policy</Link>
          </div>
        </div>
        
                  <div className="footer-bottom">
            <p>&copy; 2024 CHALYATI. All rights reserved.</p>
            <p>Created with <span style={{color: '#8B5CF6'}}>❤️</span> by <a href="https://www.linkedin.com/in/thanvithakariveda" target="_blank" rel="noopener noreferrer" className="footer-link" style={{color: '#8B5CF6'}}>dev</a></p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;