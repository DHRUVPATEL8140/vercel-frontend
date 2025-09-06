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
    <div>
      
     
      
    </div>
  );
}
