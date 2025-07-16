import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.tsx', 'src/**/*.ts'],
      exclude: [
        '**/*.test.*',
        '**/__tests__/**',
        'node_modules',
        'dist',
        'coverage',
        'src/assets',
        'src/config',
        'src/lumifi/__mocks__',
        'src/App.tsx',
        'src/main.tsx',
        'src/lumifi/pages',
        'src/.*/index\\.ts$', // Exclude index.ts export files
      ],
    },
  },
} as UserConfig);
