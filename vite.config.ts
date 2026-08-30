import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: '/elysia/',
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon16.png', 'favicon32.png', 'favicon180.png'],
      manifest: {
        name: 'Elysia',
        short_name: 'Elysia',
        description: 'Your recipes will be in good hands with Elysia.',
        start_url: '.',
        display: 'standalone',
        theme_color: '#faf6ef',
        background_color: '#faf6ef',
        icons: [
          { src: 'logo192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'logo512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        runtimeCaching: [
          {
            // Recipe photos stored in Supabase storage.
            urlPattern: /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'elysia-recipe-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Supabase REST API reads, so the last-seen data still renders offline.
            urlPattern: /^https:\/\/[a-z0-9-]+\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'elysia-api',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'), // Matches tsconfig paths
    },
  },
  build: {
    outDir: './dist',
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {}
  },
  server: {
    port: 3000, // Default dev server port
    open: true, // Automatically opens browser on start
    strictPort: true, // Ensures no fallback to another port
    hmr: {
      overlay: true, // Enables hot module replacement
    }
  },
  esbuild: {
    jsx: 'automatic', // Ensures JSX works correctly with React 18
  }
});
