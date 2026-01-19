import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimisation du build
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,

    // Code splitting pour optimiser le cache et le chargement
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - rarement modifiés, donc cache longue durée
          'react-vendor': ['react', 'react-dom'],

          // UI components - shadcn et Radix UI
          'ui-components': [
            '@radix-ui/react-slot',
          ],

          // Icônes séparées pour lazy loading potentiel
          'icons': ['lucide-react'],

          // Utilitaires (clsx, tailwind-merge, etc.)
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },

        // Nommage des chunks avec hash pour cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },

    // Compression et optimisation
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500, // Warning si chunk > 500kb

    // Source maps pour debugging en production (optionnel)
    sourcemap: false, // Désactivé pour réduire la taille
  },

  // Optimisation des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'clsx',
      'tailwind-merge',
    ],
  },
})
