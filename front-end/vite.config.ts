import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dir, "./src"),
      "@server": path.resolve(import.meta.dir, "../server/src"),
      "@app": path.resolve(import.meta.dir, "../"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://extracker.shebl.workers.dev",
        changeOrigin: true,
      },
    },
  },
});
