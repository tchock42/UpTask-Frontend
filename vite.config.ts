import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {fileURLToPath, URL} from 'node:url' // importa los paquete para definir alias de rutas
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
