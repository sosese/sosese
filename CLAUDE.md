# sosese — site vitrine

## Contraintes de travail
- Développement **local uniquement**. Aucun accès au VPS, jamais.
  Pas de `ssh`, `scp`, `rsync`, ni de commande docker visant une machine distante.
- Le déploiement est fait à la main par l'humain. Tu ne déploies pas.
- Ne jamais lire, créer ni modifier `.env`. Seul `.env.example` existe dans le repo.
- Référence complète : §7.0 du cahier des charges.

## Règles de code
- Lire `DESIGN.md` avant toute modification de composant ou de style.
- Aucune couleur, rayon ou espacement en dur : toujours un token de `tokens.css`.
- Tout est statique sauf les îlots React explicitement listés.
- Vérifier systématiquement le rendu dans les deux thèmes.

## Méthode
- Un lot à la fois. Ne pas démarrer le lot suivant sans validation explicite.
- Commit avant chaque changement structurel.

## Commandes
npm run dev / npm run build / npm run preview
