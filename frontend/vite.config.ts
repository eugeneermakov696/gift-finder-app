import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gift-finder-app/',
  server: {
    port: 3000,
    open: true,
  },
})
