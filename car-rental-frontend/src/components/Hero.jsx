import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.avif';
import { throttle } from '../utils/resizeObserverUtils';

const Hero = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);

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

  // Parallax effect on scroll with throttling
  const handleScroll = useCallback(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    if (heroRef.current) {
      heroRef.current.style.transform = `translateY(${rate}px)`;
    }
  }, []);

  const throttledHandleScroll = useCallback(() => {
    return throttle(handleScroll, 16); // ~60fps
  }, [handleScroll]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Stop observing once animated to improve performance
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all animated elements
    const elementsToObserve = [titleRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current];
    elementsToObserve.forEach(el => {
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    // Initial animation sequence
    const animateSequence = () => {
      setTimeout(() => titleRef.current?.classList.add('animate-in'), 100);
      setTimeout(() => subtitleRef.current?.classList.add('animate-in'), 300);
      setTimeout(() => descriptionRef.current?.classList.add('animate-in'), 500);
      setTimeout(() => buttonsRef.current?.classList.add('animate-in'), 700);
    };

    animateSequence();

    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [throttledHandleScroll]);

  return (
    <section 
      ref={heroRef}
      className="hero animated-hero" 
      style={{ 
        backgroundImage: `url(${heroImage})`
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content" ref={contentRef}>
          <h1 
            ref={titleRef}
            className="hero-title animate-on-scroll"
          >
            Lease or Rent! We have cars for every one
          </h1>
          <p 
            ref={subtitleRef}
            className="hero-subtitle animate-on-scroll"
          >
            Choose from our extensive fleet of well-maintained vehicles
          </p>
          <p 
            ref={descriptionRef}
            className="hero-description animate-on-scroll"
          >
            From compact hatchbacks to luxury SUVs, we have the perfect car for your journey.
          </p>
          <div 
            ref={buttonsRef}
            className="hero-buttons animate-on-scroll"
          >
            <Link to="/cars" className="btn btn-primary btn-animated">
              <span className="btn-text">Browse Cars </span>
              <span className="btn-icon"> →</span>
            </Link>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-animated"
            >
              <span className="btn-text">📱 Contact on WhatsApp</span>
              <span className="btn-icon"> </span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Floating elements for enhanced animation */}
      <div className="floating-elements">
        <div className="floating-circle floating-circle-1"></div>
        <div className="floating-circle floating-circle-2"></div>
        <div className="floating-circle floating-circle-3"></div>
      </div>
      
      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
        <span className="scroll-text">Scroll to explore</span>
      </div>
    </section>
  );
};

export default Hero;