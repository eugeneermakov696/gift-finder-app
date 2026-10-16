import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3000,
    open: true,
    allowedHosts: ['.railway.app', '.up.railway.app'],
  },
  preview: {
    port: 3000,
    allowedHosts: ['.railway.app', '.up.railway.app'],
  },
})
