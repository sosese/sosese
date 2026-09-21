import { spawnSync } from "node:child_process";
// V1 clears dist first; V2 then writes only dist/v2. Both use the same locked dependencies.
for (const args of [["build", "--root", "legacy-v1"], ["build"]]) {
 const result = spawnSync(process.execPath, ["node_modules/astro/astro.js", ...args], { stdio: "inherit" });
 if (result.status !== 0) process.exit(result.status ?? 1);
}
