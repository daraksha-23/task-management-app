import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api, { getApiError, setAccessToken, setLogoutCallback } from '../services/api';

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

function saveTokens(accessToken, refreshToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  setAccessToken(accessToken);
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  setAccessToken(null);
}

function createAuthError(error) {
  const apiError = getApiError(error);
  const normalizedError = new Error(apiError.message);

  normalizedError.errors = apiError.errors;
  normalizedError.status = apiError.status;

  return normalizedError;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', {
      refreshToken,
    });

    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = response.data.data;

    saveTokens(accessToken, newRefreshToken);

    return accessToken;
  }, []);

  const getProfile = useCallback(async () => {
    const response = await api.get('/auth/profile');
    const currentUser = response.data.data.user;

    setUser(currentUser);

    return currentUser;
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const {
        user: authenticatedUser,
        accessToken,
        refreshToken,
      } = response.data.data;

      saveTokens(accessToken, refreshToken);
      setUser(authenticatedUser);

      return response.data;
    } catch (error) {
      throw createAuthError(error);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });

      const {
        user: registeredUser,
        accessToken,
        refreshToken,
      } = response.data.data;

      saveTokens(accessToken, refreshToken);
      setUser(registeredUser);

      return response.data;
    } catch (error) {
      throw createAuthError(error);
    }
  };

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (accessToken) {
        setAccessToken(accessToken);
        await api.post('/auth/logout');
      }
    } catch {
      // Local logout must still happen if the server is unavailable.
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      });

      return response.data;
    } catch (error) {
      throw createAuthError(error);
    }
  };

  const resetPassword = async (resetToken, password) => {
    try {
      const response = await api.post(
        `/auth/reset-password/${encodeURIComponent(resetToken)}`,
        { password }
      );

      return response.data;
    } catch (error) {
      throw createAuthError(error);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      return response.data;
    } catch (error) {
      throw createAuthError(error);
    }
  };

  useEffect(() => {
    setLogoutCallback(() => {
      clearTokens();
      setUser(null);
    });

    return () => {
      setLogoutCallback(null);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function initializeAuthentication() {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      try {
        if (accessToken || refreshToken) {
          await getProfile();
        }
      } catch {
        clearTokens();

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initializeAuthentication();

    return () => {
      active = false;
    };
  }, [getProfile]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      changePassword,
      getProfile,
    }),
    [user, loading, getProfile]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}