import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://sosese.tech",
  output: "static",
  outDir: "../dist",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // Scripts des composants toujours en fichier externe, même petits : inlinés, ils grossissaient le HTML de
    // l'accueil au-delà de la première fenêtre TCP (~14 ko) et retardaient le LCP (DESIGN.md, « Décisions »).
    // null = règle par défaut de Vite pour tout le reste (CSS, images).
    build: { assetsInlineLimit: (chemin) => (chemin.endsWith(".js") ? false : null) },
    // En dev, le formulaire parle au serveur local s'il tourne (npm start sur le port 3000).
    server: { proxy: { "/api": "http://127.0.0.1:3000" } },
  },
});
