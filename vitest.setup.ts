import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Explicit cleanup (not relying on RTL's auto-cleanup, which needs `test.globals: true`) —
// this repo keeps test imports explicit rather than injecting Jest/Vitest globals.
afterEach(() => {
  cleanup();
});
