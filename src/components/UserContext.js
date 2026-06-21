// src/components/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Create the context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        // Perform an authenticated GET for user info using the X-Force-Auth flag
        // so our axios client knows to include Authorization for this specific GET.
        const response = await api.get('auth/user/', {
          headers: {
            'X-Force-Auth': '1',
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
      // ensure no lingering default auth header
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem("access_token", token);
    // keep default Authorization for non-GET requests; GETs will only send auth when forced
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    setUser,
    login,
    logout,
    refreshUser: fetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};