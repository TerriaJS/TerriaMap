import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true, // Use global test APIs (describe, it, expect)
    environment: "jsdom", // DOM environment for React components
    setupFiles: "./vitest.setup.ts", // Setup file for custom matchers
    css: true, // Process CSS imports
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
