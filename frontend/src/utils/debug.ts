// Debug utility to check environment variable configuration
export const debugConfig = () => {
  console.log('=== Environment Configuration Debug ===');
  console.log('Build-time VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('Build-time VITE_APP_ENV:', import.meta.env.VITE_APP_ENV);
  console.log('Runtime RUNTIME_CONFIG:', (window as any).RUNTIME_CONFIG);
  console.log('Final API_CONFIG:', {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || (window as any).RUNTIME_CONFIG?.VITE_API_BASE_URL || 'http://localhost:8080',
    ENV: import.meta.env.VITE_APP_ENV || (window as any).RUNTIME_CONFIG?.VITE_APP_ENV || 'development'
  });
  console.log('=====================================');
};

// Auto-debug in development
if (import.meta.env.DEV) {
  debugConfig();
} 