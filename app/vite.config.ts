import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the project at /python-algorithm-visualizer/; Vercel and
// other root-served hosts use /.
const base = process.env.VERCEL || process.env.BASE_PATH === '/' ? '/' : '/python-algorithm-visualizer/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
