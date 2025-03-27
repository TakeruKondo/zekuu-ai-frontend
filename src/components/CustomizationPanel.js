import React, { useState } from 'react';
import '../styles/CustomizationPanel.css';

const CustomizationPanel = ({ 
  preprocessor,
  setPreprocessor,
  negativePrompt,
  setNegativePrompt,
  numImages,
  setNumImages,
  showOnProfile,
  setShowOnProfile,
  aspectRatio,
  setAspectRatio
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Available preprocessors
  const preprocessors = [
    { value: 'canny', label: 'キャニーエッジ検出' },
    { value: 'pose', label: '人物ポーズ検出' },
    { value: 'depth', label: '深度マップ' },
    { value: 'normal', label: '法線マップ' },
    { value: 'scribble', label: '落書き' },
    { value: 'seg', label: 'セグメンテーション' }
  ];
  
  // Available aspect ratios
  const aspectRatios = [
    { value: '1:1', label: '正方形 (1:1)' },
    { value: '3:4', label: 'ポートレート (3:4)' },
    { value: '4:3', label: '風景 (4:3)' },
    { value: '9:16', label: 'モバイル (9:16)' },
    { value: '16:9', label: 'ワイドスクリーン (16:9)' }
  ];
  
  return (
    <div className="customization-panel">
      <div className="panel-header">
        <h3>カスタマイズ</h3>
      </div>
      
      <div className="panel-content">
        {/* Aspect Ratio */}
        <div className="control-group">
          <label className="control-label">アスペクト比</label>
          <div className="aspect-ratio-options">
            {aspectRatios.map(ratio => (
              <button
                key={ratio.value}
                className={`aspect-ratio-btn ${aspectRatio === ratio.value ? 'active' : ''}`}
                onClick={() => setAspectRatio(ratio.value)}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Model/Preprocessor */}
        <div className="control-group">
          <label className="control-label">モデル</label>
          <select
            className="control-select"
            value={preprocessor}
            onChange={(e) => setPreprocessor(e.target.value)}
          >
            {preprocessors.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        
        {/* Negative Prompt */}
        <div className="control-group">
          <label className="control-label">ネガティブプロンプト</label>
          <textarea
            className="control-textarea"
            placeholder="生成したくない要素を指定..."
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            rows={3}
          />
        </div>
        
        {/* Number of Images */}
        <div className="control-group">
          <label className="control-label">画像の数: {numImages}</label>
          <div className="slider-container">
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={numImages}
              onChange={(e) => setNumImages(parseInt(e.target.value))}
              className="slider-control"
            />
            <div className="slider-labels">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>
        </div>
        
        {/* Show on Profile */}
        <div className="control-group">
          <label className="control-label">プロフィールに表示</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showOnProfile}
              onChange={(e) => setShowOnProfile(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        {/* Advanced Settings */}
        <div className="control-group">
          <button
            className="advanced-settings-btn"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span>{showAdvanced ? '詳細設定を隠す' : '詳細設定を表示'}</span>
            <span className={`arrow-icon ${showAdvanced ? 'open' : ''}`}>▼</span>
          </button>
          
          {showAdvanced && (
            <div className="advanced-settings">
              <div className="control-group">
                <label className="control-label">ガイダンススケール: 7.5</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.1"
                    defaultValue="7.5"
                    className="slider-control"
                  />
                  <div className="slider-labels">
                    <span>1</span>
                    <span>7.5</span>
                    <span>15</span>
                  </div>
                </div>
              </div>
              
              <div className="control-group">
                <label className="control-label">ステップ数: 30</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    defaultValue="30"
                    className="slider-control"
                  />
                  <div className="slider-labels">
                    <span>10</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;