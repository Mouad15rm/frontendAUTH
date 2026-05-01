// src/context/AuthContext.jsx
// Global authentication state management using React Context API

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading while checking auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ============================================================
  // INITIALIZE AUTH STATE on app load
  // Tries to refresh token from HTTP-only cookie
  // ============================================================
  const initializeAuth = useCallback(async () => {
    try {
      const response = await authAPI.refresh();
      const { accessToken, user: userData } = response.data.data;

      // Store access token in memory (secure - not localStorage)
      window.__accessToken = accessToken;
      setUser(userData);
      setIsAuthenticated(true);
    } catch {
      // No valid session - user needs to login
      window.__accessToken = null;
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // ============================================================
  // LOGIN
  // ============================================================
  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { accessToken, user: userData } = response.data.data;

    window.__accessToken = accessToken;
    setUser(userData);
    setIsAuthenticated(true);

    return userData;
  };

  // ============================================================
  // REGISTER
  // ============================================================
  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password });
    const { accessToken, user: userData } = response.data.data;

    window.__accessToken = accessToken;
    setUser(userData);
    setIsAuthenticated(true);

    return { userData, message: response.data.message };
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue logout even if API call fails
    } finally {
      window.__accessToken = null;
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // ============================================================
  // SET USER FROM OAUTH CALLBACK
  // Called after Google OAuth redirect
  // ============================================================
  const setAuthFromToken = async (token) => {
    window.__accessToken = token;
    try {
      const response = await authAPI.getMe();
      const userData = response.data.data.user;
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch {
      window.__accessToken = null;
      throw new Error('Failed to get user data');
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    setAuthFromToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================
// CUSTOM HOOK
// ============================================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
