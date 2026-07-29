import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let logoutCallback = null;

export function setLogoutCallback(cb) {
  logoutCallback = cb;
}

let refreshPromise = null;
 
function isAuthEndpoint(url) {
  if (!url) return false;
  const path = url.split('?')[0];
  const authEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];
  return authEndpoints.some((endpoint) => path.endsWith(endpoint));
}

// Request interceptor to attach access token dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (logoutCallback) logoutCallback();
          return Promise.reject(error);
        }

        refreshPromise = axios
          .post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken })
          .then((res) => {
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            return accessToken;
          })
          .catch((err) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            if (logoutCallback) logoutCallback();
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Extracts a consistent error shape from Axios errors.
 *
 * @returns {{
 *   message: string,
 *   errors: Record<string, string>,
 *   status: number | null
 * }}
 */
export function getApiError(error) {
  if (!error.response) {
    return {
      message: 'Unable to connect to the server. Please try again.',
      errors: {},
      status: null,
    };
  }

  const responseData = error.response.data;

  return {
    message:
      responseData?.message ||
      'Something went wrong. Please try again.',
    errors: responseData?.errors || {},
    status: error.response.status,
  };
}

export function setAccessToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
