import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Keep responsive/theme images out of JS so only the selected image downloads.
  build: { assetsInlineLimit: 0 },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
