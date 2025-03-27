import React, { useState } from 'react';
import { uploadImage } from '../services/api';

const ImageUploader = ({ onImageUpload, onError, disabled }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection via input
  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        onError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Display preview
      setPreview(URL.createObjectURL(file));
      
      try {
        setUploading(true);
        
        // Upload to server
        const formData = new FormData();
        formData.append('image', file);
        const response = await uploadImage(formData);
        
        // Pass the image data to parent component
        onImageUpload({
          file,
          preview: URL.createObjectURL(file),
          filename: response.filename,
          filepath: response.filepath
        });
        
        setUploading(false);
      } catch (error) {
        console.error('Upload failed:', error);
        onError(error.message || 'Failed to upload image. Please try again.');
        setUploading(false);
      }
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        style={{ display: 'none' }}
      />
      
      <div 
        style={{ 
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer'
        }}
        onClick={() => {
          if (!disabled && !uploading) {
            document.getElementById('image-upload').click();
          }
        }}
      >
        {preview ? (
          <div>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '16px' }} 
            />
            {!uploading && (
              <p>Click to upload a different image</p>
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <h3>Drag and drop an image here or click to browse</h3>
            <p>Supported formats: JPEG, PNG, GIF</p>
          </div>
        )}
        
        {uploading && (
          <div style={{ marginTop: '16px' }}>
            <p>Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;