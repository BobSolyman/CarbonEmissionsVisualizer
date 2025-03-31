import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.SERVER_API || "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
