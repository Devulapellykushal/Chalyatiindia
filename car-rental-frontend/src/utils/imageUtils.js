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
    const fullUrl = `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
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