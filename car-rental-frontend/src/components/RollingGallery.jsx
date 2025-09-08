import { motion, useAnimation, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { debounce } from '../utils/resizeObserverUtils';
import './RollingGallery.css';

const RollingGallery = ({ autoplay = false, pauseOnHover = false, images = [] }) => {
  const [isScreenSizeSm, setIsScreenSizeSm] = useState(window.innerWidth <= 640);

  // Optimized cylinder parameters for perfect spacing with smaller cards
  const cylinderWidth = isScreenSizeSm ? 2000 : 2800; // Reduced for smaller cards
  const faceCount = images.length;
  const faceWidth = isScreenSizeSm ? 200 : 250; // Reduced width for smaller cards
  const dragFactor = 0.02; // Reduced drag sensitivity for smoother control
  const radius = cylinderWidth / (2 * Math.PI);
  const angleStep = 360 / faceCount; // Consistent angle between each card

  const rotation = useMotionValue(0);
  const controls = useAnimation();
  const autoplayRef = useRef();
  const isPaused = useRef(false);

  const handleDrag = (_, info) => {
    if (!isPaused.current) {
      rotation.set(rotation.get() + info.offset.x * dragFactor);
    }
  };

  const handleDragEnd = (_, info) => {
    if (!isPaused.current) {
      controls.start({
        rotateY: rotation.get() + info.velocity.x * dragFactor,
        transition: { type: 'spring', stiffness: 60, damping: 20, mass: 0.1, ease: 'easeOut' }
      });
    }
  };

  const transform = useTransform(rotation, value => {
    return `rotate3d(0, 1, 0, ${value}deg)`;
  });

  // Continuous smooth scrolling with consistent speed
  useEffect(() => {
    if (autoplay && !isPaused.current) {
      const startContinuousScroll = () => {
        autoplayRef.current = setInterval(() => {
          if (!isPaused.current) {
            const currentRotation = rotation.get();
            const newRotation = currentRotation - 0.15; // Consistent, smooth movement
            
            controls.start({
              rotateY: newRotation,
              transition: { duration: 0.05, ease: 'linear' }
            });
            rotation.set(newRotation);
          }
        }, 16); // 60fps smooth animation
      };

      startContinuousScroll();
      return () => clearInterval(autoplayRef.current);
    }
  }, [autoplay, rotation, controls]);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsScreenSizeSm(window.innerWidth <= 640);
    }, 150); // Debounce resize events by 150ms

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      isPaused.current = true;
      clearInterval(autoplayRef.current);
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) {
      isPaused.current = false;
      // Restart continuous scrolling with consistent speed
      const startContinuousScroll = () => {
        autoplayRef.current = setInterval(() => {
          if (!isPaused.current) {
            const currentRotation = rotation.get();
            const newRotation = currentRotation - 0.15; // Same speed as initial scroll
            
            controls.start({
              rotateY: newRotation,
              transition: { duration: 0.05, ease: 'linear' }
            });
            rotation.set(newRotation);
          }
        }, 16);
      };
      startContinuousScroll();
    }
  };

  return (
    <div className="gallery-container">
      <div className="gallery-gradient gallery-gradient-left"></div>
      <div className="gallery-gradient gallery-gradient-right"></div>
      <div className="gallery-content">
        <motion.div
          drag="x"
          className="gallery-track"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: 'preserve-3d'
          }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {images.map((url, i) => (
            <div
              key={i}
              className="gallery-item"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`
              }}
            >
              <img src={url} alt="gallery" className="gallery-img" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;
