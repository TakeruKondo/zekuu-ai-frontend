import React from 'react';
import '../styles/TopNavBar.css';

const TopNavBar = ({ activeTab, setActiveTab, remainingCredits }) => {
  // Nav items with labels and icons
  const navItems = [
    { id: 'generate', label: '生成', icon: '✨' },
    { id: 'history', label: '履歴', icon: '🕒' },
    { id: 'gallery', label: 'ギャラリー', icon: '🖼️' },
    { id: 'pricing', label: '料金', icon: '💰' },
    //{ id: 'resources', label: 'リソース', icon: '📚' }
  ];
  
  return (
    <nav className="top-nav-bar">
      <div className="nav-brand">
        <h1>ZEKUU AI</h1>
      </div>
      
      <ul className="nav-items">
        {navItems.map(item => (
          <li 
            key={item.id} 
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
      </ul>
      
      <div className="user-profile">
        <div className="credits-counter">
          <span className="credits-icon">💎</span>
          <span className="credits-amount">{remainingCredits}</span>
          <span className="credits-label">クレジット</span>
        </div>
        <div className="profile-avatar">
          <span>👤</span>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;