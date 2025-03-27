import React, { useState, useEffect } from 'react';
import '../styles/ImageCanvas.css';
import { uploadImage } from '../services/api';

const ImageCanvas = ({ 
  title, 
  image, 
  processedImage, 
  onImageUpload, 
  isLoading, 
  isOutput = false 
}) => {
  // Add console logs on component mount to check props
  useEffect(() => {
    console.log(`ImageCanvas "${title}" mounted with props:`, { 
      hasImage: !!image, 
      hasProcessedImage: !!processedImage,
      onImageUploadType: typeof onImageUpload,
      isLoading,
      isOutput
    });
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Handle drag events if it's an input canvas
  const handleDragEnter = (e) => {
    if (isOutput) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (isOutput) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    if (isOutput) return;
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    if (isOutput) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log('File dropped:', e.dataTransfer.files[0].name);
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection with actual API call
  const handleFileSelect = async (file) => {
    console.log('handleFileSelect called with file:', file?.name);
    console.log('isOutput:', isOutput);
    console.log('onImageUpload type:', typeof onImageUpload);
    
    if (!file || isOutput) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      console.error('Please select an image file');
      return;
    }
    
    // Create a local preview
    const preview = URL.createObjectURL(file);
    console.log('Preview URL created:', preview);
    
    try {
      setIsUploading(true);
      
      // Create a FormData object
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('Before API call');
      
      // Here we'll try a different approach for debugging
      if (typeof onImageUpload !== 'function') {
        console.error('onImageUpload is not a function - fixing with a mock upload');
        
        // Mock successful upload instead of real API call
        setTimeout(() => {
          console.log('Mock upload completed');
          setIsUploading(false);
          
          // Instead of calling onImageUpload, just alert
          alert('Upload would be complete here, but onImageUpload is not a function');
        }, 1000);
        
        return;
      }
      
      // If we get here, onImageUpload is a function
      console.log('Proceeding with real upload');
      
      // Make the actual API call
      const response = await uploadImage(formData);
      console.log('API response:', response);
      
      // Call the onImageUpload function with the response data
      onImageUpload({
        file,
        preview,
        filename: response.filename,
        filepath: response.filepath
      });
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="image-canvas-container">
      <h3 className="canvas-title">{title}</h3>
      
      <div 
        className={`image-canvas ${isDragging ? 'dragging' : ''} ${isLoading || isUploading ? 'loading' : ''}`}
        onDragEnter={!isOutput ? handleDragEnter : null}
        onDragLeave={!isOutput ? handleDragLeave : null}
        onDragOver={!isOutput ? handleDragOver : null}
        onDrop={!isOutput ? handleDrop : null}
        onClick={() => {
          if (!isOutput && !isLoading && !isUploading && !image) {
            console.log('Canvas clicked - opening file dialog');
            document.getElementById('file-upload-' + (title || 'input').replace(/\s+/g, '-').toLowerCase()).click();
          }
        }}
      >
        {(isLoading || isUploading) ? (
          <div className="canvas-loading">
            <div className="spinner"></div>
            <p>{isUploading ? "アップロード中..." : "処理中..."}</p>
          </div>
        ) : image ? (
          <img 
            src={image} 
            alt={isOutput ? "Generated image" : "Input image"} 
            className="canvas-image"
          />
        ) : (
          <div className="canvas-placeholder">
            {!isOutput ? (
              <>
                <div className="upload-icon">📁</div>
                <p>画像をドラッグ＆ドロップまたはクリックして選択</p>
              </>
            ) : (
              <>
                <div className="output-icon">🖼️</div>
                <p>生成された画像がここに表示されます</p>
              </>
            )}
          </div>
        )}
        
        {/* Input overlay to show the processed version */}
        {!isOutput && processedImage && image && (
          <div className="processed-overlay">
            <img 
              src={processedImage} 
              alt="Processed image" 
              className="processed-image"
            />
            <div className="overlay-controls">
              <button className="toggle-view-btn">
                元の画像/処理済み画像を切り替え
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!isOutput && (
        <input
          id={`file-upload-${(title || 'input').replace(/\s+/g, '-').toLowerCase()}`}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            console.log('File input change:', e.target.files?.[0]?.name);
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          disabled={isLoading || isUploading}
        />
      )}
      
      {isOutput && image && (
        <div className="image-actions">
          <button 
            className="action-button"
            onClick={() => {
              // Download functionality
              const link = document.createElement('a');
              link.href = image;
              link.download = 'generated-image.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <span className="action-icon">⬇️</span>
            <span className="action-text">ダウンロード</span>
          </button>
          <button className="action-button">
            <span className="action-icon">🔄</span>
            <span className="action-text">再生成</span>
          </button>
          <button className="action-button">
            <span className="action-icon">✏️</span>
            <span className="action-text">編集</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;