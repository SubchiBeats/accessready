import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// VITE_BASE lets CI build for a GitHub Pages subpath (e.g. "/accessready/")
// while local dev and the root deployment keep "/".
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
  server: {
    port: 5173
  }
});
