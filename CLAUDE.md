# sosese — site vitrine

Site de Joris (sosese) : assistants sur mesure pour artisans, indépendants et petites entreprises.
En production sur https://sosese.tech. Version déployée = tag de `image:` dans `compose.yml`.

## Documentation (rien d'autre à lire)
- `DESIGN.md` : front — règles, tokens, composants, sections, copy, décisions, pièges. **À lire avant toute modification.**
- `RUNBOOK.md` : architecture (serveur, image, CI), VPS et services voisins, publication, déploiement, diagnostic.
- `CHANGELOG.md` : versions et journal des déploiements.

## Stack
Astro 5 statique + Tailwind 4 + îlots React 19 → `dist/`, servi par Fastify 5 (`server/`) qui envoie aussi les
formulaires par SMTP. Image Docker publiée sur GHCR par GitHub Actions à chaque tag, déployée à la main sur un VPS
derrière Traefik. Aucune base de données.

## Où modifier quoi
| Quoi | Où |
|---|---|
| Sections de l'accueil | `src/components/sections/*.astro` (ordre dans `src/pages/index.astro`) |
| Pages | `src/pages/` |
| Composants | `src/components/ui/` (statiques), `ui/diagrams/` (schémas), `islands/` (React), `layout/` |
| FAQ | un fichier Markdown par question dans `src/content/faq/` |
| Navigation, CTA, email, mentions légales, cas client | `src/config/site.ts` (`null` = « à compléter », jamais de valeur inventée) |
| Règles du formulaire de contact (client et serveur) | `shared/contact.json` |
| Questions du questionnaire `/questionnaire` | `shared/questionnaire.json` |
| Couleurs, rayons, espacements, typo | `src/styles/tokens.css` ; utilitaires dans `src/styles/global.css` |
| Serveur, API | `server/index.mjs`, `server/questionnaire.mjs` |
| Publication, déploiement | `scripts/release.sh`, `scripts/deploy-vps.sh`, `compose.yml`, `.github/workflows/deploy.yml` |

## Contraintes de travail
- Développement **local uniquement**. Aucun accès au VPS : pas de `ssh`, `scp`, `rsync`, ni de docker distant.
  Production vérifiable seulement par requêtes HTTP publiques (curl, Lighthouse, axe).
- Le déploiement, les pushs, PR, merges et tags : uniquement par l'humain ou avec son accord explicite dans la session.
- Ne jamais lire, créer ni modifier `.env` (seul `.env.example` est versionné).
- Une évolution à la fois ; commit avant chaque changement structurel.

## Règles de code
- Aucune couleur, rayon ou espacement en dur : toujours un token.
- Tout est statique sauf les îlots listés dans `DESIGN.md` (`client:idle`) et les scripts natifs des composants
  listés (jamais `is:inline`).
- Tout composant, décision ou piège nouveau est ajouté à `DESIGN.md` dans le même tour, en une règle et sa raison,
  sans historique. Ce qui est retiré du code est retiré de la doc.

## Contrat de fin de tâche
- `npm run build` passe
- aucune valeur en dur hors `tokens.css`
- vérifié en thème clair ET sombre
- hiérarchie de titres cohérente, focus visible au clavier
- animations sous `prefers-reduced-motion`
- aucun jargon technique hors « Sous le capot »

## Commandes
- `npm run dev` : http://localhost:4321
- `npm run build && npm start` : serveur de production sur http://localhost:3000 (requis pour tester les formulaires)
- `docker compose -f compose.dev.yml up --build` : image locale + Mailpit (http://localhost:8025)
- `npm run release -- X.Y` puis `/srv/sosese/deploy.sh vX.Y` : **lancés par l'humain uniquement** (`RUNBOOK.md` §2, §3)
