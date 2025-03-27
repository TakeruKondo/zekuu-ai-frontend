import React, { useState, useEffect } from 'react';
import './styles/App.css';
import TopNavBar from './components/TopNavBar';
import PromptInput from './components/PromptInput';
import ImageCanvas from './components/ImageCanvas';
import ImageHistory from './components/ImageHistory';
import CustomizationPanel from './components/CustomizationPanel';
import { checkHealth, uploadImage, preprocessImage, generateImage } from './services/api';





function App() {
  // State management
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [historyImages, setHistoryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState({ isConnected: false, device: 'unknown' });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [preprocessor, setPreprocessor] = useState('canny');
  const [numImages, setNumImages] = useState(1);
  const [showOnProfile, setShowOnProfile] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(58);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // Handle image upload
  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setProcessedImage(null);
    setGeneratedImages([]);
    setError(null);
  };

  // Check server health on component mount
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const healthData = await checkHealth();
        setServerStatus({
          isConnected: true,
          device: healthData.device
        });
      } catch (error) {
        console.error('Failed to connect to server:', error);
        setServerStatus({
          isConnected: false,
          device: 'unknown'
        });
        setError('Could not connect to server. Please check if the backend is running on port 5001.');
      }
    };

    checkServerHealth();
    
    // Load mock history data
    setHistoryImages([
      { id: 1, url: 'https://picsum.photos/id/237/200/200', prompt: 'A cute dog' },
      { id: 2, url: 'https://picsum.photos/id/1025/200/200', prompt: 'Panda in bamboo forest' },
      { id: 3, url: 'https://picsum.photos/id/1074/200/200', prompt: 'Mountain landscape' },
      { id: 4, url: 'https://picsum.photos/id/1084/200/200', prompt: 'Walnut tree' }
    ]);
  }, []);

  // Handle the processed image
  const handleImageProcessed = (processedImageData) => {
    setProcessedImage(processedImageData);
    setError(null);
  };

  // Handle the generated images
  const handleImagesGenerated = (images) => {
    setGeneratedImages(images);
    
    // Add to history
    const newHistoryImages = [...images.map(img => ({
      id: Date.now() + Math.random(),
      url: img.url,
      prompt: prompt
    })), ...historyImages];
    
    setHistoryImages(newHistoryImages.slice(0, 20)); // Keep only the latest 20 images
    setIsLoading(false);
    setError(null);
    
    // Deduct credits
    setRemainingCredits(prev => Math.max(0, prev - numImages));
  };

  // Handle prompt submission
  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (remainingCredits < numImages) {
      setError('Not enough credits to generate images');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // If we have an uploaded image, we need to preprocess it first
      if (uploadedImage) {
        // Preprocess the image if it hasn't been preprocessed yet
        if (!processedImage) {
          const processResponse = await preprocessImage({
            filename: uploadedImage.filename,
            preprocessor
          });
          
          const processedImageData = {
            url: `http://localhost:5001/api/uploads/${processResponse.processed_filename}`,
            filename: processResponse.processed_filename,
            preprocessor
          };
          
          setProcessedImage(processedImageData);
          
          // Generate image with the preprocessed image
          const generateResponse = await generateImage({
            filename: processResponse.processed_filename,
            prompt,
            negative_prompt: negativePrompt,
            preprocessor,
            guidance_scale: 7.5,
            num_inference_steps: 30
          });
          
          handleImagesGenerated([{
            url: `http://localhost:5001${generateResponse.result_url}`,
            filename: generateResponse.result_filename,
            prompt,
            negativePrompt,
            preprocessor
          }]);
        } else {
          // Generate image with the already processed image
          const generateResponse = await generateImage({
            filename: processedImage.filename,
            prompt,
            negative_prompt: negativePrompt,
            preprocessor,
            guidance_scale: 7.5,
            num_inference_steps: 30
          });
          
          handleImagesGenerated([{
            url: `http://localhost:5001${generateResponse.result_url}`,
            filename: generateResponse.result_filename,
            prompt,
            negativePrompt,
            preprocessor
          }]);
        }
      } else {
        // TODO: Implement text-to-image generation without control image
        setError('Please upload an image to use as control');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error.message || 'Failed to generate image. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <TopNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        remainingCredits={remainingCredits}
      />
      
      <div className="main-content">
        <div className="sidebar left-sidebar">
          <ImageHistory 
            images={historyImages} 
            onSelectImage={(image) => {
              // Implementation for when a history image is selected
              console.log('Selected image:', image);
            }} 
          />
        </div>
        
        <div className="central-area">
          <PromptInput 
            prompt={prompt} 
            setPrompt={setPrompt}
            onSubmit={handlePromptSubmit}
            isLoading={isLoading}
          />
          
          <div className="canvas-container">
            <ImageCanvas 
              title="Input Image"
              image={uploadedImage ? uploadedImage.preview : null}
              processedImage={processedImage ? processedImage.url : null}
              onImageUpload={handleImageUpload}
              isLoading={isLoading}
            />
            
            <ImageCanvas 
              title="Generated Image"
              image={generatedImages.length > 0 ? generatedImages[0].url : null}
              isLoading={isLoading}
              isOutput={true}
            />
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>
        
        <div className="sidebar right-sidebar">
          <CustomizationPanel 
            preprocessor={preprocessor}
            setPreprocessor={setPreprocessor}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            numImages={numImages}
            setNumImages={setNumImages}
            showOnProfile={showOnProfile}
            setShowOnProfile={setShowOnProfile}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
          />
        </div>
      </div>
    </div>
  );
}

// Make sure this export statement is present
export default App;