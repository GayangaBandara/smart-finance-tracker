import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    outDir: 'dist',
    // Lazy loading works through React.lazy() and dynamic imports
    // which are automatically code-split by Vite
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  resolve: {
    alias: {
      '@lib': '/src/lib',
    },
  },
  server: {
    middlewareMode: false,
  },
});
