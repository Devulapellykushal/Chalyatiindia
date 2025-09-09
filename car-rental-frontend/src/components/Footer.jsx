import React from 'react';
import { Link } from 'react-router-dom';
import navLogo from '../assets/navlogo.png';

const Footer = () => {
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

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src={navLogo} alt="CHALYATI" className="footer-logo-image" />
            </div>
            <p>Lease or Rent! We have cars for every one. Choose from our extensive fleet of well-maintained vehicles for your travel needs.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/cars">Browse Cars</Link>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </a>
            <Link to="/admin">Admin</Link>
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