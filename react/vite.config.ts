import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Pages from "vite-plugin-pages";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  appType: "mpa",
  plugins: [
    react(),
    Pages({
      dirs: "src/routes"
    }),
    // https://github.com/vitejs/vite/issues/2958#issuecomment-1065810046
    {
      name: "rewrite-middleware",
      configureServer({ middlewares: app }) {
        app.use((req, _, next) => {
          const url = req.url ?? "/";
          if (url === "/manage" || url.startsWith("/manage/")) {
            req.url = "/manage/";
          }
          next();
        });
      }
    }
  ],
  base: process.env.NODE_ENV === "production" ? "/build/" : "/",
  build: {
    manifest: true,
    outDir: resolve(__dirname, "../public/build"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "manage/index.html")
      }
    }
  },
  resolve: {
    alias: {
      components: resolve(__dirname, "src/components"),
      hooks: resolve(__dirname, "src/hooks"),
      config: resolve(__dirname, "src/utils/config"),
      services: resolve(__dirname, "src/services"),
      utils: resolve(__dirname, "src/utils")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      "/uploads": {
        target: "http://localhost/uploads/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uploads/, "")
      }
    }
  }
});
