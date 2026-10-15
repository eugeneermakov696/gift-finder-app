import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || (process.env.RAILWAY_ENVIRONMENT ? '/' : '/gift-finder-app/'),
  server: {
    port: 3000,
    open: true,
    allowedHosts: true,
  },
  preview: {
    port: 3000,
    allowedHosts: true,
  },
})
