import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo_ashel.png', 'favicon.svg'],
      manifest: {
        name: 'ASHEL - e-Administration Tunisie',
        short_name: 'ASHEL',
        description: 'Application mobile de services administratifs tunisiens',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0056D2',
        theme_color: '#0056D2',
        lang: 'fr',
        icons: [
          {
            src: '/logo_ashel.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/logo_ashel.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:8081\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ashel-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
              networkTimeoutSeconds: 10
            }
          }
        ]
      }
    })
  ],
})