import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  root: 'app',
  plugins: [react()],
  base: './',
  build: { outDir: '../dist', emptyOutDir: true },
  test: { root: '.', include: ['tests/**/*.test.{ts,tsx}'] },
});
