import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/gaura-chat/", // 👈 must match your repo name exactly
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // allows imports like "@/components/ChatArea"
    },
  },
  build: {
    target: "esnext",
    outDir: "build", // 👈 must match deploy script
  },
  server: {
    port: 3000,
    open: true,
  },
});
