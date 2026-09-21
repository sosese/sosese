# Livraison V1 + V2 dans le même conteneur

Architecture validée : `/` sert la V1 du tag v0.8 ; `/v2/` sert la V2. Aucun changement DNS, TLS ou Traefik. Le formulaire V2 est remplacé par un lien email ; celui de la V1 conserve son contrat API. La V2 porte noindex dans le HTML et les en-têtes HTTP et ne publie pas de sitemap.

Dossier : `/home/joris/.codex/worktrees/sosese-v2/sosese`.
Branche : `codex/site-v2`.

## Sources et commandes

- `legacy-v1/` : snapshot public du tag v0.8, origine exacte dans ORIGIN.md. Aucun secret copié. Le seul ajustement de configuration est le dossier de sortie.
- `src/` : V2, chemins sous `/v2/`.
- `npm run build` : compile V1 puis V2 dans un même `dist`.
- `npm test` : six tests couvrant contrat V1 et SMTP simulé local, erreurs, cohabitation, liens V2, non-indexation, absence de formulaire V2 et mouvement réduit.
- `docker build -t sosese:v2-local .` : image unique.
- Prévisualisation Docker locale : `docker run -d --name sosese-v2-preview --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges:true --memory 256m -p 127.0.0.1:4323:3000 sosese:v2-local`.
- Aperçu : http://127.0.0.1:4323/v2/ ; V1 : http://127.0.0.1:4323/.
- Arrêt de cet aperçu uniquement : `docker stop sosese-v2-preview`.

## Publication proposée, non effectuée

Tag proposé : `v0.9-v2-preview.1`. Après autorisation explicite de publication : pousser la branche et ce tag. Le workflow construit et teste l’image avant de publier `ghcr.io/sosese/sosese:v0.9-v2-preview.1`. Les tags de préversion ne remplacent plus `latest`.

## Sur le VPS, après disponibilité de l’image

À exécuter par le porteur dans `/srv/sosese`, en conservant le fichier d’environnement existant :

1. Vérifier que le Compose actuellement déployé utilise bien `ghcr.io/sosese/sosese:v0.8`. Si différent, conserver son tag réel pour le rollback et vérifier la V1 embarquée avant de poursuivre.
2. Sauvegarder compose.yml sous un nouveau nom daté sans écraser de sauvegarde existante.
3. Remplacer uniquement la valeur `image:` par `ghcr.io/sosese/sosese:v0.9-v2-preview.1`.
4. Exécuter `docker compose pull web`, puis `docker compose up -d --no-deps web`.
5. Vérifier `docker compose ps`, la racine publique, `/v2/`, `/v2/contact`, `/api/health` et l’en-tête `X-Robots-Tag` sur `/v2/`. Le formulaire de la V1 nécessite un test réel par le porteur ; la V2 ne doit afficher aucun formulaire.
6. Retour arrière : rétablir le tag précédemment relevé dans compose.yml et exécuter `docker compose up -d --no-deps web`.

Le serveur web sera brièvement redémarré ; aucune promesse de déploiement sans interruption. Ne modifier ni les réseaux ni les autres services. Aucun accès VPS, push ou tag effectué lors de cette préparation.

## Limites connues

- Parcours LinkedIn détaillé en attente d’accès ; faits connus seulement sur À propos.
- Pages légales laissées au chantier séparé demandé. La V2 est une préversion publique non indexable, pas une page privée.
- Le build npm signale des vulnérabilités dans les dépendances existantes (dont deux de sévérité élevée pour l’exécution). Aucun changement automatique de dépendances n’a été appliqué ; revue à prévoir avant publication.
- Les tests de compréhension, le suivi des leads, les conditions commerciales détaillées et la qualification des chiffres clients restent décrits dans le rapport d’audit initial.

## Recette de cette préparation

Build local, six tests et TypeScript réussis. Image Docker construite avec les dépendances verrouillées. Conteneur lancé en lecture seule, utilisateur node, 256 Mo, aucun secret SMTP fourni. Contact V2 et menu mobile vérifiés dans le navigateur, sans erreur console.
