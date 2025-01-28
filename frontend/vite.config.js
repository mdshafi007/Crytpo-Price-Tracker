import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  // Add this to handle Windows paths
  server: {
    fs: {
      strict: false
    }
  }
})