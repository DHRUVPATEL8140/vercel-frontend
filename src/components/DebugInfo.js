// src/components/DebugInfo.js
import React from 'react';
import api from '../api/axios';

export default function DebugInfo() {
  const apiUrl = api.defaults.baseURL;
  const nodeEnv = process.env.NODE_ENV;
  const reactAppApiUrl = process.env.REACT_APP_API_URL;

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>🔧 Debug Info</h4>
      <div><strong>NODE_ENV:</strong> {nodeEnv}</div>
      <div><strong>REACT_APP_API_URL:</strong> {reactAppApiUrl || 'Not set'}</div>
      <div><strong>API Base URL:</strong> {apiUrl}</div>
      <div><strong>Current URL:</strong> {window.location.href}</div>
    </div>
  );
}
