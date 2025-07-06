// Runtime configuration script
// This file can be used to inject environment variables at runtime
window.RUNTIME_CONFIG = {
  VITE_API_BASE_URL: window.RUNTIME_CONFIG?.VITE_API_BASE_URL || 'https://roadtrip-ai-backend-688052801817.australia-southeast1.run.app',
  VITE_APP_ENV: window.RUNTIME_CONFIG?.VITE_APP_ENV || 'production'
}; 