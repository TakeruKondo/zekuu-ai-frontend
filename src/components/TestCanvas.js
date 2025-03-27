// TestCanvas.js
import React from 'react';

const TestCanvas = ({ onImageUpload }) => {
  const testClick = () => {
    console.log('Test click');
    console.log('onImageUpload type:', typeof onImageUpload);
    
    if (typeof onImageUpload === 'function') {
      onImageUpload({ test: 'data' });
    } else {
      console.error('onImageUpload is not a function');
    }
  };
  
  return (
    <div style={{ border: '1px solid red', padding: '20px', margin: '20px' }}>
      <h3>Test Canvas</h3>
      <button onClick={testClick}>Test onImageUpload</button>
    </div>
  );
};

export default TestCanvas;