# Livraison V1 + V2 + V3 dans le même conteneur

`/` sert la V1 (tag v0.8), `/v2/` la V2 figée, `/v3/` la V3. Aucun changement DNS, TLS ou Traefik. V2 et V3 sont
non indexées (HTML + en-tête HTTP). Contact V3 par email uniquement ; le formulaire de la V1 conserve son contrat.

Branche : `feat/site-v3` (worktree local `/home/joris/dev/sosese-v3`). Rien n'a été poussé, tagué ni déployé.

## Commandes locales

- `npm ci` puis `npm run build` : compile V1, V2 et V3 dans `dist`.
- `npm test` : 7 tests (contrat V1 et SMTP simulé, cohabitation V2, cohabitation V3, mouvement réduit).
- `npm run build && PORT=4330 npm start` : http://localhost:4330/v3/
- `npm run dev` : V3 seule sur http://localhost:4321/v3/, **avec les marqueurs « à compléter »** là où une information manque.
- Image : `docker build -t sosese:v3-local .`, puis même commande `docker run` que dans `V2-LOCAL.md` (remplacer v2 par v3).

## Publication (à faire par toi, après accord)

1. Relire la V3 en local et remplir ce que tu peux dans `src/config/site.ts` (voir `FICHE-ACTIONS-V3.md`).
2. Pousser la branche, ouvrir la PR, puis créer le tag proposé `v0.10-v3-preview.1`. Le workflow construit, teste
   (dont `/v3/`, `/v3/contact`, `/v3/og/accueil.png`, noindex) et publie `ghcr.io/sosese/sosese:v0.10-v3-preview.1`.

## Sur le VPS (toi uniquement), dans `/srv/sosese`

1. Relever le tag actuellement déployé dans `compose.yml` (rollback).
2. Sauvegarder `compose.yml` sous un nom daté.
3. Remplacer uniquement `image:` par `ghcr.io/sosese/sosese:v0.10-v3-preview.1`.
4. `docker compose pull web` puis `docker compose up -d --no-deps web`.
5. Vérifier : `/`, `/contact` (formulaire V1), `/v2/`, `/v3/`, `/v3/contact`, `/api/health`, et
   `curl -sI https://sosese.tech/v3/ | grep -i x-robots-tag` → `noindex, nofollow`.
6. Retour arrière : remettre le tag relevé et `docker compose up -d --no-deps web`.

## Bascule future de la V3 à la racine (pas maintenant)

`base: "/"` dans `astro.config.mjs`, retrait de `legacy-v1` du build, redirections des anciennes URL V1
(`/#methode`, `/#offre`, `/#cas-client`) et de `/v3/*`, retrait du `noindex`, ajout de `robots.txt` et
`sitemap.xml`, alignement de la politique de confidentialité. À faire dans une évolution dédiée.
