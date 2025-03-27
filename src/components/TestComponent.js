import React from 'react';

const TestComponent = ({ onTest }) => {
  return (
    <div style={{ 
      border: '2px solid red', 
      padding: '20px', 
      margin: '20px',
      backgroundColor: '#fff',
      color: '#000'
    }}>
      <h3>Test Component</h3>
      <p>This is a test to check if function props are working</p>
      <button 
        onClick={() => {
          console.log('Button clicked');
          console.log('onTest type:', typeof onTest);
          
          if (typeof onTest === 'function') {
            onTest('Test successful!');
          } else {
            console.error('onTest is not a function');
          }
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Function Prop
      </button>
    </div>
  );
};

export default TestComponent;