import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CarRentPro</h3>
            <p>Premium car rental service in India. Choose from our extensive fleet of well-maintained vehicles for your travel needs.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/cars">Browse Cars</Link>
            <Link to="/contact">Contact Us</Link>
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
          <p>&copy; 2024 CarRentPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
