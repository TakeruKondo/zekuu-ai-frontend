import React, { useState } from 'react';
import { preprocessImage, generateImage } from '../services/api';

const ControlNetPanel = ({ 
  uploadedImage, 
  onImageProcessed, 
  onImagesGenerated, 
  onLoadingChange, 
  onError, 
  disabled 
}) => {
  // State for form inputs
  const [preprocessor, setPreprocessor] = useState('canny');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [steps, setSteps] = useState(30);
  const [preprocessedImage, setPreprocessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle preprocessing
  const handlePreprocess = async () => {
    if (!uploadedImage || !preprocessor) return;

    try {
      setIsProcessing(true);
      onLoadingChange(true);

      const response = await preprocessImage({
        filename: uploadedImage.filename,
        preprocessor
      });

      // Update the UI with the preprocessed image
      setPreprocessedImage({
        url: `http://localhost:5001/api/uploads/${response.processed_filename}`,
        filename: response.processed_filename,
        preprocessor: response.preprocessor
      });
      
      // Notify parent component
      onImageProcessed({
        url: `/api/uploads/${response.processed_filename}`,
        filename: response.processed_filename,
        preprocessor: response.preprocessor
      });
      
    } catch (error) {
      console.error('Preprocessing failed:', error);
      onError(error.message || 'Failed to preprocess image. Please try again.');
    } finally {
      setIsProcessing(false);
      onLoadingChange(false);
    }
  };

  // Handle image generation
  const handleGenerate = async () => {
    if (!uploadedImage || !preprocessor || !prompt) {
      onError('Please provide a prompt and select a preprocessor');
      return;
    }

    try {
      setIsGenerating(true);
      onLoadingChange(true);

      // Preprocess first if not already done
      let processedFilename = preprocessedImage ? preprocessedImage.filename : null;
      
      if (!processedFilename) {
        const processResponse = await preprocessImage({
          filename: uploadedImage.filename,
          preprocessor
        });
        processedFilename = processResponse.processed_filename;
        
        // Update the UI with the preprocessed image
        setPreprocessedImage({
          url: `/api/uploads/${processedFilename}`,
          filename: processedFilename,
          preprocessor
        });
      }

      // Generate the image
      const generateResponse = await generateImage({
        filename: processedFilename,
        prompt,
        negative_prompt: negativePrompt,
        preprocessor,
        guidance_scale: guidanceScale,
        num_inference_steps: steps
      });

      // Notify parent component with the generated image
      onImagesGenerated([
        {
          url: `http://localhost:5001${generateResponse.result_url}`,
          filename: generateResponse.result_filename,
          prompt,
          negativePrompt,
          preprocessor
        }
      ]);
      
    } catch (error) {
      console.error('Generation failed:', error);
      onError(error.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
      onLoadingChange(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>ControlNet Settings</h2>
      <hr style={{ marginBottom: '20px' }} />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {/* Left Column: Original Image & Preprocessor Selection */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3>Input Image</h3>
          
          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '8px', 
            padding: '8px',
            marginBottom: '16px'
          }}>
            <img
              src={uploadedImage.preview}
              alt="Original image"
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Preprocessor</label>
            <select
              value={preprocessor}
              onChange={(e) => setPreprocessor(e.target.value)}
              disabled={disabled || isProcessing || isGenerating}
              style={{ 
                width: '100%', 
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              <option value="canny">Canny Edge Detection</option>
              <option value="pose">Human Pose Detection</option>
            </select>
          </div>
          
          <button
            onClick={handlePreprocess}
            disabled={disabled || isProcessing || isGenerating}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: isProcessing ? '#ccc' : '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isProcessing ? 'not-allowed' : 'pointer'
            }}
          >
            {isProcessing ? 'Processing...' : 'Preprocess Image'}
          </button>
        </div>
        
        {/* Right Column: Preprocessed Image & Generation Controls */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3>Control Image</h3>
          
          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '8px', 
            padding: '8px',
            minHeight: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '16px',
            backgroundColor: '#f8f9fa'
          }}>
            {preprocessedImage ? (
              <img
                src={preprocessedImage.url}
                alt="Preprocessed image"
                style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }}
              />
            ) : (
              <p style={{ color: '#666', textAlign: 'center' }}>
                Preprocessed image will appear here after preprocessing.
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Prompt</label>
            <textarea
              rows="3"
              placeholder="Describe what you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={disabled || isGenerating}
              style={{ 
                width: '100%', 
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Negative Prompt</label>
            <textarea
              rows="2"
              placeholder="Describe what you want to avoid..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              disabled={disabled || isGenerating}
              style={{ 
                width: '100%', 
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Guidance Scale: {guidanceScale}
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={guidanceScale}
              onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
              disabled={disabled || isGenerating}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>1</span>
              <span>7.5</span>
              <span>15</span>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Steps: {steps}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              disabled={disabled || isGenerating}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>10</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={disabled || isGenerating || !prompt}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isGenerating || !prompt ? '#ccc' : '#ff4081',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isGenerating || !prompt ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlNetPanel;