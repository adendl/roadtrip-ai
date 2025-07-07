import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './utils/debug'; // Import debug utility

// Initialize API config with Vite environment variables if available
import { API_CONFIG } from './utils/api';
import { getViteEnv } from './utils/viteEnv';

// Override API_CONFIG with Vite env values
API_CONFIG.BASE_URL = getViteEnv('VITE_API_BASE_URL', API_CONFIG.BASE_URL);
API_CONFIG.ENV = getViteEnv('VITE_APP_ENV', API_CONFIG.ENV);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);