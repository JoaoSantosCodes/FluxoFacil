import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    open: true,
    proxy: {
      '/contas': 'http://localhost:3333',
      '/recebidos': 'http://localhost:3333',
      '/transacoes': 'http://localhost:3333'
    }
  }
}) 