import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envPrefix: 'REACT_APP_',

  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    },
    host: true,
    strictPort: true,
    port: 5173
  }
});
