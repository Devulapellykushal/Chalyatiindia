/**
 * Utility function to handle car image paths
 * @param {string} imagePath - The image path from the car data
 * @returns {string} - The processed image URL
 */
export const getCarImageUrl = (imagePath) => {
  console.log('getCarImageUrl called with:', imagePath);
  
  if (!imagePath) {
    console.log('No image path, returning placeholder');
    return '/img/placeholder.svg';
  }
  
  // If it's already a full URL or data URL, use it as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    console.log('Full URL detected, returning as is:', imagePath);
    return imagePath;
  }
  
  // For uploaded images, construct full URL
  if (imagePath.startsWith('/uploads/')) {
    const fullUrl = `https://chalyatiindia.onrender.com${imagePath}`;
    console.log('Uploaded image detected, returning:', fullUrl);
    return fullUrl;
  }
  
  // For relative paths, try to import from assets
  try {
    // Handle different path formats
    let filename;
    if (imagePath.startsWith('/src/assets/')) {
      filename = imagePath.replace('/src/assets/', '');
    } else if (imagePath.startsWith('src/assets/')) {
      filename = imagePath.replace('src/assets/', '');
    } else if (imagePath.startsWith('/assets/')) {
      filename = imagePath.replace('/assets/', '');
    } else if (imagePath.startsWith('assets/')) {
      filename = imagePath.replace('assets/', '');
    } else {
      // Assume it's already a filename
      filename = imagePath;
    }
    
    const assetUrl = `/assets/${filename}`;
    console.log('Asset image detected, returning:', assetUrl);
    return assetUrl;
  } catch (error) {
    console.warn(`Could not load image: ${imagePath}`, error);
    return '/img/placeholder.svg';
  }
};

/**
 * Process an array of image paths
 * @param {Array} images - Array of image paths
 * @returns {Array} - Array of processed image URLs
 */
export const processCarImages = (images) => {
  if (!images || images.length === 0) {
    return ['/img/placeholder.svg'];
  }
  
  return images.map(getCarImageUrl);
};

/**
 * Process gallery image URL - handles both localhost and production URLs
 * @param {string} imageUrl - The image URL from gallery data
 * @returns {string} - The processed image URL
 */
export const processGalleryImageUrl = (imageUrl) => {
  console.log('processGalleryImageUrl called with:', imageUrl);
  
  if (!imageUrl) {
    console.log('No image URL, returning placeholder');
    return '/img/placeholder.svg';
  }
  
  // If it's already a full URL, check if it's localhost and replace
  if (imageUrl.startsWith('http')) {
    if (imageUrl.includes('localhost:5000')) {
      const correctedUrl = imageUrl.replace('http://localhost:5000', 'https://chalyatiindia.onrender.com');
      console.log('Localhost URL detected, corrected to:', correctedUrl);
      return correctedUrl;
    }
    console.log('Full URL detected, returning as is:', imageUrl);
    return imageUrl;
  }
  
  // For relative paths, construct full URL
  if (imageUrl.startsWith('/uploads/')) {
    const fullUrl = `https://chalyatiindia.onrender.com${imageUrl}`;
    console.log('Relative upload path detected, returning:', fullUrl);
    return fullUrl;
  }
  
  // For other cases, return as is
  console.log('Other path detected, returning as is:', imageUrl);
  return imageUrl;
};