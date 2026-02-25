import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // Use a relative base so built assets work when deployed to a subpath
  // (for example GitHub Pages). Change to '/your-repo-name/' if you
  // prefer an absolute repo path.
  base: "./",
  plugins: [react()],
});
