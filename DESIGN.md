# DESIGN.md — sosese

## Règles non négociables
- Aucune couleur, rayon ou espacement en dur. Toujours un token.
- Une seule couleur d'accent. Jamais deux accents dans un même écran.
- --accent-bright n'est jamais une couleur de texte sur fond clair.
- Bordures 1px sur --border. Ombres réservées aux éléments flottants.
- Tout doit être vérifié dans les deux thèmes avant d'être considéré comme fini.
- Toute animation respecte prefers-reduced-motion.
- Aucun texte technique hors de la section "Sous le capot".
- Les composants interactifs sont des îlots React. Tout le reste est statique.

## Tokens
Source unique : `src/styles/tokens.css`. Ils sont exposés à Tailwind dans `src/styles/global.css`
(`bg-bg`, `bg-surface`, `text-ink`, `text-ink-muted`, `border-border`, `bg-accent`, `text-on-accent`,
`rounded-md`, `shadow-md`, `text-14`, `font-mono`…). La palette, les rayons, les ombres, les tailles de texte
et les familles de polices par défaut de Tailwind sont désactivés : une classe comme `bg-red-500` ou `text-sm`
ne produit rien (et sans erreur, voir « Pièges »).

```css
:root {
  /* Base — thème clair */
  --bg:            #FCFBF9;
  --bg-subtle:     #F5F2ED;
  --surface:       #FFFFFF;
  --ink:           #14110E;
  --ink-muted:     #6B6259;
  --border:        rgba(20,17,14,0.10);
  --border-strong: rgba(20,17,14,0.18);

  /* Accent ambre */
  --accent:        #B45309; /* texte, bordures, fond de bouton (blanc dessus = 5:1) */
  --accent-hover:  #92400E;
  --accent-bright: #F59E0B; /* décoratif uniquement : traits, glows, icônes */
  --accent-soft:   rgba(217,119,6,0.12);
  --on-accent:     #FFFFFF;

  /* Rayons */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-full: 999px;

  /* Ombres — usage rare, éléments flottants uniquement */
  --shadow-sm: 0 1px 2px rgba(20,17,14,0.06);
  --shadow-md: 0 8px 24px rgba(20,17,14,0.10);
}

[data-theme="dark"] {
  --bg:            #0F0D0B;
  --bg-subtle:     #17130F;
  --surface:       #1C1713;
  --ink:           #F5F1EC;
  --ink-muted:     #A19788;
  --border:        rgba(255,255,255,0.09);
  --border-strong: rgba(255,255,255,0.16);

  --accent:        #F59E0B;
  --accent-hover:  #FBBF24;
  --accent-bright: #FBBF24;
  --accent-soft:   rgba(245,158,11,0.14);
  --on-accent:     #14110E;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.5);
}

/* Sections invert : sombres dans les deux thèmes.
   Complété par rapport au cahier des charges : border-strong et accent-hover/bright/soft
   sont redéfinis, sinon le thème clair fuit dans la section (survol #92400E sur fond sombre). */
.section-invert {
  --bg: #0F0D0B; --bg-subtle: #17130F; --surface: #1C1713;
  --ink: #F5F1EC; --ink-muted: #A19788;
  --border: rgba(255,255,255,0.09); --border-strong: rgba(255,255,255,0.16);
  --accent: #F59E0B; --accent-hover: #FBBF24; --accent-bright: #FBBF24;
  --accent-soft: rgba(245,158,11,0.14); --on-accent: #14110E;
}
```

Tokens complémentaires dans `tokens.css` :

| Groupe | Tokens |
|---|---|
| Typographie | `--font-sans`, `--font-mono`, `--text-12` … `--text-64`, `--text-body` (17px), `--leading-body` (1.6), `--leading-tight` (1.15), `--measure` (70ch) |
| Espacement / gabarit | `--space-unit`, `--section-y`, `--gutter`, `--container`, `--header-h`, `--fab-offset`, `--fab-clearance`, `--dot-gap` (pas de la trame DotPattern) |
| Mouvement | `--duration-fast` (150ms), `--duration-base` (200ms), `--duration-slow` (300ms), `--ease-out` — les durées passent à 0 sous `prefers-reduced-motion` |
| Boucles décoratives | `--duration-blink` (curseur du terminal), `--duration-loop` (impulsions du FlowDiagram) — jamais ramenées à 0 : les animations sont déclarées dans `@media (prefers-reduced-motion: no-preference)` |

### Contrastes vérifiés (WCAG AA, texte normal ≥ 4.5:1)
| Couple | Clair | Sombre / invert |
|---|---|---|
| ink / bg | 18.19 | 17.25 |
| ink-muted / bg | 5.77 | 6.74 |
| ink-muted / bg-subtle | 5.35 | 6.42 |
| ink-muted / surface | 5.97 | 6.18 |
| accent / bg (texte accent) | 4.86 | 9.03 |
| accent / surface | 5.02 | — |
| on-accent / accent (bouton) | 5.02 | 8.76 |
| on-accent / accent-hover | 7.09 | 11.27 |
| **accent / accent-soft** | **4.28 ✗** | 7.28 |
| **accent / bg-subtle** | **4.49 ✗** (axe) | 6.42 |
| accent-hover / bg-subtle | 6.35 | — |

Conséquences :
- sur un fond `--accent-soft`, le texte est `--ink`, jamais `--accent` (cas du Badge accent) ;
- sur un fond `--bg-subtle`, pas de texte `--accent` : fond `--bg` ou `--surface` à la place (numéros du FlowDiagram),
  ou `--accent-hover` pour un état de survol (questions de la FAQ). Exemptés : le point du wordmark (logotype) et les
  « ✓ » décoratifs en `aria-hidden`.
Tout nouveau couple texte / fond doit être recalculé dans les deux thèmes avant usage.

## Thème
- `data-theme="light" | "dark"` sur `<html>`, posé par le script inline en tête de `<head>` (`Base.astro`)
  avant tout rendu : choix mémorisé (`localStorage`, clé `theme`), sinon préférence système.
- Sans choix mémorisé, un changement de préférence système est suivi en direct.
- Chaque thème fixe aussi `color-scheme` (barres de défilement, contrôles natifs).
- Variante Tailwind `dark:` branchée sur `data-theme`, à réserver aux cas où un token ne suffit pas
  (ex. icône soleil / lune).

## Typographie
Inter (titres, corps) / JetBrains Mono (labels, chiffres, terminal).
Échelle : 12 14 16 18 21 28 36 48 64. Corps 17px, line-height 1.6.
- Fichiers : `public/fonts/inter-var.woff2` et `jetbrains-mono-var.woff2`, polices **variables**, sous-ensemble
  **latin** de Fontsource (couvre é, à, œ, €, guillemets et tirets typographiques). Licences OFL à côté.
- Un seul fichier par famille couvre toutes les graisses : ce sont ces deux fichiers qui sont préchargés.
- Noms de famille déclarés : `"Inter"` et `"JetBrains Mono"` (et non `"Inter Variable"`).
- Police de secours **`"Inter Fallback"`** (Arial / Liberation Sans / Helvetica locales) avec `size-adjust` et
  `ascent/descent/line-gap-override` mesurés sur `inter-var.woff2` : l'arrivée d'Inter ne change pas la taille du
  texte (pas de saut, pas de second LCP). **Remplacer le fichier Inter = remesurer ces valeurs.**
- Pas d'italique chargée. En ajouter une = nouveau fichier + `@font-face`, pas de faux italique.
- Titres `h1`–`h4` : `line-height: var(--leading-tight)`, `letter-spacing: -0.02em`, `text-wrap: balance`.
- Capitales réservées aux eyebrow labels (utilitaire `eyebrow` : mono, 12px, capitales, `--ink-muted`).

## Espacement
- Unité : `--space-unit` = 0.25rem (4px). Tailwind est rebranché dessus (`--spacing`) : `p-4` = 16px, `gap-2` = 8px.
- **Padding, marge et gap : pas entiers uniquement** (`px-2`, `gap-3`…), donc toujours un multiple de 4.
  Les demi-pas (`px-2.5`, `gap-1.5`) sont interdits pour l'espacement.
- Demi-pas tolérés hors espacement : micro-déplacements au survol (`translate-y-0.5` = 2px) et tailles
  de pastilles (`size-1.5` = 6px).
- Hauteurs de contrôles : `h-6` badge, `h-8` / `h-10` / `h-12` boutons sm / md / lg, `h-14` bouton flottant.
  Icônes `size-5` dans des zones cliquables `size-10` (40px).

| Token | Mobile | ≥ 768px | Usage |
|---|---|---|---|
| `--section-y` | 64px | 96px | rythme vertical des sections → `py-(--section-y)` |
| `--gutter` | 20px | 32px | marge latérale du conteneur |
| `--container` | 72rem | 72rem | largeur max → utilitaire `container-site` |
| `--header-h` | 64px | 64px | hauteur du header et du header du menu mobile ; sert aussi au `scroll-padding-top` des ancres |
| `--fab-offset` | 16px | — | distance du bouton flottant au bord (+ `env(safe-area-inset-*)`) |
| `--fab-clearance` | 88px | — | espace réservé en bas du footer pour ne pas être masqué par le bouton flottant |

## Mouvement
- Transitions : `duration-(--duration-fast)` pour couleurs et boutons, `duration-(--duration-base)` pour les cartes,
  toujours avec `ease-out` (= `--ease-out`).
- Toute transformation (translate, scale) est préfixée `motion-safe:` ; les durées tombent en plus à 0 sous
  `prefers-reduced-motion`. Défilement doux activé seulement si le mouvement est autorisé.
- `transition-[…]` liste explicitement les propriétés animées, jamais `transition-all`.

## Accessibilité (acquis du Lot 0)
- Lien d'évitement « Aller au contenu » → `#contenu` (`<main tabindex="-1">`).
- Focus : `outline 2px var(--accent)`, offset 2px, global sur `:focus-visible`. Ne jamais le retirer.
- Icône seule = `aria-label` explicite, SVG en `aria-hidden`. Flèches décoratives « → » en `aria-hidden`.
- Lien de navigation de la page courante : `aria-current="page"`, stylé via `aria-[current=page]:`.
- Chaque `<nav>` porte un `aria-label` ou `aria-labelledby`.

## Conventions de nommage et d'organisation
| Élément | Convention |
|---|---|
| Primitives statiques | `src/components/ui/*.astro`, PascalCase |
| Éléments de gabarit | `src/components/layout/*.astro` (Header, Footer, MobileCta) |
| Îlots React | `src/components/islands/*.tsx`, export par défaut, PascalCase |
| Sections de l'accueil (Lot 1) | `src/components/sections/*.astro`, noms du §6.3 |
| Contenus de navigation, CTA, email | `src/config/site.ts` (`site`, `mainNav`, `legalNav`, `cta`) — jamais en dur dans un composant |
| Tokens CSS | kebab-case, sans préfixe (`--ink-muted`), tailles de texte nommées par leur valeur en px (`--text-21`) |
| Utilitaires Tailwind issus des tokens | `--color-X` → `bg-X` / `text-X` / `border-X` (d'où `bg-bg`, `border-border`) ; `--text-21` → `text-21` |
| Token sans utilitaire dédié | syntaxe variable de Tailwind 4 : `py-(--section-y)`, `h-(--header-h)`, `max-w-(--measure)` |
| Utilitaires maison | `@utility` dans `global.css` : `container-site`, `eyebrow`, `fab-position` |
| Groupes de survol | nommés : `group/button`, `group/card` → `group-hover/card:text-accent` |
| Props de variantes | `variant` (apparence), `size` (sm/md/lg), `href` bascule le rendu en `<a>`, `class` fusionnée via `class:list` |
| Ancres | en français, sans accent : `#methode`, `#offre`, `#contenu` |
| Textes d'interface | en français, y compris `aria-label` et commentaires |
| Wordmark | `sosese<span class="text-accent">.</span>` — point en `--accent` (texte), pas `--accent-bright` |

## Composants disponibles
| Composant | Fichier | Type / API |
|---|---|---|
| Button | `ui/Button.astro` | statique — `variant` primary/secondary/ghost, `size` sm/md/lg, `href` → `<a>`, sinon `<button type="button">` |
| Card | `ui/Card.astro` | statique — `interactive` (implicite si `href`), `padding` md/lg, `href` → `<a>` |
| Badge | `ui/Badge.astro` | statique — `variant` neutral/accent, `dot` (pastille `--accent-bright`), `w-fit` (ne s'étire pas dans un flex en colonne) |
| SectionHeading | `ui/SectionHeading.astro` | statique — `id` (pour `aria-labelledby` de la section), `eyebrow`, `title` (h2), slot = chapeau |
| FlowDiagram | `ui/FlowDiagram.astro` | statique — `steps`, `label` ; vertical < lg, horizontal ≥ lg ; impulsion CSS sur les liaisons, masquée sous mouvement réduit |
| TerminalDemo | `islands/TerminalDemo.tsx` | îlot React, `client:idle` — voir « Terminal » |
| PageHeader | `ui/PageHeader.astro` | statique — en-tête des pages internes : `eyebrow`, `title` (**h1**), slot = chapeau |
| ACompleter | `ui/ACompleter.astro` | statique — marqueur visible d'un contenu non fourni (§9), `label` |
| ContactForm | `islands/ContactForm.tsx` | îlot React, `client:idle` — voir « Formulaire de contact » |
| Accordion | `ui/Accordion.astro` | statique — `<details>` / `<summary>` natif, `title`, `name` optionnel (ouverture exclusive), slot = réponse. Zéro JS |
| DotPattern | `ui/DotPattern.astro` | statique — trame de points masquée en radial ; **sections invert uniquement**, parent `relative overflow-hidden`, contenu en `relative` |
| Header | `layout/Header.astro` | statique — sticky, fond plein (pas de `backdrop-filter`), nav + CTA ≥ md, menu < md |
| Footer | `layout/Footer.astro` | statique — navigation, légal, contact (LinkedIn affiché seulement si `site.linkedin` est renseigné) |
| MobileCta | `layout/MobileCta.astro` | statique — bouton flottant « Parlons-en » en bas à droite, < md uniquement, toujours visible, masqué sur `/contact` |
| ThemeToggle | `islands/ThemeToggle.tsx` | îlot React, `client:idle` |
| MobileNav | `islands/MobileNav.tsx` | îlot React, `client:idle`, plein écran via `<dialog>` modal |
| Base | `layouts/Base.astro` | props `title`, `description`, `noindex` ; script anti-flash, préchargement polices, canonical |

Sections de l'accueil (`src/components/sections/`), dans l'ordre : Hero, Engagements, Probleme, Methode (`#methode`),
BentoOffre (`#offre`), Exemples (`#exemples`), SousLeCapot (invert), Confiance (`#confiance`), Faq (`#faq`),
CtaFinal (invert). Chaque section : `<section aria-labelledby>` + `py-(--section-y)` + `container-site` ;
un h2 via SectionHeading, des h3 au plus. Alternance de fond : `bg-bg` / `bg-bg-subtle` bordé `border-y`.
- **Sections invert** : `.section-invert` + `border-y border-border`. Sans bordure, elles se confondent avec le
  fond de page en thème sombre et le rythme vertical disparaît.

### Pages internes
`/a-propos`, `/contact`, `/mentions-legales`, `/confidentialite`, `404` (`noindex`, produit `404.html` pour le
fallback Fastify du §6.4). Structure : `PageHeader` puis contenu dans `container-site` + `py-(--section-y)`.
Textes longs (pages légales) : utilitaire **`prose-site`** sur un conteneur, HTML simple dedans (`h2`, `h3`, `p`,
`ul`, `dl`, `a`, `strong`) — pas de classes sur chaque balise.

### Contenus non fournis (§9)
- Valeurs bloquantes centralisées dans `src/config/site.ts` (`legal`, `personne`, `zoneIntervention`) ; `null` = non fourni.
- **Jamais de valeur inventée.** Pages légales : `<ACompleter>` rendu dans tous les environnements, et le build
  liste les champs manquants des mentions légales (`console.warn`). Pages vitrines (`personne`, zone
  d'intervention) : bloc affiché avec marqueur en dev, **masqué en production** tant que la valeur est `null`.

### Formulaire de contact
- Règles partagées client / serveur dans **`shared/contact.json`** (secteurs, puces, limites, champ piège, durée
  minimale, regex email et téléphone). `src/lib/contact.ts` les expose au front ; `server/index.mjs` construit son
  schéma zod à partir du même fichier. Modifier une règle = modifier ce JSON, jamais l'un des deux côtés seul.
- Charge utile JSON : `nom`, `societe`, `email`, `telephone`, `secteur`, `irritants` (puces concaténées par « , »),
  `message`, `consentement: true`, `site_web` (piège, vide), `dureeRemplissage` (ms, le serveur refuse < 3 s).
- Obligatoires : nom, société, email, secteur, consentement. Facultatifs, et libellés « (facultatif) » : téléphone,
  puces, message.
- `noValidate` + validation React : `aria-invalid`, message relié par `aria-describedby`, focus sur le premier
  champ en erreur, erreur effacée à la modification du champ.
- États : `idle` / `sending` (bouton désactivé, `role="status"`) / `success` (panneau qui reçoit le focus) /
  `error` (`role="alert"` toujours présent dans le DOM, champs conservés, **email de repli affiché**).
- Puces : cases à cocher `sr-only` dans des `<label>` stylés par `has-checked:` et `has-focus-visible:` — zéro état React.
- **Erreurs en `--accent`** (bordure et texte) : pas de rouge, une seule couleur d'accent. Texte d'erreur : `text-accent`
  sur `surface` = 5.02:1 en clair. Le message reste compréhensible sans la couleur (préfixe « ! » et texte explicite).
- `action="/api/contact" method="post"` sur le `<form>` : sans JS, les données partent dans le corps (jamais dans
  l'URL) et le serveur répond 415 — le serveur n'accepte que du JSON, choix assumé en V1.
- En dev, Vite relaie `/api` vers `http://127.0.0.1:3000` : lancer `npm run build && npm start` à côté de
  `npm run dev` pour tester l'envoi. Sans serveur, l'état `error` est le comportement attendu.

### Serveur (`server/index.mjs`)
| Route / comportement | Détail |
|---|---|
| Fichiers statiques | `dist/` ; `/contact` servi sans redirection (réécriture vers `/contact/`) ; 404 → `404.html` avec statut 404 ; `/api/*` inconnu → JSON 404 |
| Cache (§7.8) | `/_astro/*` : `immutable, max-age=31536000` · HTML : `no-cache` · polices et autres : `max-age=604800` |
| Compression | Brotli / gzip **dans Fastify** → **ne pas l'activer dans Traefik** (Lot 5) |
| `GET /api/health` | `{ ok: true }` |
| `POST /api/contact` | JSON uniquement · zod · 5 requêtes / 10 min / IP · `200 {ok:true}` · `400 {erreur:"validation", champs}` · `429` · `502` échec SMTP · `503` SMTP non configuré |
| Anti-spam | champ piège rempli ou remplissage < 3 s → `200 {ok:true}` **sans envoi** (le robot n'apprend rien) |
| Sécurité | helmet ; CSP `script-src 'self'` + empreintes sha256 des scripts inline, calculées au démarrage depuis `dist/` ; HSTS et `upgrade-insecure-requests` en production seulement ; retours à la ligne refusés dans les champs d'une ligne (injection d'en-têtes) |
| Journaux | aucune ligne par requête (ni IP ni URL) ; seulement démarrage, envoi / ignoré / échec SMTP, sans données du formulaire |
| Proxy | `trustProxy: 1` : l'IP du rate limit est celle vue par Traefik |

- La CSP dépend du HTML construit : **tout script inline ajouté au site est pris en compte au redémarrage**, sans
  configuration. Un script externe (autre domaine) serait bloqué — c'est voulu (§11, aucune requête tierce).
- Email : texte brut, `Reply-To` = le demandeur, sujet « Demande de contact — {société} ».
- SMTP : port 465 → TLS implicite ; 587 → STARTTLS obligatoire ; autre port (ex. Mailpit 1025) → sans TLS.

### Docker
- `Dockerfile` multi-stage (§7.3) : Astro, React et Tailwind sont en `devDependencies`, l'image finale n'installe
  que Fastify, nodemailer et zod. Copie de `dist/`, `server/`, `shared/`. `USER node`, healthcheck sans curl.
- `compose.dev.yml` (projet `sosese-dev`, ports liés à `127.0.0.1`) : service `web` + **Mailpit** (SMTP de test,
  interface sur http://localhost:8025). Sans `.env`, les emails vont dans Mailpit ; avec un `.env` local, Compose
  l'interpole et l'envoi devient réel.
- `.dockerignore` exclut `.env*` (sauf l'exemple), `.git`, `.claude`, `node_modules`, `dist`.

### Chaîne de livraison (`.github/workflows/deploy.yml`)
- Déclenchée **uniquement par un tag `v*`** poussé sur GitHub. Aucun secret de déploiement, aucun accès au VPS.
- Étapes : build `linux/amd64` → **test de démarrage** du conteneur (`read_only`, `tmpfs`, 256 Mo, sans SMTP :
  `/api/health`, `/`, `/contact` en 200, 404, utilisateur `node`, healthcheck `healthy`) → publication seulement si
  le test passe.
- Image : `ghcr.io/sosese/sosese:<tag>` et `:latest`, avec labels OCI (source, révision, version).
- Écarts assumés avec le §7.3 : ajout de `docker/setup-buildx-action` (sans lui, le cache `type=gha` échoue) et du
  test de démarrage ; `<user>` remplacé par `github.repository`.
- Le paquet GHCR est **privé** à sa création : `docker login ghcr.io` (jeton GitHub avec `read:packages`) est
  nécessaire pour tirer l'image, en local comme sur le VPS.
- VPS en ARM (`uname -m` = `aarch64`) : ajouter `linux/arm64` à `platforms`.
- Versions : le tag `vX.Y` correspond à `version` dans `package.json` (`X.Y.0`). Un tag = une mise en production =
  l'unité de rollback (§7.2).

### Mise en production (`compose.yml`)
- Utilisé **uniquement sur le VPS**, dans `/srv/sosese`, par l'humain. Jamais lancé depuis la session de code.
- Écarts avec le §7.4 : image au **tag figé** (`:v0.1`, pas `:latest`, pour qu'un `pull` ne change jamais de version
  en silence ; mise à jour et rollback = changer ce tag), `cap_drop: [ALL]` et `pids_limit: 100` en plus. Aucun
  middleware de compression Traefik (Fastify compresse).
- Les valeurs `A_RENSEIGNER_*` (réseau Traefik, entrypoint HTTPS, certresolver) viennent du pré-vol §7.5.
  `grep -n A_RENSEIGNER compose.yml` doit être vide avant le premier `up`.

### Audits locaux (Lot 5, avant mise en production)
Lighthouse 12 mobile (4G simulée) et axe-core 4.13, sur l'image servie par `server/index.mjs` :
| Page | Perf | A11y | Bonnes pratiques | SEO | LCP | CLS | JS |
|---|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 | 1,5 s | 0 | 75 ko |
| `/contact` | 100 | 100 | 100 | 100 | 1,7 s | 0 | 77 ko |
| `/a-propos` | 100 | 100 | 100 | 100 | 1,5 s | 0 | 73 ko |
| `/mentions-legales` | 100 | 100 | 100 | 100 | 1,7 s | 0 | 73 ko |

axe : **0 violation** sur les 6 pages dans les deux thèmes (FAQ ouverte) et sur le menu mobile ouvert. Aucune requête
tierce. À refaire en production (§10 Lot 5) : TTFB et TLS réels, Traefik en frontal.

### Contenus éditables (Content Collections)
Schémas dans `src/content.config.ts`. Ajouter un élément = créer **un seul fichier Markdown**, rien d'autre.
| Collection | Dossier | Frontmatter | Corps |
|---|---|---|---|
| `faq` | `src/content/faq/*.md` | `question`, `ordre` | réponse en Markdown (paragraphes) ; aussi injectée en texte brut dans le JSON-LD `FAQPage` |
| `exemples` | `src/content/exemples/*.md` | `titre`, `avant`, `apres`, `gain`, `ordre` | vide |

Les exemples sont **illustratifs** et présentés comme tels dans la section (§5 ligne 6) ; `gain` est un ordre
de grandeur, jamais un résultat client. Le nom de fichier sert d'identifiant, en kebab-case sans accent.

**Bento** : pas de composant BentoGrid / BentoCard. Une grille `md:grid-cols-3 md:grid-rows-2` et des `Card`
suffisent (grande carte `md:col-span-2 md:row-span-2`). À extraire seulement si un second bento apparaît.

### Terminal
- L'état initial (SSR, sans JS, mouvement réduit) est l'**état final** complet : pas de flash à l'hydratation,
  la boucle démarre par la tenue de l'état final (4 s), puis efface et retape (~12 s au total).
- Toutes les lignes sont toujours dans le DOM ; les parties non tapées sont en `invisible` : hauteur fixe, zéro CLS.
- Bloc animé en `aria-hidden`, transcription complète en `sr-only`.
- Pause : survol, bouton pause/lecture dans la barre de titre (WCAG 2.2.2, le survol seul ne suffit pas au
  clavier ni au tactile), hors viewport (`IntersectionObserver`). Sous mouvement réduit : pas de boucle, pas de bouton.
- Le terminal porte `.section-invert` : sombre dans les deux thèmes.

Prévus aux lots suivants : BorderBeam, DotPattern, Tabs, Accordion.
Toujours réutiliser avant de créer.

## Décisions et écarts par rapport au cahier des charges
- **`.section-invert` complétée** avec `--border-strong`, `--accent-hover`, `--accent-bright`, `--accent-soft`
  (absents du §3.3, fuite du thème clair sinon).
- **Badge accent en `text-ink`** au lieu de `text-accent` (contraste, voir tableau).
- **CTA mobile** : bouton flottant toujours visible (demande explicite), et non « après le premier scroll » (§4).
- **Hydratation : tous les îlots en `client:idle`** (ThemeToggle, MobileNav, TerminalDemo, ContactForm), au lieu du
  `client:visible` du §6.1. Mesuré au Lot 5 : tout îlot chargé avant l'affichage du titre (`client:load`, ou
  `client:visible` au-dessus de la ligne de flottaison) fait partir le runtime React (63 ko) tôt et porte le LCP
  mobile simulé à 2,0–2,1 s ; en `client:idle`, 1,5–1,7 s. Le HTML serveur de chaque îlot est déjà utilisable
  (thème posé par le script inline, terminal dans son état final, formulaire rendu) : rien ne change à l'écran avant
  l'hydratation. **Ne pas repasser un îlot en `client:load`** sans remesurer.
- **Menu mobile en `<dialog>` natif** : piège de focus, Échap et restitution du focus fournis par le navigateur,
  sans dépendance. Le défilement de la page est bloqué sur `<html>` à l'ouverture et rétabli sur l'événement `close`.
- **Coût du runtime React** : ~67 ko gzip dès qu'un îlot est présent (seuil §8.1 : 100 ko sur l'accueil).
  Il reste ~30 ko pour tous les autres îlots de l'accueil (terminal, Motion…) : à surveiller à chaque ajout.

## Exceptions connues aux valeurs en dur
Tolérées, à ne pas étendre sans raison :
- `letter-spacing` : `-0.02em` (titres), `0.08em` (eyebrow), `tracking-tight` (wordmark, gros titres).
- Anneau de focus : `2px` d'épaisseur et de décalage.
- `grid-cols-[2fr_1fr_1fr_1fr]` dans le footer (proportions de grille, pas un espacement).
- `max-w-xs` sur l'accroche du footer (échelle de largeurs Tailwind conservée).
- `public/favicon.svg` : `#F59E0B` en dur (fichier statique, hors CSS).
- Points de rupture de `tokens.css` (`768px`, aligné sur `md:`) et de `global.css` (`1024px` pour FlowDiagram, aligné sur `lg:`).
- Terminal : curseur en unités relatives à la police (`h-[1em] w-[0.55em] translate-y-[0.15em]`) et lignes vides en `min-h-[1lh]`.
- Proportions de grille : `lg:grid-cols-[1fr_1fr]` (hero), `lg:grid-cols-[1fr_2fr]` (FAQ), `lg:grid-cols-[1fr_auto_1fr_auto_1fr]` (schéma d'intégration).
- Formulaire : champ piège positionné hors écran (`-left-[9999px]`), largeur de colonne des `dl` de `prose-site` (60 × `--space-unit`).
- DotPattern : points de 1px et masque radial (20 % → 75 %) dans l'utilitaire `dot-pattern`.
- Icônes de la section Confiance : tracés SVG en ligne dans le composant (`set:html` sur des chaînes statiques, jamais sur du contenu éditable).
- Délai d'impulsion du FlowDiagram calculé en ligne (`--flow-delay`, pas de 600 ms).

## Pièges rencontrés
1. **Auto-référence des variables Tailwind.** Les tokens `--radius-*`, `--shadow-*`, `--font-*`, `--text-*` portent
   déjà les noms des variables de thème de Tailwind. Un `@theme inline` classique réémet
   `--radius-sm: var(--radius-sm)` dans `@layer theme`. Ça ne marche que parce que `tokens.css` gagne la cascade.
   → Le mapping est dans **`@theme inline reference`** : les utilitaires pointent sur les tokens, rien n'est réémis.
   Ne pas retirer `reference`.
2. **Classe inexistante = silence.** Palette et échelles par défaut désactivées : `text-sm`, `bg-gray-100`,
   `rounded-xl`, `shadow-lg` ne génèrent rien, sans avertissement. Si un style « ne s'applique pas », vérifier
   d'abord que la classe correspond à un token.
3. **`hidden md:inline-flex` sur un composant qui fixe déjà son `display`.** Button porte `inline-flex` ;
   `hidden` passé en `class` perd, car Tailwind émet `.inline-flex` après `.hidden`.
   → Masquer ou afficher via un conteneur : `<div class="hidden md:block"><Button …/></div>`.
   Même règle pour **toute surcharge d'une propriété déjà posée par un composant** (fond, bordure, padding de `Card`,
   variante de `Button`) : l'ordre des classes dans `class` ne compte pas, seul l'ordre du CSS généré compte.
   → Ajouter une prop au composant ou écrire l'élément à la main (cas de la carte « Un processus qui vous coûte du temps ? »).
4. **Hydratation d'un bouton dépendant du thème.** Le serveur ne connaît pas le thème. Rendre les deux
   icônes et laisser `dark:hidden` / `dark:block` choisir, sinon flash ou incohérence d'hydratation. Le libellé
   accessible reste générique (« Changer de thème ») jusqu'à l'hydratation.
5. **Plusieurs ThemeToggle** (header + menu mobile) : chacun observe `data-theme` sur `<html>`
   (`MutationObserver`) au lieu de garder un état local, sinon les icônes et libellés divergent.
6. **`env(safe-area-inset-*)` vaut 0** sans `viewport-fit=cover` dans la balise viewport (déjà en place dans `Base.astro`).
7. **Tout élément fixe en bas d'écran** doit réserver sa place en bas de page (`--fab-clearance`), sinon il
   masque la dernière ligne du footer.
8. **Pas de `backdrop-filter`** sur le header sticky : fond plein `bg-bg` (§8.1).
9. **Rechercher une classe dans le CSS construit** : les caractères spéciaux y sont échappés
   (`.py-\(--section-y\)`, `.hover\:bg-accent-hover:hover`).
10. **`npm create astro` refuse un dossier non vide** : le projet a été initialisé à la main (package.json +
    `astro.config.mjs`), à la racine du dépôt.
11. **Îlots vides en dev, `jsxDEV is not a function` dans la console.** Après l'ajout d'un nouvel îlot (ou un
    `npm run build`) pendant que `npm run dev` tourne, le cache de dépendances de Vite peut être périmé : tous les
    îlots disparaissent en dev alors que le build est sain. → Arrêter le serveur et relancer `npm run dev -- --force`.
    Toujours vérifier la console avant de chercher un bug dans le composant.
12. **Libellés mono qui passent à la ligne** dans une rangée étroite : forcer `whitespace-nowrap` et ne passer
    en ligne qu'à partir de la largeur qui les contient (FlowDiagram horizontal seulement ≥ lg).
13. **Captures headless sur une ancre (`/#section`) vides** : Chrome headless rend mal le défilement. Capturer la
    page entière (fenêtre très haute) et découper. Dans ce cas, le vide sous la dernière section est normal : `main`
    est en `flex-1` et le footer est poussé en bas de la fenêtre.
14. **`rm -rf` est interdit** par `.claude/settings.json`, y compris dans le scratchpad : une commande qui en contient
    un est refusée en entier. Utiliser de nouveaux noms de dossiers plutôt que de nettoyer.
15. **Fastify 5.12 : `disableRequestLogging` est déprécié** → `logController: new LogController({ disableRequestLogging: true })`.
16. **Réécriture d'URL et racine** : ne jamais réécrire `/` (→ `//`). Les routes « sans slash » sont inventoriées
    au démarrage à partir des `index.html` de `dist/` : un nouveau build impose un redémarrage du serveur.

## Anti-patterns
- Dégradés multicolores
- Imagerie IA stock (cerveaux, robots, réseaux de neurones)
- Emojis dans l'interface
- Plus de 2 niveaux de titre par section
- WebGL, backdrop-filter sur mobile
- Faux témoignages, faux logos clients, chiffres inventés
- `transition-all`, animation sans `motion-safe:` ou sans token de durée
- Texte `--accent` sur fond `--accent-soft`
