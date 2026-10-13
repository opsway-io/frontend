import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Must come before the React plugin.
    tanstackRouter({ target: "react" }),
    react(),
  ],
  server: {
    port: 5175,
    strictPort: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    globals: true,
  },
});
