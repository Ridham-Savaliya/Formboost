import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Make sure this matches the port you're trying to access
  },
  // build: {
  //   sourcemap: import.meta.env.NODE_ENV === "development", // Enable source maps only in development
  // },
});
