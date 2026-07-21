import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite' // 1. Import Tailwind

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.woff2'], 
  base: '/cebu-facilitation-partners/',
  build: {
    outDir: 'docs',
  },
  plugins: [
    vue(),
    tailwindcss(),
    vueJsx(),
    vueDevTools(),
    {src: '~/utils/vue-recaptcha-v3.js', mode: 'client' },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
