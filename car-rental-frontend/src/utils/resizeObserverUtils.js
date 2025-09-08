// Utility to suppress ResizeObserver errors
export const suppressResizeObserverErrors = () => {
  // Suppress ResizeObserver loop completed with undelivered notifications
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ResizeObserver loop completed with undelivered notifications')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
};

// Debounce utility for resize events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
