# CHANGELOG — sosese.tech

Versions publiées (`ghcr.io/sosese/sosese:<tag>`) et déploiements. Le détail est dans git (`git log vA..vB`).

## Journal des déploiements

Une ligne par `deploy.sh` ou rollback (RUNBOOK §3.2, §4).

| Date | En ligne | Précédente | Remarque |
|---|---|---|---|
| 2026-10-09 | `v0.10` | `v0.9` | questionnaire vérifié en production |
| 2026-10-07 | `v0.9` | `v0.9-v2-preview.1` | premier déploiement par `deploy.sh` ; build du tag identique à la production |
| 2026-09-21 env. | `v0.9-v2-preview.1` | `v0.8` | préversion hors de `main`, non consignée à l'époque |
| 2026-09-15 | `v0.2` | — | première mise en production |

## Non publié

- Documentation resserrée (`CLAUDE.md`, `DESIGN.md`, `RUNBOOK.md`), composants et CSS non utilisés supprimés.

## Versions

| Tag | Date | Contenu |
|---|---|---|
| `v0.11` | 2026-10-09 | envois plus rapides : accusé de réception après la réponse, connexion SMTP gardée ouverte |
| `v0.10` | 2026-10-08 | site « moins geek » : voix en « je », offre en trois assistants, témoignage de Jason, sobriété visuelle, planche du protocole ; `deploy.sh` accepte les préversions |
| `v0.9` | 2026-10-07 | questionnaire prospects, hero en texte seul, scripts `release.sh` / `deploy-vps.sh` |
| `v0.9-v2-preview.1` | 2026-09-21 | préversion hors de `main` (branche `codex/site-v2`) |
| `v0.8` | 2026-09-20 | nouveau visuel de hero, accueil resserré |
| `v0.7` | 2026-09-17 | contenu de la `v0.6` avec les dépendances de la `v0.5` |
| `v0.6` | 2026-09-17 | **jamais publiée** (test de démarrage en échec, piège 13) |
| `v0.5` | 2026-09-15 | terminal animé pour tous |
| `v0.4` | 2026-09-15 | cas client, dépendances de la `v0.2` rétablies |
| `v0.3` | 2026-09-15 | **jamais publiée** (piège 13) |
| `v0.2` | 2026-09-15 | première mise en production |
| `v0.1` | 2026-09-15 | première image |
