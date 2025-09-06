// src/api/axios.js
import axios from "axios";

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  console.log("Environment check:", {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    location: window.location.href,
    hostname: window.location.hostname
  });

  // Force production backend URL for Vercel deployment
  if (window.location.hostname.includes('vercel.app')) {
    console.log("Detected Vercel deployment, using production backend");
    return "https://infinite-backend-ab0i.onrender.com/api/";
  }

  // If REACT_APP_API_URL is set, use it
  if (process.env.REACT_APP_API_URL) {
    console.log("Using REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // If running in production, use your deployed backend URL
  if (process.env.NODE_ENV === 'production') {
    console.log("Using production backend URL");
    return "https://infinite-backend-ab0i.onrender.com/api/";
  }
  
  // Default to localhost for development
  console.log("Using development backend URL");
  return "http://localhost:8000/api/";
};

const API_BASE = getApiBaseUrl();

console.log("API Base URL:", API_BASE); // Debug log

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;
