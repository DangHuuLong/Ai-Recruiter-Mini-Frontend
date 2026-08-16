import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Native tsconfig-paths resolution (Vite 6+) — the vite-tsconfig-paths plugin the
  // Next.js 16 testing docs suggest is now redundant with this option.
  resolve: { tsconfigPaths: true },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
