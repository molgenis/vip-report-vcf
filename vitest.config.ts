import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      lines: 99,
      functions: 99,
      branches: 99,
      statements: 99,
    },
  },
});
