import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // ↓ Stub out the Node.js-only module that @tanstack/start-storage-context
      //   tries to import — it's never needed in a pure browser build.
      "node:async_hooks": path.resolve(__dirname, "./src/mocks/async_hooks.ts"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      // Belt-and-suspenders: also tell Rollup to treat it as external
      // in case the alias doesn't catch every import path.
      external: (id) => id === "node:async_hooks" || id === "async_hooks",
    },
  },
});