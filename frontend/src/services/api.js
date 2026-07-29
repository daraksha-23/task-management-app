import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

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