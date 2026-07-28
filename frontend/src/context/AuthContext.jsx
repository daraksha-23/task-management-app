import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:3000/api/v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authenticated fetch helper
  const apiFetch = useCallback(async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const currentToken = localStorage.getItem('accessToken');
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.message || 'Something went wrong';
      throw new Error(errorMsg);
    }

    return result;
  }, []);

  // Refresh Token Function
  const refreshTokens = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    if (!currentRefreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Token refresh failed');
      }

      const { accessToken, refreshToken: newRefreshToken } = result.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setToken(accessToken);
      setRefreshToken(newRefreshToken);
      return accessToken;
    } catch (err) {
      // Clear auth on refresh failure
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      throw err;
    }
  }, []);

  // Profile Fetching Function
  const fetchProfile = useCallback(async (tokenToUse) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenToUse}`,
    };

    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers,
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch profile');
    }
    setUser(result.data.user);
  }, []);

  // Login
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      const { accessToken, refreshToken: newRefreshToken, user: userData } = result.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setToken(accessToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Register
  const register = async (username, email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      const { accessToken, refreshToken: newRefreshToken, user: userData } = result.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setToken(accessToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    setError(null);
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('API logout failed, performing local logout:', err.message);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send recovery email');
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset Password
  const resetPassword = async (tokenParam, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/${tokenParam}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Password reset failed');
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Change Password
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    try {
      return await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Initialize Auth State on Mount
  useEffect(() => {
    const initializeAuth = async () => {
      const currentToken = localStorage.getItem('accessToken');
      if (currentToken) {
        try {
          await fetchProfile(currentToken);
        } catch (err) {
          // Token might be expired, attempt refresh
          try {
            const newToken = await refreshTokens();
            await fetchProfile(newToken);
          } catch (refreshErr) {
            console.warn('Session expired. User must log in again.');
          }
        }
      } else {
        // Try refreshing token if access token is missing but refresh exists
        const currentRefreshToken = localStorage.getItem('refreshToken');
        if (currentRefreshToken) {
          try {
            const newToken = await refreshTokens();
            await fetchProfile(newToken);
          } catch (refreshErr) {
            console.warn('Silent refresh failed.');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [fetchProfile, refreshTokens]);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    apiFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
