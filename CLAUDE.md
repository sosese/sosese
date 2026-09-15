# sosese — site vitrine

## État du projet
- V1 en production sur https://sosese.tech. Image `ghcr.io/sosese/sosese`, version déployée = tag de `image:` dans `compose.yml`.
- Lots 0 à 5 du cahier des charges terminés. Le travail se fait désormais par évolutions : branche → PR → version → déploiement humain.

## Contraintes de travail
- Développement **local uniquement**. Aucun accès au VPS, jamais.
  Pas de `ssh`, `scp`, `rsync`, ni de commande docker visant une machine distante.
- Le déploiement est fait à la main par l'humain. Tu ne déploies pas.
- Production vérifiable uniquement par requêtes HTTP publiques (curl, Lighthouse, axe).
- Ne jamais lire, créer ni modifier `.env`. Seul `.env.example` existe dans le repo.
- Pousser, ouvrir ou merger une PR, créer ou pousser un tag : uniquement avec l'accord explicite de l'humain dans la session.
- Référence complète : §7.0 du cahier des charges.

## Documentation
- `DESIGN.md` : tokens, composants, conventions, décisions, pièges connus. **À lire avant toute modification.**
- `RUNBOOK.md` : modifier, publier, déployer, rollback, diagnostic, vérification de synchro.
- `cahier-des-charges-sosese-v1.2.md` : référence initiale. Quand `DESIGN.md` documente un écart, `DESIGN.md` prime.

## Où modifier quoi
- Textes des sections : `src/components/sections/*.astro` ; pages : `src/pages/`.
- FAQ et exemples : un fichier Markdown dans `src/content/faq/` ou `src/content/exemples/`.
- Navigation, email, mentions légales, personne : `src/config/site.ts` (`null` = « à compléter », jamais de valeur inventée).
- Règles du formulaire (client et serveur) : `shared/contact.json`.
- Couleurs, rayons, espacements, typo : `src/styles/tokens.css`.

## Règles de code
- Aucune couleur, rayon ou espacement en dur : toujours un token de `tokens.css`.
- Tout est statique sauf les îlots React explicitement listés dans `DESIGN.md` (en `client:idle`, voir pourquoi).
- Vérifier systématiquement le rendu dans les deux thèmes.
- Tout composant, décision ou piège nouveau est ajouté à `DESIGN.md` dans le même tour.

## Contrat de fin de tâche
- `npm run build` passe
- aucune valeur en dur hors `tokens.css`
- vérifié en thème clair ET sombre
- hiérarchie de titres cohérente, focus visible au clavier
- animations sous `prefers-reduced-motion`
- aucun jargon technique hors « Sous le capot »

## Méthode
- Une évolution à la fois. Ne pas démarrer la suivante sans validation explicite.
- Commit avant chaque changement structurel.

## Commandes
- `npm run dev` : http://localhost:4321
- `npm run build && npm start` : serveur Fastify de production sur http://localhost:3000 (requis pour tester le formulaire, y compris depuis `npm run dev`)
- `docker compose -f compose.dev.yml up --build` : image locale + Mailpit (http://localhost:8025)
