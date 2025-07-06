// API configuration utility
export const API_CONFIG = {
  BASE_URL: (window as any).RUNTIME_CONFIG?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || window.location.origin,
  ENV: (window as any).RUNTIME_CONFIG?.VITE_APP_ENV || import.meta.env.VITE_APP_ENV || 'production'
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
};

// Common API headers
export const getApiHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: 'api/users/login',
  SIGNUP: 'api/users/signup',
  TRIPS: {
    CREATE: 'api/trips/create',
    GET_USER_TRIPS: 'api/trips/user',
    DELETE: (tripId: string | number) => `api/trips/${tripId}`,
  }
} as const; 