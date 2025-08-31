// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure Vite builds to the 'dist' directory
  },
  server: {
    // Remove any proxy configuration for the API here
    // proxy: {
    //  '/api': 'http://localhost:3000',
    // }
  },
});