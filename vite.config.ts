import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/elysia/',
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'), // Matches tsconfig paths
    },
  },
  build: {
    target: 'esnext', // Matches tsconfig target
    sourcemap: true, // Helps debugging with source maps
    rollupOptions: {
      external: [
        'react',
        'react-dom'
      ]
    }
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