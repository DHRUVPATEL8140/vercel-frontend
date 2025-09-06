// src/components/BackendTest.js
import React, { useState } from 'react';
import api from '../api/axios';

export default function BackendTest() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log("Testing backend connection...");
      console.log("API Base URL:", api.defaults.baseURL);
      
      // Test backend health
      const response = await fetch(api.defaults.baseURL.replace('/api/', '/'));
      const healthData = await response.text();
      
      // Test API endpoint
      const apiResponse = await api.get('products/');
      
      setTestResult({
        success: true,
        message: "Backend connection successful!",
        health: healthData,
        apiData: apiResponse.data,
        status: apiResponse.status
      });
    } catch (error) {
      console.error("Backend Test Error:", error);
      setTestResult({
        success: false,
        message: error.message,
        error: error.response?.data || error.message,
        status: error.response?.status || 'No response'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.9)', 
      color: 'white', 
      padding: '15px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>🔧 Backend Test</h4>
      <button 
        onClick={testBackend} 
        disabled={loading}
        style={{
          padding: '5px 10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '11px'
        }}
      >
        {loading ? 'Testing...' : 'Test Backend'}
      </button>

      {testResult && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: testResult.success ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
          border: `1px solid ${testResult.success ? '#00ff00' : '#ff0000'}`,
          borderRadius: '3px'
        }}>
          <div style={{ color: testResult.success ? '#00ff00' : '#ff0000', fontWeight: 'bold' }}>
            {testResult.success ? '✅ Success' : '❌ Error'}
          </div>
          <div><strong>Message:</strong> {testResult.message}</div>
          <div><strong>Status:</strong> {testResult.status}</div>
          {testResult.error && (
            <div>
              <strong>Error:</strong> {JSON.stringify(testResult.error).substring(0, 100)}...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
