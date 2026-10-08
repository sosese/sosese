# CHANGELOG — sosese.tech

Versions publiées (tags `vX.Y`, image `ghcr.io/sosese/sosese:<tag>`) et déploiements en production.
Le détail des décisions est dans `DESIGN.md`, les procédures dans `RUNBOOK.md`.

## Journal des déploiements

À compléter après chaque `deploy.sh` (RUNBOOK §3.4) ou rollback (§4).

| Date | En ligne | Précédente | Remarque |
|---|---|---|---|
| 2026-10-09 | `v0.10` | `v0.9` | déployé par l'humain ; questionnaire vérifié en production (emails reçus, envoi jugé lent → `fix/envoi-plus-rapide`) |
| 2026-10-07 | `v0.9` | `v0.9-v2-preview.1` | premier déploiement par `deploy.sh` ; build du tag identique à la production (`/_astro`, `/`, `/contact`, `/questionnaire`) ; fin de la préversion v2 |
| 2026-09-21 ou après | `v0.9-v2-preview.1` | `v0.8` | préversion déployée à la main hors de `main`, non consignée à l'époque (constatée le 2026-10-07) |
| 2026-09-15 | `v0.2` | — | première mise en production |

Déploiements entre `v0.2` et `v0.8` : non consignés.

## Non publié

- `fix/envoi-plus-rapide` — **envois plus rapides** (questionnaire et contact). L'accusé de réception du
  questionnaire part après la réponse au visiteur, qui attendait deux envois SMTP de suite (4 à 5 s en production
  après la v0.10) ; la connexion SMTP reste ouverte entre deux envois (`pool`, une connexion). Mesuré en local avec
  un SMTP ralenti de 250 ms par réponse : questionnaire avec email 3,1 s → 1,05 s (1,6 s après une longue
  inactivité), contact 1,05 s. L'accusé n'est toujours envoyé qu'après le succès de l'email des réponses ; un
  arrêt du conteneur attend les accusés en cours.

## v0.10 — 2026-10-08

« Amélioration générale du site => moins geek ». PR #17, #18, #19.

- `fix/deploy-tag-preversion` : `deploy.sh` accepte les tags de préversion (`vX.Y-suffixe`), en version en ligne
  comme en cible de rollback. La copie du VPS est déjà à jour.
- Documentation : `RUNBOOK.md` réorganisé autour des scripts (§2 publier, §3 déployer, §4 rollback, §5 préversion),
  ce journal, contrôle de `www` en GET (Traefik répond 308 en HEAD).
- **Un site plus humain, moins geek** (`feat/site-moins-geek`) :
  - **Voix** : tout le site parle à la première personne (« je »), pour les artisans, indépendants et petites
    entreprises ; « l'assistant » est le seul nom de ce que je construis ; plus de jargon hors « Sous le capot »
    (« IA » seulement dans la FAQ et la carte Confiance).
  - **Hero** : « Vous me parlez de votre métier. Je construis l'assistant qui s'occupe du reste. », titre SEO aligné,
    titre par défaut de `site.ts` repris ; sur téléphone, plus de « Parlons-en » dans le hero (le bouton flottant
    en tient lieu).
  - **Offre** en trois assistants (commercial, chiffres, saisie) ; **Méthode** raccourcie, cadres alignés.
  - **Clients** : le témoignage de Jason (L'Atelier des Sols & Fils) au centre — citation, devis 25 min → 3 min en
    barres, ≈ 4 h gagnées par semaine, avant → aujourd'hui ; compteurs retirés ; démonstration ramenée à un devis
    en trois temps.
  - **Visuel** : titres en Inter semi-gras, serif réservée au témoignage, mono limitée à « Sous le capot » ; accent
    `#AC4F08`, fond doux plus chaud, cartes bordure + ombre légère, boutons en pilule, eyebrows de section en accent ;
    décor allégé.
  - **Sous le capot** : planche animée « Le protocole, de bout en bout » dans le volet « La pile technique en
    détail », affichée à partir de `lg` (une phrase renvoie au grand écran en dessous) ; pause, arrêt hors écran,
    état final sous mouvement réduit.
  - **Questionnaire** : sans l'encart « Avant de commencer », colonne centrée, mention de confidentialité ; le
    changement d'étape garde la carte à l'écran.
  - **`/contact`** : zone d'intervention renseignée (Metz, France et Europe).
  - Audits avant publication (`DESIGN.md` § « Audits locaux ») : Lighthouse `/` 98–99 / 100 / 100 / 100, CLS 0 ;
    axe 0 violation WCAG.

## v0.9 — 2026-10-07

« Mise en place script déploiement, questionnaires prospect et simplification website ». PR #14, #15, #16.

- **Questionnaire prospects** sur `/questionnaire` (`noindex`, hors navigation) : 6 étapes, ~6 minutes, règles dans
  `shared/questionnaire.json` ; accessible depuis `/contact` par un bouton principal sous le chapeau ; envois plus
  robustes. Test de démarrage de la CI étendu à `/questionnaire`.
- **Accueil simplifié** : hero en texte seul, cas client remonté en 2e position, section « Constat » fondue dans
  l'offre, hero et bandeau d'engagements reformulés. Les visuels retirés (`AgentEnAction`, `VracEnActions`) sont
  conservés dans le code, non utilisés.
- **Scripts de publication et de déploiement** : `npm run release -- X.Y` (`scripts/release.sh`) et
  `scripts/deploy-vps.sh`, installé sur le VPS sous `/srv/sosese/deploy.sh`, avec rollback automatique.
  Aucun déploiement depuis GitHub Actions.

Remplace en production la préversion `v0.9-v2-preview.1`.

## v0.9-v2-preview.1 — 2026-09-21 (préversion)

Branche `codex/site-v2`, hors de `main`. « V1 plus V2 preview under /v2, form disabled, runtime security fixes ».
Retirée de la production le 2026-10-07 ; branche et image conservées. Retour possible :
`/srv/sosese/deploy.sh v0.9-v2-preview.1`.

## Versions antérieures

| Tag | Date | Contenu |
|---|---|---|
| `v0.8` | 2026-09-20 | nouveau visuel de hero, accueil resserré |
| `v0.7` | 2026-09-17 | contenu de la `v0.6` avec les dépendances de la `v0.5` |
| `v0.6` | 2026-09-17 | **jamais publiée** (test de démarrage en échec, piège 19) : hero sombre, méthode animée, cas client enchaîné, offre développée |
| `v0.5` | 2026-09-15 | terminal du hero animé pour tous |
| `v0.4` | 2026-09-15 | cas client, terminal du hero corrigé, dépendances de la `v0.2` rétablies |
| `v0.3` | 2026-09-15 | **jamais publiée** (piège 19) : cas client L'Atelier des Sols, terminal du hero corrigé |
| `v0.2` | 2026-09-15 | première mise en production : corrections des audits, politique de confidentialité |
| `v0.1` | 2026-09-15 | première image : accueil, pages internes, serveur |
