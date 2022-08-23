import { defineConfig } from 'vite';

/// <reference types="vitest" />
export default defineConfig({
  build: {
    lib: {
      name: 'circle-client-node',
      entry: './src/index.ts',
      formats: ['cjs', 'es'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : format}`,
    },
    outDir: './dist',
    rollupOptions: {
      external: ['axios'],
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
