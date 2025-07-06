// Runtime configuration script
// This file can be used to inject environment variables at runtime
window.RUNTIME_CONFIG = {
  VITE_API_BASE_URL: window.RUNTIME_CONFIG?.VITE_API_BASE_URL || 'http://localhost:8080',
  VITE_APP_ENV: window.RUNTIME_CONFIG?.VITE_APP_ENV || 'development'
}; 