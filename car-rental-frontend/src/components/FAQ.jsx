import React, { useState } from "react";

// Professional SVG Icons
const CarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 11L6.5 6.5H17.5L19 11M5 11H3V13H5V11ZM19 11H21V13H19V11ZM5 11V16H19V11M7.5 14.5C7.5 15.3284 6.82843 16 6 16C5.17157 16 4.5 15.3284 4.5 14.5C4.5 13.6716 5.17157 13 6 13C6.82843 13 7.5 13.6716 7.5 14.5ZM19.5 14.5C19.5 15.3284 18.8284 16 18 16C17.1716 16 16.5 15.3284 16.5 14.5C16.5 13.6716 17.1716 13 18 13C18.8284 13 19.5 13.6716 19.5 14.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22S8 18 8 12V5L12 3L16 5V12C16 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WrenchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7 6.3C15.1 5.9 15.1 5.3 14.7 4.9L13.8 4C13.4 3.6 12.8 3.6 12.4 4L10.6 5.8C10.2 6.2 10.2 6.8 10.6 7.2L11.5 8.1C11.9 8.5 12.5 8.5 12.9 8.1L14.7 6.3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12L2 6L4 4L10 10L8 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 14L13 20L15 18L9 12L7 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="1 20 1 14 7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const faqs = [
  {
    question: "What is chalyati car subscription?",
    answer: "You can lease any type of car from Chalyati at competitive pricing with out any hassle of annual maintenance.",
    icon: <CarIcon />
  },
  {
    question: "How long can i subscribe to a car?",
    answer: "you can take a car on lease starts from 06 Months to 60 Months.",
    icon: <ClockIcon />
  },
  {
    question: "What documents do i needed?",
    answer: "You can submit your KYC documents and reach our team for further information.",
    icon: <DocumentIcon />
  },
  {
    question: "Is Insurance Included?",
    answer: "Yes. Insurance is included.",
    icon: <ShieldIcon />
  },
  {
    question: "What about Maintenance and service?",
    answer: "Maintenance and Service is included in the package.",
    icon: <WrenchIcon />
  },
  {
    question: "Can i change cars during subsciption?",
    answer: "Yes.",
    icon: <RefreshIcon />
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-background">
        <div className="faq-particles"></div>
      </div>
      
      <div className="faq-content">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-underline"></div>
          <p className="faq-subtitle">
            Get answers to common questions about Chalyati car subscriptions
          </p>
        </div>
        
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-card ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-card-header">
                <div className="faq-icon">{faq.icon}</div>
                <h3 className="faq-question">{faq.question}</h3>
                <div className={`faq-toggle ${openIndex === index ? 'active' : ''}`}>
                  <span className="faq-plus">+</span>
                  <span className="faq-minus">−</span>
                </div>
              </div>
              
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <div className="faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="faq-cta">
          <div className="faq-cta-card">
            <div className="faq-cta-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 8H13.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 12H17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 8H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Need Further Assistance?</h3>
            <p>Our dedicated support team is available to address any additional questions or concerns you may have.</p>
            <a href="https://wa.me/918099662446" target="_blank" rel="noopener noreferrer" className="faq-cta-button">
              <span>Contact Support</span>
              <div className="faq-cta-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
