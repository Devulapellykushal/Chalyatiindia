import React, { useState } from 'react';

const ImageTest = () => {
  const [imageStatus, setImageStatus] = useState({});
  
  const testImages = [
    '/assets/AUDI Q3 IMAGE.jpeg',
    '/assets/KWID IMAGE.jpeg',
    '/assets/SELTOS IMAGE.jpeg',
    '/assets/MERCEDES C220D IMAGE.jpeg',
    '/assets/HONDA CITY IMAGE.jpeg',
    '/img/placeholder.svg'
  ];

  const handleImageLoad = (imageUrl) => {
    console.log(`✅ Image loaded successfully: ${imageUrl}`);
    setImageStatus(prev => ({ ...prev, [imageUrl]: 'loaded' }));
  };

  const handleImageError = (imageUrl) => {
    console.error(`❌ Image failed to load: ${imageUrl}`);
    setImageStatus(prev => ({ ...prev, [imageUrl]: 'error' }));
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <h3>Image Loading Test</h3>
      <p>Testing static asset loading for Vercel deployment:</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '20px' }}>
        {testImages.map((imageUrl, index) => (
          <div key={index} style={{ border: '1px solid #333', padding: '10px', borderRadius: '4px' }}>
            <img
              src={imageUrl}
              alt={`Test ${index + 1}`}
              style={{ 
                width: '100%', 
                height: '120px', 
                objectFit: 'cover',
                borderRadius: '4px'
              }}
              onLoad={() => handleImageLoad(imageUrl)}
              onError={() => handleImageError(imageUrl)}
            />
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <div>URL: {imageUrl}</div>
              <div style={{ 
                color: imageStatus[imageUrl] === 'loaded' ? '#4CAF50' : 
                      imageStatus[imageUrl] === 'error' ? '#F44336' : '#FFC107'
              }}>
                Status: {imageStatus[imageUrl] || 'loading...'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <h4>Debug Info:</h4>
        <p>Current URL: {window.location.href}</p>
        <p>Base URL: {window.location.origin}</p>
        <p>User Agent: {navigator.userAgent}</p>
      </div>
    </div>
  );
};

export default ImageTest;
