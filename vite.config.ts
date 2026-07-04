import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// GitHub Pages base path. The prompt requires /MundodeLeoeLucas/.
// Override with VITE_BASE=/ for local root serving if needed.
const base = process.env.VITE_BASE ?? '/MundodeLeoeLucas/';

export default defineConfig({
  base,
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  build: {
    target: 'es2021',
    outDir: 'dist',
    sourcemap: true,
  },
});
