import React, { useState } from 'react';
import '../styles/ImageCanvas.css';

const ImageCanvas = ({ 
  title, 
  image, 
  processedImage, 
  onImageUpload, 
  isLoading, 
  isOutput = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file || isOutput) return;
    
    // Create a preview
    const preview = URL.createObjectURL(file);
    
    // Create a FormData object
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // TODO: Replace with actual API call to upload image
      // Mock implementation
      setTimeout(() => {
        onImageUpload({
          file,
          preview,
          filename: file.name,
          filepath: preview
        });
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  // Translated titles
  const translatedTitle = isOutput ? '生成された画像' : '入力画像';
  const displayTitle = title || translatedTitle;
  
  return (
    <div className="image-canvas-container">
      <h3 className="canvas-title">{displayTitle}</h3>
      
      <div 
        className={`image-canvas ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
        onDragEnter={!isOutput ? handleDragEnter : null}
        onDragLeave={!isOutput ? handleDragLeave : null}
        onDragOver={!isOutput ? handleDragOver : null}
        onDrop={!isOutput ? handleDrop : null}
        onClick={() => {
          if (!isOutput && !isLoading && !image) {
            document.getElementById('file-upload').click();
          }
        }}
      >
        {isLoading ? (
          <div className="canvas-loading">
            <div className="spinner"></div>
            <p>処理中...</p>
          </div>
        ) : image ? (
          <img 
            src={image} 
            alt={isOutput ? "生成された画像" : "入力画像"} 
            className="canvas-image"
          />
        ) : (
          <div className="canvas-placeholder">
            {!isOutput ? (
              <>
                <div className="upload-icon">📁</div>
                <p>ここに画像をドラッグ＆ドロップするか、クリックして参照</p>
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
        {!isOutput && processedImage && (
          <div className="processed-overlay">
            <img 
              src={processedImage} 
              alt="処理された画像" 
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
          id="file-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />
      )}
      
      {isOutput && image && (
        <div className="image-actions">
          <button className="action-button">
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