import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves each generated repo at /<repo name>/. The deploy workflow sets BASE_PATH from the
// repo's own name, so this one starter works for every repo the SDLC Orchestrator creates from it.
// Local runs, tests and CI build at "/".
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});
