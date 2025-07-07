import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './utils/debug'; // Import debug utility

// Initialize API config with Vite environment variables if available
import { initializeApiConfig } from './utils/api';

// Initialize API configuration
initializeApiConfig();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);