import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Resolves the `@/*` alias from tsconfig.json so tests import the same way app code does.
  resolve: { tsconfigPaths: true },

  test: {
    // Server-side logic only — no DOM, so no jsdom.
    environment: 'node',

    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**', 'generated/**'],
  },
})
