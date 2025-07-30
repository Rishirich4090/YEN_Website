import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { createServer } from "./server"; // Commented out - server not yet implemented

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()], // Removed expressPlugin() for now
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

// Commented out until server is implemented
// function expressPlugin(): Plugin {
//   return {
//     name: "express-plugin",
//     apply: "serve", // Only apply during development (serve mode)
//     configureServer(server) {
//       const app = createServer();

//       // Add Express app as middleware to Vite dev server
//       server.middlewares.use(app);
//     },
//   };
// }
