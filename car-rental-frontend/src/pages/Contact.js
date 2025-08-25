import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="main">
      <div className="container">
        <h1>Contact Us</h1>
        
        <div className="contact-container">
          {/* Contact Form */}
          <div className="contact-form">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  name="name"
                  value={formData.name}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-textarea"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3>Office Address</h3>
              <p>123 Car Rental Street<br />
              Business District<br />
              Mumbai, Maharashtra 400001<br />
              India</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3>Contact Information</h3>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Email:</strong> info@carrentpro.com</p>
              <p><strong>WhatsApp:</strong> +91 98765 43210</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3>Business Hours</h3>
              <p><strong>Monday - Friday:</strong> 9:00 AM - 7:00 PM</p>
              <p><strong>Saturday:</strong> 9:00 AM - 6:00 PM</p>
              <p><strong>Sunday:</strong> 10:00 AM - 4:00 PM</p>
            </div>

            <div>
              <h3>Location</h3>
              <div className="map-container">
                <iframe
                  className="map-iframe"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5!2d72.8777!3d19.076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInNDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  title="CarRentPro Office Location"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
