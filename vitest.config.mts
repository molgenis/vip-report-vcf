import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      }
    },
  },
});
