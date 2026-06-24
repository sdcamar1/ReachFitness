import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const defaultBackendUrl =
    mode === "production"
      ? "https://reach-fitness-backend.vercel.app"
      : "http://localhost:8001";
  return {
    plugins: [react()],
    define: {
      "process.env.REACT_APP_BACKEND_URL": JSON.stringify(
        env.REACT_APP_BACKEND_URL || defaultBackendUrl,
      ),
    },
  };
});
