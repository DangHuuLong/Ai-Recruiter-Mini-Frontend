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
    // next-intl's navigation helpers import bare `next/navigation` — Next 16 ships that
    // module without a package.json "exports" map, so Node's own ESM resolver (used when
    // a dependency is externalized) can't extension-resolve it. Routing next-intl through
    // Vite's own resolver (which does extension-less resolution) instead of externalizing
    // it avoids the "Cannot find module 'next/navigation'" failure.
    server: {
      deps: {
        inline: ['next-intl'],
      },
    },
  },
});
