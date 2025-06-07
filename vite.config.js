// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        cadastro: 'cadastro.html',
        dashboard: 'dashboard.html',
      }
    }
  }
})