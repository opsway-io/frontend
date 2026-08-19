import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite({})],
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
