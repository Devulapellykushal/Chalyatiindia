import React, { useEffect, useRef } from "react";

// Professional SVG Icons
const ZeroDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WhitePlateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
    <path d="M2 14H22" stroke="currentColor" strokeWidth="2"/>
    <circle cx="6" cy="10" r="1" fill="currentColor"/>
    <circle cx="18" cy="10" r="1" fill="currentColor"/>
    <circle cx="6" cy="14" r="1" fill="currentColor"/>
    <circle cx="18" cy="14" r="1" fill="currentColor"/>
  </svg>
);

const ServiceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7 6.3C15.1 5.9 15.1 5.3 14.7 4.9L13.8 4C13.4 3.6 12.8 3.6 12.4 4L10.6 5.8C10.2 6.2 10.2 6.8 10.6 7.2L11.5 8.1C11.9 8.5 12.5 8.5 12.9 8.1L14.7 6.3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12L2 6L4 4L10 10L8 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 14L13 20L15 18L9 12L7 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M18.5 18.5L19.5 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RSAIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22L13.09 15.74L22 15L13.09 14.26L12 8L10.91 14.26L2 15L10.91 15.74L12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const items = [
  {
    title: "Zero Down-Payment",
    desc: "Save heavy one-time commitments on car purchase.",
    icon: <ZeroDownIcon />
  },
  {
    title: "White Number Plate",
    desc: "Delivered with a standard white plate for private use.",
    icon: <WhitePlateIcon />
  },
  {
    title: "Service & Maintenance",
    desc: "Regular wear & tear and scheduled service are on us.",
    icon: <ServiceIcon />
  },
  {
    title: "24×7 RSA",
    desc: "Round-the-clock roadside assistance across India.",
    icon: <RSAIcon />
  },
];

const USPGrid = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all animated elements
    [titleRef.current, descriptionRef.current, ...cardsRef.current].forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setCardRef = (index) => (el) => {
    if (el) cardsRef.current[index] = el;
  };

  return (
    <section className="full-viewport smart-car-section" ref={sectionRef}>
      <div className="container">
        <h2 
          ref={titleRef}
          className="section-title animate-on-scroll"
        >
          Own A Car The Smart Way
        </h2>
        <p 
          ref={descriptionRef}
          className="hero-description animate-on-scroll" 
          style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 3rem" }}
        >
          All-inclusive used car subscription by <strong>Chalyati</strong>.
        </p>

        <div className="smart-features-grid">
          {items.map((item, i) => (
            <div 
              key={i} 
              ref={setCardRef(i)}
              className="smart-feature-card animate-on-scroll"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="smart-feature-icon">
                {item.icon}
              </div>
              <div className="smart-feature-content">
                <h3 className="smart-feature-title">{item.title}</h3>
                <p className="smart-feature-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPGrid;
