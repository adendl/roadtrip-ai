// API configuration utility
function getRuntimeConfig(key: string, fallback: string) {
  if (typeof window !== 'undefined' && (window as any).RUNTIME_CONFIG && (window as any).RUNTIME_CONFIG[key]) {
    return (window as any).RUNTIME_CONFIG[key];
  }
  return fallback;
}

export const API_CONFIG = {
  BASE_URL: getRuntimeConfig('VITE_API_BASE_URL', 'http://localhost:8080'),
  ENV: getRuntimeConfig('VITE_APP_ENV', 'development'),
  TIMEOUT: 600000 // 10 minutes timeout for long-running requests like trip generation
};

// Function to initialize API config with Vite environment variables
export function initializeApiConfig() {
  try {
    // Only run this in browser environment
    if (typeof window !== 'undefined') {
      // Try to access Vite env variables
      const viteEnv = (window as any).__VITE_ENV__;
      if (viteEnv) {
        API_CONFIG.BASE_URL = viteEnv.VITE_API_BASE_URL || API_CONFIG.BASE_URL;
        API_CONFIG.ENV = viteEnv.VITE_APP_ENV || API_CONFIG.ENV;
      }
    }
  } catch (error) {
    console.warn('Could not initialize API config with Vite env:', error);
  }
}

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

// Enhanced fetch function with timeout and better error handling
export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout: number = API_CONFIG.TIMEOUT
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout / 1000} seconds`);
    }
    throw error;
  }
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