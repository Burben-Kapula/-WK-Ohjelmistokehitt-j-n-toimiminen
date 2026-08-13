import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Конфігурація Vite (dev-сервер фронтенду на http://localhost:5173).
 * Проксі перенаправляє запити /api і /uploads на бекенд,
 * тому у фронтенді всі запити йдуть на відносні шляхи (/api/...).
 * Якщо зміните порт бекенду у backend/.env — оновіть адреси тут!
 */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000'
    }
  }
})