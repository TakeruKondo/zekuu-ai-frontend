import React from 'react';

const ResultGallery = ({ images }) => {
  // Handle image download
  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'controlnet-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Generated Results</h2>
      <hr style={{ marginBottom: '20px' }} />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {images.map((image, index) => (
          <div 
            key={index}
            style={{ 
              border: '1px solid #ccc',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ 
              paddingBottom: '100%', 
              position: 'relative',
              backgroundColor: 'black'
            }}>
              <img
                src={image.url}
                alt={`Generated image ${index + 1}`}
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div style={{ padding: '16px' }}>
              <p style={{ 
                margin: '0 0 10px 0',
                color: '#555',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {image.prompt}
              </p>
              
              {image.preprocessor && (
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  borderRadius: '16px',
                  padding: '2px 10px',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}>
                  {image.preprocessor}
                </div>
              )}
              
              <div>
                <button 
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #2196f3',
                    color: '#2196f3',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onClick={() => handleDownload(image.url, image.filename)}
                >
                  <span>⬇️</span> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultGallery;