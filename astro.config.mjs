import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://sosese.tech",
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // En dev, le formulaire parle au serveur local s'il tourne (npm start sur le port 3000).
    server: { proxy: { "/api": "http://127.0.0.1:3000" } },
  },
});
