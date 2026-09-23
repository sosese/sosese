import { spawnSync } from "node:child_process";
// V1 vide dist puis écrit la racine ; chaque version suivante n'écrit que son dossier (dist/v2 … dist/v6).
// Toutes utilisent les mêmes dépendances verrouillées.
const builds = [
  ["build", "--root", "legacy-v1"],
  ["build", "--root", "legacy-v2"],
  ["build"],
  ...["v4", "v5", "v6"].map((v) => ["build", "--config", `astro.${v}.config.mjs`]),
];
for (const args of builds) {
 const result = spawnSync(process.execPath, ["node_modules/astro/astro.js", ...args], { stdio: "inherit" });
 if (result.status !== 0) process.exit(result.status ?? 1);
}
