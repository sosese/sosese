// Fabrique de configuration des variantes d'exploration (V4, V5, V6). Chacune est une page unique compilée
// sous /vN, avec les mêmes dépendances, les mêmes tokens et les composants de la V3 (src/). Seul le dossier
// des pages change : variantes/vN/pages.
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export const configVariante = (nom) =>
  defineConfig({
    site: "https://sosese.tech",
    output: "static",
    base: `/${nom}`,
    srcDir: `./variantes/${nom}`,
    publicDir: "./public",
    outDir: `./dist/${nom}`,
    integrations: [react()],
    vite: {
      plugins: [tailwindcss()],
      // Même règle que la V3 : scripts toujours en fichier externe (DESIGN.md, « Décisions »).
      build: { assetsInlineLimit: (chemin) => (chemin.endsWith(".js") ? false : null) },
    },
  });
