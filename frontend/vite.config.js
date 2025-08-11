import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with "/api" will be forwarded to the target
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true, // Recommended for virtual hosts
      },
    }
  }
})