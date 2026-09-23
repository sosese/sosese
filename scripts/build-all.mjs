import { spawnSync } from "node:child_process";
// V1 vide dist puis écrit la racine ; V2 écrit seulement dist/v2 ; V3 seulement dist/v3.
// Les trois utilisent les mêmes dépendances verrouillées.
for (const args of [["build", "--root", "legacy-v1"], ["build", "--root", "legacy-v2"], ["build"]]) {
 const result = spawnSync(process.execPath, ["node_modules/astro/astro.js", ...args], { stdio: "inherit" });
 if (result.status !== 0) process.exit(result.status ?? 1);
}
