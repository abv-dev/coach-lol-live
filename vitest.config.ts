import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src/logic/**', 'src/services/**'],
      exclude: ['**/*.test.ts', '**/__tests__/**'],
    },
  },
});
