import React, { useEffect, useRef } from 'react';

const ScrollAnimations = ({ children, className = '', animationType = 'fadeInUp', delay = 0, threshold = 0.1 }) => {
  const elementRef = useRef(null);

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
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [threshold]);

  const getAnimationClass = () => {
    const baseClass = 'animate-on-scroll';
    const animationClass = `animate-${animationType}`;
    return `${baseClass} ${animationClass}`;
  };

  return (
    <div 
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimations;
