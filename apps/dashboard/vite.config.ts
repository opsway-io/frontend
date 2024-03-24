import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  server: {
    proxy: {
      "/v1": {
        target: "http://localhost:8001",
        // target: "https://api.opsway.io",
        changeOrigin: true,
      },
    },
  },
});
