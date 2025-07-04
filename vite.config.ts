import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Define environment variables
  define: {
    'process.env.MONGODB_URI': JSON.stringify(process.env.MONGODB_URI)
  }
});
