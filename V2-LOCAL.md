# V2 locale — 21 septembre 2026

Branche : `codex/site-v2`.
Dossier : `/home/joris/.codex/worktrees/sosese-v2/sosese`.
Aperçu : http://127.0.0.1:4322/

## Livraison

Six pages commerciales : accueil, accompagnement, réalisation Atelier des Sols & Fils, éditeurs, à propos et contact. Direction visuelle conservée, composants du labo adaptés, preuve remontée sur l’accueil, proximité Metz + environ 80 km, parcours entreprise/éditeur distincts. Illustrations fictives signalées. Métadonnées sociales textuelles, sitemap et URL canoniques cohérentes.

La V1 et ses modifications locales restent dans `/home/joris/dev/sosese`. Aucun push ni déploiement. Aucun fichier .env consulté ou copié. Les prototypes complets copiés sont conservés hors du build dans `references/`, ignoré par Git ; leurs adaptations utilisées sont versionnées.

## Vérification

- Compilation Astro réussie.
- Six tests Node réussis : contrats entreprise/éditeur, erreurs de validation, anti-spam temporel explicite, limitation de débit, indisponibilité, refus SMTP, routes/liens/CSP/canonical/sitemap et mouvement réduit des deux illustrations.
- Les tests SMTP utilisent exclusivement un serveur simulé local, sans email externe.
- Vérification TypeScript et git diff --check réussies.
- Contrôles navigateur : thèmes clair/sombre, menu mobile et retour du focus avec Échap, validation du formulaire, conservation des champs en cas de 503, changement d’intention.
- Six pages examinées à 320, 768, 1024 et 1440 px. Débordement détecté à 320 px dans la démonstration client corrigé par retour à la ligne et suppression du double cadre.

## Relancer

Depuis ce dossier :

```sh
npm run build
npm test
env -u SMTP_HOST -u SMTP_PORT -u SMTP_USER -u SMTP_PASS -u MAIL_TO -u MAIL_FROM HOST=127.0.0.1 PORT=4322 NODE_ENV=development node server/index.mjs
```

Le formulaire de cet aperçu répond volontairement 503 : aucune messagerie réelle n’est configurée. La page fournit une alternative email. Pour modifier avec rechargement automatique : `npm run dev` ; son proxy API existant vise le port 3000.

## Points à compléter avec le porteur

- Parcours détaillé de Joris : LinkedIn exige une connexion. La page utilise uniquement les faits connus et un lien vers le profil fourni.
- Prix et conditions d’un éventuel diagnostic autonome ; aucune gratuité ni durée de livraison inventée.
- Méthodologie des durées client, rôle exact de Jason et sens précis du libellé « rapports d’analyse annuels » ; aucun résultat extrapolé.
- Image de partage dédiée : métadonnées textuelles présentes, sans image OG spécifique.
- Travail juridique séparé conformément à la demande. Avant publication, aligner notamment les champs de la politique de confidentialité avec le nouveau formulaire.
- Tests de compréhension avec prospects, suivi manuel des leads et acquisition : étapes commerciales à mener après revue de cette V2. Aucun traçage ajouté.

Les anciennes sections V1 non utilisées restent dans les sources pour référence ; les pages rendues emploient les nouveaux composants de `src/components/v2`. Les décisions techniques sont consignées dans DESIGN.md.
