// API base URL 
const API_BASE_URL = 'http://192.168.50.198:5001/api'; // Using port 5001 instead of 5000

/**
 * Check the health of the server
 * @returns {Promise<object>} Health status information
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

/**
 * Upload an image to the server
 * @param {FormData} formData The form data containing the image
 * @returns {Promise<object>} Upload result information
 */
// In src/services/api.js
export const uploadImage = async (formData) => {
  try {
    const response = await fetch('http://192.168.50.198:5001/api/upload', {
      method: 'POST',
      body: formData, // This contains the image file
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

/**
 * Preprocess an uploaded image
 * @param {object} data Processing parameters
 * @param {string} data.filename The filename of the uploaded image
 * @param {string} data.preprocessor The preprocessor to use
 * @returns {Promise<object>} Preprocessing result information
 */
export const preprocessImage = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/preprocess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Image preprocessing failed:', error);
    throw error;
  }
};

/**
 * Generate an image using ControlNet
 * @param {object} data Generation parameters
 * @param {string} data.filename The filename of the processed image
 * @param {string} data.prompt The text prompt for generation
 * @param {string} [data.negative_prompt] The negative text prompt
 * @param {string} data.preprocessor The preprocessor used
 * @param {number} [data.guidance_scale=7.5] The guidance scale
 * @param {number} [data.num_inference_steps=30] The number of inference steps
 * @returns {Promise<object>} Generation result information
 */
export const generateImage = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Image generation failed:', error);
    throw error;
  }
};