import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './public/index.html', // Explicitly set entry point
      },
    },
  },
  css: {
    devSourcemap: true,
  },
});