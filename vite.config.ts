import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@reduxjs/toolkit', 'react-redux'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    // Configure preview server to handle SPA routing
    port: 4173,
  },
  build: {
    // Ensure proper handling of client-side routing
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
