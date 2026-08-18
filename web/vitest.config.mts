import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Native replacement for vite-tsconfig-paths: resolves the "@/*" alias
  // straight from tsconfig.json.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules/**', '.next/**', 'e2e/**'],
  },
});
