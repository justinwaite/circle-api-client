import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: 'circle-api-client',
      entry: './src/index.ts',
      formats: ['cjs', 'es'],
      fileName: (format) => `circle-api-client.${format === 'es' ? 'mjs' : format}`,
    },
    outDir: './dist',
    rollupOptions: {
      external: ['axios'],
    },
  },
});
