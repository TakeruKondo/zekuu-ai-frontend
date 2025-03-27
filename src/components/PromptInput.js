import React from 'react';
import '../styles/PromptInput.css';

const PromptInput = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <div className="prompt-input-container">
      <form onSubmit={handleSubmit}>
        <div className="prompt-input-wrapper">
          <input
            type="text"
            className="prompt-input-field"
            placeholder="未来建築風なパース.."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="generate-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span className="button-icon">⚡</span>
                <span className="button-text">生成</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;