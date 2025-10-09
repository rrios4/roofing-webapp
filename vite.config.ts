import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envPrefix: 'REACT_APP_',

  plugins: [react()],
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      buffer: 'buffer'
    }
  },
  optimizeDeps: {
    include: ['buffer']
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
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // React core - split React and ReactDOM
            if (id.includes('react/') && !id.includes('react-')) {
              return 'react';
            }
            if (id.includes('react-dom')) {
              return 'react-dom';
            }

            // React Router - routing
            if (id.includes('react-router')) {
              return 'react-router';
            }

            // Large PDF library - separate chunk
            if (id.includes('@react-pdf/renderer')) {
              return 'pdf-renderer';
            }

            // Chart.js and related charting libraries
            if (
              id.includes('chart.js') ||
              id.includes('react-chartjs-2') ||
              id.includes('@tremor/react')
            ) {
              return 'charts';
            }

            // Forms and validation
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'forms';
            }

            // Supabase client
            if (id.includes('@supabase')) {
              return 'supabase';
            }

            // TanStack Query
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }

            // TanStack Table (separate from query as it can be large)
            if (id.includes('@tanstack/react-table')) {
              return 'react-table';
            }

            // Radix UI - split into smaller groups
            if (
              id.includes('@radix-ui/react-dialog') ||
              id.includes('@radix-ui/react-alert-dialog') ||
              id.includes('@radix-ui/react-popover')
            ) {
              return 'radix-overlays';
            }

            if (
              id.includes('@radix-ui/react-select') ||
              id.includes('@radix-ui/react-dropdown-menu') ||
              id.includes('@radix-ui/react-tabs')
            ) {
              return 'radix-inputs';
            }

            if (id.includes('@radix-ui')) {
              return 'radix-base';
            }

            // Date libraries
            if (
              id.includes('date-fns') ||
              id.includes('luxon') ||
              id.includes('react-day-picker')
            ) {
              return 'date-utils';
            }

            // Utility libraries
            if (
              id.includes('clsx') ||
              id.includes('tailwind-merge') ||
              id.includes('class-variance-authority')
            ) {
              return 'style-utils';
            }

            // Icons
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons';
            }

            // Other heavy libraries
            if (id.includes('axios') || id.includes('buffer')) {
              return 'network-utils';
            }

            // TypeScript and build tools (if any leak in)
            if (id.includes('typescript') || id.includes('@types/')) {
              return 'types';
            }

            // React ecosystem libraries
            if (id.includes('react-')) {
              return 'react-ecosystem';
            }

            // Remaining vendor libraries (smaller now)
            return 'vendor';
          }

          // Application code chunking
          if (id.includes('/src/')) {
            // PDF components (likely heavy)
            if (id.includes('/pdf-render/')) {
              return 'app-pdf';
            }

            // API services
            if (id.includes('/services/') || id.includes('/hooks/useAPI/')) {
              return 'app-services';
            }

            // UI Components
            if (id.includes('/components/ui/') || id.includes('/components/forms/')) {
              return 'app-ui';
            }

            // Pages
            if (id.includes('/pages/')) {
              return 'app-pages';
            }

            // Other components
            if (id.includes('/components/')) {
              return 'app-components';
            }

            // Utilities and config
            if (id.includes('/lib/') || id.includes('/types/') || id.includes('/validations/')) {
              return 'app-utils';
            }
          }
        }
      }
    },
    // Set chunk size warning limit to 900kb (accepting that some vendor libraries are inherently large)
    chunkSizeWarningLimit: 900
  }
});
