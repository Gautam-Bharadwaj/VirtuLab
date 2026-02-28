import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm,json}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/.*railway\.app\/api\/.*/,
          handler: 'NetworkFirst',
          options: { cacheName: 'api-cache' }
        }]
      },
      manifest: {
        name: 'VirtuLab — Virtual Science Laboratory',
        short_name: 'VirtuLab',
        theme_color: '#0a0a1a',
        background_color: '#0a0a1a',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
