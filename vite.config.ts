import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure proper file extensions and MIME types
    rollupOptions: {
      output: {
        // Ensure JS files have .js extension
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Copy _redirects file to dist
    copyPublicDir: true
  },
  // Ensure base path is set correctly for Netlify
  base: '/',
  // Copy additional files
  publicDir: 'public'
})
