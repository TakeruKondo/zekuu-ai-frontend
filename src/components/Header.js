import React from 'react';

const Header = ({ serverStatus }) => {
  return (
    <header style={{ 
      backgroundColor: '#2196f3', 
      padding: '16px', 
      color: 'white',
      marginBottom: '20px' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <h1 style={{ margin: 0 }}>ControlNet Web App</h1>
        
        <div>
          <span style={{ 
            backgroundColor: serverStatus?.isConnected ? '#4caf50' : '#f44336',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '14px'
          }}>
            {serverStatus?.isConnected ? 
              `Connected (${serverStatus.device})` : 
              'Disconnected'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;