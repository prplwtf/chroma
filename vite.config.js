import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Chroma',
      fileName: (format) => `chroma.${format}.js`,
    },
  },
});
