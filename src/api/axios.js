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
    const method = (config.method || 'get').toLowerCase();
    // If this request explicitly sets X-Force-Auth, allow Authorization to be sent.
    const forceAuth = config.headers && (config.headers['X-Force-Auth'] || config.headers['x-force-auth']);

    if (method === 'get') {
      if (forceAuth) {
        // ensure Authorization header is present for forced auth GET
        if (!config.headers.Authorization && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        // remove any Authorization header for normal GETs to avoid accidental 401s
        if (config.headers && config.headers.Authorization) {
          delete config.headers.Authorization;
        }
      }
    } else {
      // non-GET requests should include Authorization when token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Remove internal flag so it doesn't get sent to server
    if (config.headers) {
      delete config.headers['X-Force-Auth'];
      delete config.headers['x-force-auth'];
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
      // Unauthorized - for non-GET requests, clear token and redirect to login
      // For GET requests (public reads like product details) do not auto-redirect;
      // let the calling component handle the error so viewing pages aren't forced to login.
      const method = error.config?.method?.toLowerCase();
      if (method && method !== 'get') {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      } else {
        // For GET requests, just fall through and reject so components can show errors
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
