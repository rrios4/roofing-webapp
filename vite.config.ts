import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  envPrefix: 'REACT_APP_',

  plugins: [
    react(),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ['buffer', 'process'],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      // Ensure consistent React version
      react: 'react',
      'react-dom': 'react-dom'
    }
  },
  esbuild: {
    target: 'esnext',
    format: 'esm'
  },
  server: {
    watch: {
      usePolling: true
    },
    host: true,
    strictPort: true,
    port: 5173
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'es',
        manualChunks: {
          // Force React into completely isolated chunks to prevent conflicts
          'react-vendor': ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
          'react-dom-vendor': ['react-dom', 'react-dom/client'],
          'react-router-vendor': ['react-router-dom'],

          // Other major libraries
          'pdf-renderer': ['@react-pdf/renderer'],
          'charts-vendor': ['chart.js', 'react-chartjs-2', '@tremor/react'],
          'forms-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'react-query': ['@tanstack/react-query'],
          'react-table': ['@tanstack/react-table'],
          'radix-overlays': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-popover'
          ],
          'radix-inputs': [
            '@radix-ui/react-select',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs'
          ],
          'radix-base': [
            '@radix-ui/react-slot',
            '@radix-ui/react-separator',
            '@radix-ui/react-switch'
          ],
          'icons-vendor': ['lucide-react', 'react-icons'],
          'date-utils': ['date-fns', 'luxon', 'react-day-picker'],
          'style-utils': [
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'tailwindcss-animate'
          ],
          'app-utils': ['axios', 'uuid', 'cmdk'],
          'app-pdf': ['web-vitals', 'sweetalert']
        }
      }
    },
    // Set chunk size warning limit to 900kb (accepting that some vendor libraries are inherently large)
    chunkSizeWarningLimit: 900
  }
});
