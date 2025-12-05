import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Dynamic Port Configuration
 * Priority: PORT > VITE_PORT > VITE_DEV_PORT > 5174
 * Supports containerized environments and local development
 */
function getPort() {
  // Check multiple environment variables for flexibility
  const port = process.env.PORT || 
               process.env.VITE_PORT || 
               process.env.VITE_DEV_PORT || 
               process.env.DEV_PORT ||
               '5174'
  
  const parsedPort = parseInt(port, 10)
  
  // Validate port range
  if (isNaN(parsedPort) || parsedPort < 1024 || parsedPort > 65535) {
    console.warn(`⚠️  Invalid port ${port}, using default 5174`)
    return 5174
  }
  
  return parsedPort
}

const PORT = getPort()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external connections (important for Docker)
    port: PORT,
    strictPort: false, // Allow port fallback if specified port is in use
    allowedHosts: true,
    watch: {
      usePolling: true, // Useful for Docker on Windows/Mac
    },
  },
  preview: {
    host: '0.0.0.0',
    port: PORT,
    strictPort: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}) 