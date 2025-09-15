import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic'
  })],
  server: {
    port: 5173,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime'
    ],
    force: true
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  define: {
    global: 'globalThis'
  }
});
