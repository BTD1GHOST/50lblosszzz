import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Match your GitHub repo name exactly (used for asset paths on GitHub Pages)
const repoName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "50lblossbray";

export default defineConfig(({ mode }) => ({
  // GitHub Pages serves project sites from /repo-name/
  base: mode === "production" ? `/${repoName}/` : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}));
