# DESIGN.md — sosese

## Règles non négociables
- Aucune couleur, rayon ou espacement en dur. Toujours un token.
- Une seule couleur d'accent. Jamais deux accents dans un même écran.
- --accent-bright n'est jamais une couleur de texte sur fond clair.
- Bordures 1px sur --border. Ombres réservées aux éléments flottants.
- Tout doit être vérifié dans les deux thèmes avant d'être considéré comme fini.
- Toute animation respecte prefers-reduced-motion. **Seule exception : le terminal** (aujourd'hui dans « Sous le capot », voir « Décisions »).
- Aucun texte technique hors de la section "Sous le capot".
- Les composants interactifs sont des îlots React, **sauf** le mockup du hero, la révélation de la Méthode et la démonstration du
  cas client : JS natif dans une balise `<script>` du composant, servie en fichier externe (voir « Décisions »).
  Tout le reste est statique. Avant de créer un îlot, vérifier qu'un composant statique ou quelques lignes de JS natif ne suffisent pas.

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
| Espacement / gabarit | `--space-unit`, `--section-y`, `--hero-y`, `--gutter`, `--container`, `--header-h`, `--fab-offset`, `--fab-clearance`, `--dot-gap` (pas de la trame DotPattern) |
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
| `--hero-y` | 32px | 64px | rythme vertical du hero seul, plus serré pour laisser voir le bandeau des promesses |
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
| Badge | `ui/Badge.astro` | statique — `variant` neutral/accent, `dot` (pastille `--accent-bright`), `href` → rendu en `<a>` avec `rel="noopener"` et soulignement au survol (cas client), `w-fit` (ne s'étire pas dans un flex en colonne) |
| SectionHeading | `ui/SectionHeading.astro` | statique — `id` (pour `aria-labelledby` de la section), `eyebrow`, `title` (h2), slot = chapeau |
| FlowDiagram | `ui/FlowDiagram.astro` | statique — `steps`, `label` ; vertical < xl, horizontal ≥ xl (à 1024px, les 4 étapes débordaient de la carte) ; impulsion CSS sur les liaisons, masquée sous mouvement réduit. **Non utilisé depuis le 2026-09-17** (retiré de l'offre, doublon avec `DicteeMobile` placé juste à côté) ; conservé |
| TerminalDemo | `islands/TerminalDemo.tsx` | îlot React, `client:idle` — voir « Terminal » |
| PageHeader | `ui/PageHeader.astro` | statique — en-tête des pages internes : `eyebrow`, `title` (**h1**), slot = chapeau |
| ACompleter | `ui/ACompleter.astro` | statique — marqueur visible d'un contenu non fourni (§9), `label` |
| ContactForm | `islands/ContactForm.tsx` | îlot React, `client:idle` — voir « Formulaire de contact » |
| Accordion | `ui/Accordion.astro` | statique — `<details>` / `<summary>` natif, `title`, `name` optionnel (ouverture exclusive), slot = réponse. Zéro JS |
| DicteeMobile | `ui/diagrams/DicteeMobile.astro` | statique + script natif — **non utilisé depuis le 2026-09-20** (hero jusqu'au 2026-09-17, « L'offre » jusqu'au 2026-09-19, « Sous le capot » une journée) ; conservé : cinq tâches jouées en boucle, pause réelle, précédent / suivant, connecteur assemblé sur les règles du client. Scénarios dans `src/config/demo-hero.ts`. Voir « Mockup de la dictée » |
| RotationEcrans | `ui/diagrams/RotationEcrans.astro` | statique + script natif — mockup animé de **« L'offre »** depuis le 2026-09-19, en 24 rem depuis le 2026-09-20 (hero le 2026-09-19, le temps d'une itération) : le même enchaînement joué dans quatre décors (messagerie, boîte mail, téléphone, application de gestion), quatre boutons pour aller à l'un d'eux, bouton pause. Voir « Rotation d'écrans » |
| VracEnActions | `ui/diagrams/VracEnActions.astro` | statique + script natif — visuel du **hero** depuis le 2026-09-19 : ce qui arrive en vrac (post-it, note vocale) est lu par une bande qui traverse, recoupé dans vos outils, rendu en deux actions à valider. Trois intertitres, bouton pause. Voir « Le passage du hero » |
| ConvergenceDonnees | `ui/diagrams/ConvergenceDonnees.astro` | statique + script natif — schéma du hero : trois sources éparpillées rejoignent un tronc, qui descend dans le hub ; il en ressort des actions déjà préparées qui attendent un « oui ». **Une seule passe** (~3,1 s), sans cadre, sans boucle, sans bouton pause. **Non utilisé depuis le 2026-09-19** (remplacé par `RotationEcrans`) ; conservé. Voir « Schéma du hero » |
| Calculateur | `ui/Calculateur.astro` | statique + script `is:inline` — deux curseurs, une estimation d'heures par mois, lien pré-rempli vers `/contact`. **Non utilisé depuis le 2026-09-17** (constat revenu au format de `main`) ; conservé, ainsi que la reprise de `?heures=` dans `ContactForm`, pour pouvoir le remettre. S'il revient : retirer `is:inline` (voir « Décisions », scripts externes) |
| Figure | `ui/diagrams/Figure.astro` | statique — conteneur de schéma : `label` (eyebrow), `caption` (`<figcaption>` mono 12), slot = le schéma |
| CompareBars | `ui/diagrams/CompareBars.astro` | statique (+ script natif si `reveal`) — comparaison de grandeurs : `bars` (`label`, `value`, `display`, `note?`, `tone` muted/accent), `max?`, `reveal?` (révélation ligne par ligne au défilement, à la place de `.bar-grow`). Voir « Schémas » |
| DotPattern | `ui/DotPattern.astro` | statique — trame de points masquée en radial ; **sections invert uniquement**, parent `relative overflow-hidden`, contenu en `relative` |
| Header | `layout/Header.astro` | statique — sticky, fond plein (pas de `backdrop-filter`), nav + CTA ≥ md, menu < md |
| Footer | `layout/Footer.astro` | statique — navigation, légal, contact (LinkedIn affiché seulement si `site.linkedin` est renseigné) |
| MobileCta | `layout/MobileCta.astro` | statique — bouton flottant « Parlons-en » en bas à droite, < md uniquement, toujours visible, masqué sur `/contact` |
| ThemeToggle | `islands/ThemeToggle.tsx` | îlot React, `client:idle` |
| MobileNav | `islands/MobileNav.tsx` | îlot React, `client:idle`, plein écran via `<dialog>` modal |
| EnchainementClient | `ui/diagrams/EnchainementClient.astro` | statique + script natif — démonstration en boucle du cas client : fiche client dictée → devis → intervention, puis l'analyse. Voir « Cas client » |
| Base | `layouts/Base.astro` | props `title`, `description`, `noindex` ; script anti-flash, préchargement polices, canonical |

Le **hero** porte `VracEnActions` (le passage) depuis le 2026-09-19. Chaque visuel remplacé descend d'un cran dans la
page plutôt que d'être supprimé : `RotationEcrans` (quatre décors, hero le 2026-09-19) est descendu dans « L'offre »,
où il remplace `DicteeMobile`, descendu à son tour dans « Sous le capot ». Avant eux : `ConvergenceDonnees` (schéma de
flux, hero le 2026-09-17), conservé mais non utilisé. `DicteeMobile` avait elle-même remplacé le terminal dans
« L'offre » le 2026-09-16, terminal descendu dans « Sous le capot », où les deux se répondent aujourd'hui — la même
mission (un devis préparé depuis le catalogue) vue côté personne puis côté machine.

Sections de l'accueil (`src/components/sections/`), dans l'ordre : Hero, Engagements, Probleme, Methode (`#methode`),
Offre (`#offre`), Clients (`#cas-client`), SousLeCapot (invert), Confiance (`#confiance`),
Faq (`#faq`), CtaFinal (invert). Chaque section : `<section aria-labelledby>` + `py-(--section-y)` (hero : `py-(--hero-y)`) + `container-site` ;
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
| Sécurité | helmet ; CSP `script-src 'self'` (scripts des composants en fichiers `/_astro`) + empreintes sha256 des scripts restés inline (anti-flash du thème), calculées au démarrage depuis `dist/` ; HSTS et `upgrade-insecure-requests` en production seulement ; retours à la ligne refusés dans les champs d'une ligne (injection d'en-têtes) |
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
- Pré-vol §7.5 (2026-09-15) : réseau `traefik-net`, entrypoint `websecure`, certresolver `letsencrypt` (challenge
  HTTP), redirection HTTP → HTTPS globale dans Traefik. Projets voisins : `traefik-a1wt`, `fastmcp-extrabat`,
  `crowdsec`, `filebrowser` — aucun nom de projet, conteneur, routeur, middleware ou service `sosese`. VPS x86,
  92 Go libres, ~7 Go de RAM disponible, sans swap. DNS : `sosese.tech` → IP du VPS, `www` en CNAME.
- Traefik écrit un **journal d'accès** (`/var/log/traefik/access.log`, IP et chemins) sans rotation : mentionné dans
  la politique de confidentialité avec une conservation de **6 mois** (logrotate hebdomadaire × 26 sur le VPS : si la
  rotation change, changer `legal.dureeJournauxTechniques`). CrowdSec lit ce journal : déclaré comme outil
  d'analyse et comme destinataire (CrowdSec SAS) des IP signalées.

### Audits locaux (Lot 5, avant mise en production)
Lighthouse 12 mobile (4G simulée) et axe-core 4.13, sur l'image servie par `server/index.mjs` :
| Page | Perf | A11y | Bonnes pratiques | SEO | LCP | CLS | JS |
|---|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 | 1,5 s | 0 | 75 ko |
| `/contact` | 100 | 100 | 100 | 100 | 1,7 s | 0 | 77 ko |
| `/a-propos` | 100 | 100 | 100 | 100 | 1,5 s | 0 | 73 ko |
| `/mentions-legales` | 100 | 100 | 100 | 100 | 1,7 s | 0 | 73 ko |

axe : **0 violation** sur les 6 pages dans les deux thèmes (FAQ ouverte) et sur le menu mobile ouvert. Aucune requête
tierce.

**En production** (v0.2, 2026-09-15, https://sosese.tech) : Lighthouse mobile 100 / 100 / 100 / 100 sur `/`,
`/contact`, `/a-propos` ; LCP 1,2–1,4 s ; CLS 0 ; TTFB 20–30 ms. axe : 0 violation (6 pages × 2 thèmes + menu mobile).
Certificat Let's Encrypt couvrant `sosese.tech` et `www.sosese.tech` ; `www` et HTTP redirigent en 301 ; HSTS,
CSP, cache et compression brotli conformes. Build local du tag identique à la production (hors `uid` des îlots).
**Avant la v0.7** (tag `v0.6` non publié, piège 19 ; 2026-09-17, branche `feat/schemas-v08-v10`, serveur `server/index.mjs` local, Lighthouse 12.8 mobile
simulé, axe-core 4.13) :

| Page | Perf | A11y | Bonnes pratiques | SEO | LCP | CLS | JS |
|---|---|---|---|---|---|---|---|
| `/` | 98–100 | 100 | 100 | 100 | 1,8 s (1,5 s sur `main`, même machine) | 0 | 76 ko |
| `/contact` | 100 | 100 | 100 | 100 | 1,5 s | 0 | 79 ko |
| `/a-propos` | 100 | 100 | 100 | 100 | 1,5 s | 0 | 74 ko |
| `/mentions-legales` | 100 | 100 | 100 | 100 | 1,7 s | 0 | 74 ko |

axe : 0 violation sur les 6 pages dans les deux thèmes (FAQ ouverte) et sur le menu mobile ouvert. Aucun débordement
horizontal à 360 / 640 / 1024 / 1280 px dans les deux thèmes ; un seul `h1`, aucun saut de titre, aucun
`aria-labelledby` orphelin. **CLS mesuré à 0** pendant l'animation du hero (navigation comprise), la révélation de la
Méthode et un cycle complet du cas client ; hauteurs des deux démonstrations constantes. Mouvement réduit : rien de
masqué, pas de lecture automatique, boutons pause masqués, précédent / suivant opérants. Focus visible (contour 2 px)
atteint au clavier sur les quatre nouveaux boutons. Aucune erreur console, aucune requête en erreur, aucune requête
tierce. Test de démarrage de l'image Docker : laissé à GitHub Actions (non rejoué en local).

Procédures de publication, déploiement et vérification : **`RUNBOOK.md`**.

### Contenus éditables (Content Collections)
Schémas dans `src/content.config.ts`. Ajouter un élément = créer **un seul fichier Markdown**, rien d'autre.
| Collection | Dossier | Frontmatter | Corps |
|---|---|---|---|
| `faq` | `src/content/faq/*.md` | `question`, `ordre` | réponse en Markdown (paragraphes) ; aussi injectée en texte brut dans le JSON-LD `FAQPage` |

La collection `exemples` **a été supprimée** le 2026-09-18 avec la section qu'elle alimentait (voir « Exemples
illustratifs : supprimés »). Le nom de fichier sert d'identifiant, en kebab-case sans accent.

**Offre : une seule chose** (2026-09-17). « Audit & diagnostic » et « Ateliers & acculturation » **ont été
supprimées** : elles répétaient les étapes 1 et 2 de la Méthode, juste au-dessus, et faisaient lire trois fois la
même promesse. La section ne présente plus que le sur-mesure. Trois arguments (`arguments_` en tête de
`Offre.astro`), chacun une phrase d'accroche en `text-ink` suivie d'une ou deux phrases, puis trois `points`
cochés. Aucun chiffre, aucune promesse d'apprentissage automatique : « la solution s'ajuste » veut dire que vos
corrections servent à l'ajuster. Si une prestation détachable (audit, ateliers) doit réapparaître, elle ne revient
pas en carte à côté du sur-mesure : la Méthode la décrit déjà.

**Plus de bento** (2026-09-17) : la grille `md:grid-cols-3 md:grid-rows-2` a disparu avec les deux cartes, et
`BentoOffre.astro` est devenu `Offre.astro`. La section est désormais une grille `lg:grid-cols-[1fr_auto]` —
arguments à gauche, démonstration `DicteeMobile` (24rem) à droite, empilées avant `lg`. Toujours pas de composant
BentoGrid / BentoCard : à créer seulement si un vrai bento réapparaît.

**Les deux colonnes se répondent** (2026-09-18) : `lg:items-center`. La colonne de texte est plus courte que le
mockup ; alignées en haut (`items-start`), elles laissaient un vide d'une centaine de pixels sous les `points`
cochés et la section paraissait bancale. `items-start` reste en vigueur sous `lg`, où les deux blocs sont empilés.

**Une icône par argument** (2026-09-18) : chaque argument porte un pictogramme ambre dans une pastille
`size-9 rounded-md bg-accent-soft text-accent`, même contrat que les cartes de la section Confiance — tracé SVG
en ligne, chaîne statique passée en `set:html`, `aria-hidden` (l'argument est écrit juste à côté, l'icône
n'ajoute aucune information). Les trois tracés disent ce que dit l'argument : des lignes de tâches barrées,
des données empilées d'où repart une flèche, des curseurs de réglage. Pas de bibliothèque d'icônes : quatre
tracés dans Confiance, trois ici, c'est tout ce dont le site a besoin.

**Exemples illustratifs : supprimés** (2026-09-18, demande explicite). La section `Exemples` (`#exemples`), la
collection `exemples` et son composant `MicroFlux` ont été **supprimés** — cinq cartes de cas types juste avant
le cas client réel, qui dit la même chose avec des chiffres mesurés. Ce qui reste du registre « exemple » : les
scénarios de `DicteeMobile` (offre) et la démonstration d'`EnchainementClient` (cas client), tous deux
explicitement donnés pour des scénarios types. La carte d'appel « Un processus qui vous coûte du temps ? » qui
fermait la grille disparaît avec elle : `CtaFinal` porte déjà l'appel. Si des exemples illustratifs
reviennent, ils reviennent **après** le cas client, jamais avant — un cas mesuré ne se fait pas précéder de cas
inventés.

Le **`FlowDiagram` « Exemple : une demande de devis »** a été retiré de la carte en même temps : `DicteeMobile`
arrive juste à côté et montre le même circuit en mieux. Un schéma remplace du texte, il ne redouble pas un autre
schéma.

### Schémas
Registres autorisés (décision du 2026-09-16, voir « Décisions ») : **R1 schéma de flux**, **R2 mockup stylisé**,
**R3 comparaison de grandeurs**. Rien d'autre. Un schéma **remplace** du texte : toute nouvelle figure s'accompagne
du texte qu'elle supprime.

- Primitives dans `src/components/ui/diagrams/`. `Figure` porte le libellé et la légende, le schéma vit dans son slot.
- **La valeur chiffrée est toujours écrite**, la barre ou le tracé ne fait que la mettre en proportion. Les éléments
  purement graphiques (barres, liaisons, pastilles) sont en `aria-hidden` quand le texte à côté dit déjà tout.
- Longueur minimale d'une barre : `max(<pct>%, calc(var(--space-unit) * 2))` — sans ce plancher, une valeur très
  petite (2 min contre 40) disparaît complètement.
- Proportions : `flex-basis: 0` + `flex-grow` proportionnel (`style="flex-grow: 20"`), jamais des largeurs en dur.
  Les **libellés ne sont pas dans le segment proportionnel** : un segment étroit (2 jours sur 27) ne peut pas
  contenir de texte. Ils vivent sous la barre, ou dans une grille à colonnes égales en dessous.
- **Méthode** (2026-09-17) : revenue au format de `main` (pastilles numérotées reliées par un trait, carte Votre
  temps / Durée / Livrable, **« Votre temps » en premier**). Frise proportionnelle et `CompareBars` retirés de cette
  section. **Révélation séquentielle, de gauche à droite** : pastille, texte, cadre du détail avec sa première
  ligne, lignes suivantes, puis le trait vers l'étape suivante (`scaleY` sous `md`, `scaleX` au-dessus) ; ~5 s au
  total, une seule fois. Script natif du composant : `IntersectionObserver` (seuil 0,25) puis minuteurs, éléments marqués
  `data-revele` (`="trait"` pour le trait), masquage par `.revele-cache` dans `global.css`. **Écart assumé à la
  règle « pas d'`IntersectionObserver` » ci-dessous** (2026-09-17) : la version en `animation-timeline: view()`
  ne s'est pas jouée chez l'humain (Firefox ne la gère pas) et ne sait pas enchaîner les trois colonnes dans le
  temps. Les classes ne sont posées que par le script : sans JS ou sous mouvement réduit, tout est visible.
  **Le cadre `dl` porte `data-revele`, pas sa première ligne** : sinon il apparaît vide avant son contenu.
- **Animation** : `.bar-grow` dans `global.css`, `transform: scaleX()` piloté par `animation-timeline: view()`,
  sous `@media (prefers-reduced-motion: no-preference)` **et** `@supports (animation-timeline: view())`. Donc :
  état final rendu côté serveur, zéro JS, zéro CLS, et rien ne bouge si le navigateur ne sait pas faire ou si le
  visiteur n'en veut pas. **Ne pas remplacer par un `IntersectionObserver`** : ce serait du React pour une décoration.
- **`CompareBars reveal`** (2026-09-18, cas client) : révélation ligne par ligne au défilement, à la place de
  `.bar-grow`. Libellé + valeur, puis la barre qui se déploie depuis la gauche, puis la note — pas de 260 ms,
  même rythme et même machinerie que la Méthode (`IntersectionObserver` au seuil 0,25, `data-revele`,
  `.revele-cache`). La comparaison se lit alors dans l'ordre de l'histoire : les 40 minutes d'abord, les 2 minutes
  ensuite. La barre porte `data-revele="barre"` : `transform-origin: left center`, et son état masqué est
  `scaleX(0)` **à `opacity: 1`** — elle se déploie, elle n'apparaît pas. Les deux animations **s'excluent** :
  avec `reveal`, la classe `.bar-grow` n'est pas émise, sinon la barre finirait sa croissance au défilement
  pendant qu'elle est encore masquée, et serait déjà pleine en apparaissant.
- `transform` n'affecte pas la mise en page : une barre animée ne décale rien. Toute animation de schéma doit
  rester sur `transform` ou `opacity` pour cette raison.

### Le passage du hero (VracEnActions)
Visuel du hero depuis le 2026-09-19, mis au point au labo (neuf versions, T6a → T6i). Registre **R1 assoupli** : c'est
un schéma, mais ses entrées sont des objets de bureau, pas des icônes de fichiers. Ce qu'il dit, en trois temps et
trois intertitres : **« Il analyse ce qui arrive »** (des post-it jetés de travers et une note vocale), **« Il va
chercher pour vous »** (il se branche sur l'agenda, les tarifs, les fiches clients, qui se cochent un par un),
**« Il fait, vous validez »** (deux actions prêtes, chacune avec son bouton). Une boucle dure ~15 s.

- **Les entrées sont des post-it et une note vocale**, pas des documents bien rangés : ce qui encombre une journée,
  ce sont des choses notées à la main. Positions, largeurs et angles sont **posés à la main** dans le frontmatter —
  une formule donne un désordre régulier, c'est-à-dire pas du désordre. La note vocale est dessinée comme une bulle
  de BD, queue comprise, et se nomme elle-même (« Message vocal · 0:14 » + la phrase entre guillemets).
- **La queue de la bulle est un SVG**, pas deux triangles CSS superposés. La technique des deux bordures ne trace un
  filet que sur l'arête du haut : les deux arêtes obliques restaient nues, donc invisibles sur un fond de la même
  couleur. Le SVG pose le remplissage (qui recouvre la bordure basse de la bulle) puis les deux obliques.
- **Le délai de bascule de chaque entrée se calcule sur sa position horizontale**, jamais sur un numéro d'ordre
  (`lu(centre)` dans le frontmatter). C'est la seule chose qui tient le scan synchronisé avec des post-it qui ne
  sont pas alignés — voir piège 25. La bande elle-même est en `linear` pour la même raison.
- **Un seul aplat de couleur dans toute la scène** : le bouton « Valider », et il arrive en dernier. Tout le reste
  ne fait que changer de bordure ou de texte. C'est ce qui fait que la décision se voit sans qu'on l'explique.
- **Les outils et les actions partagent la même case de la grille** (`.apres`, `grid-area: 1 / 1`) : ils ne sont
  jamais à l'écran ensemble, la scène n'a donc pas à réserver la place des deux. C'est ce qui permet le **7/5** —
  un carré écrase le h1 posé à côté.
- **La colonne coulisse, en trois positions seulement** : l'entrée, le connecteur au travail, les actions. Le
  glissement de l'étape 3 attend la fin de l'absorption (`transition-delay`), sinon le vrac remonte au lieu de
  descendre dans le boîtier.
- **Rythme** : l'entrée (2,2 s + 2,9 s) et la sortie (4,7 s) durent un tiers de plus que la réflexion (1,6 s +
  2,6 s). Ce sont les deux moments qu'on regarde vraiment ; la consultation ne gagne rien à être allongée.
- **Largeur 31 rem dans le hero** : assez grande pour que les post-it et la phrase du connecteur se lisent sans
  effort, assez petite pour ne pas écraser le h1. Tout étant en `cqw`, elle se redimensionne d'un bloc.
- **Le connecteur est l'élément le plus présent de la scène** (2026-09-20) : c'est l'offre entière. Trois moyens,
  tous sans aplat de couleur supplémentaire — `--shadow-md` quand tout le reste de la scène est en `--shadow-sm`
  (c'est ce décalage seul qui le met au premier plan), un halo `0 0 0 0.6cqw var(--accent-soft)` à l'activation,
  et la marque qui passe de `--ink-muted` à `--ink` pendant le travail. **Ne pas lui donner de fond ambre** : le
  bouton « Valider » doit rester le seul aplat de la scène.
- **Elle illustre une phrase précise du hero, et le dit.** La maquette porte l'eyebrow « l'outil qui s'en occupe »,
  qui reprend mot pour mot la phrase mise en `font-medium text-ink` dans la colonne de texte (« On construit
  l'outil qui s'en occupe à votre place »). Les deux se répondent à trente centimètres l'une de l'autre : si l'une
  des deux formulations change, **changer l'autre dans le même tour**.
- **Les intertitres n'ont pas de pronom pour la machine** (2026-09-20) : « Tout ce qui vous arrive » → « Recoupé
  dans vos outils » → « Fait. Vous validez. » Lus bout à bout, les trois font une seule phrase, et le seul sujet
  nommé de la scène est le visiteur. Les versions précédentes commençaient toutes par « Il », ce qui donnait un
  personnage à une machine et contredisait le « elle » employé partout ailleurs sur la page.
- **Tout est en `cqw`** (`container-type: inline-size` sur `.scene`) **sauf le padding de la scène**, qui reste en
  % : un élément ne peut pas interroger sa propre taille de conteneur.
- **Bouton pause obligatoire** : la scène boucle et dure bien plus de 5 s (WCAG 2.2.2). Même mécanique que
  `RotationEcrans` — `data-fige` gèle les animations CSS, le minuteur retient **ce qu'il restait à attendre**, et un
  `IntersectionObserver` suspend tout hors écran. **Ne jamais le retirer.**
- **Le bouton est dans le cadre, en haut à droite** (2026-09-20) : posé sous la scène, il ajoutait une ligne sous un
  visuel qui n'en demandait pas. Conséquence de structure : `aria-hidden="true"` est descendu de `.scene` sur
  `.visuel`, sinon la commande serait masquée aux technologies d'assistance avec le décor. `.scene` garde
  `data-etape` — tous les sélecteurs en dépendent — et devient le bloc de positionnement ; `top`/`right` du bouton
  sont en `cqw` et tombent donc pile sur le padding de 5 %.
- **Deux actions en sortie, et rien en dessous** (2026-09-20) : le boîtier annonce « 2 actions prêtes », les deux
  sont montrées. La ligne « + 1 autre action prête » a disparu — un rappel de volume sous deux cartes déjà visibles
  n'ajoutait rien et faisait une troisième ligne de texte dans un visuel qui vit de son silence.
- **L'état rendu par le serveur est l'état final** (`data-etape="5"`, les actions prêtes) : lisible sans JS, aucun
  flash à l'arrivée du script, et c'est aussi l'état servi sous `prefers-reduced-motion`, où rien ne boucle.
- **Les trois intertitres sont empilés à la même place** (les deux derniers en `absolute`, `left: 0`) ; sans le
  `left`, le second se poserait après l'espace que le premier occupe encore. **Seul le troisième passe en accent** :
  c'est le seul des trois qui annonce un résultat.
- **Données inventées** (piège 17) : noms, dates et montants sont des exemples, dits tels dans la transcription
  `sr-only` portée par le `<figcaption>`. Les outils restent des **catégories** — Agenda, Tarifs, Clients — jamais
  une marque.

### Mockup de la dictée (DicteeMobile)
**Cinq tâches** très différentes jouées à la suite, en boucle (demande explicite du
2026-09-16), avec **précédent / suivant** depuis le 2026-09-17 pour aller directement au cas qui intéresse : devis dicté, fiche client depuis un email, relance déclenchée automatiquement, rendez-vous posé
depuis la route, question de gestion. L'objectif est double : le visiteur reste pour voir si son métier passe, et
il comprend que le connecteur n'est pas un outil à devis. Chaque scène dure 9 à 10 s, le cycle complet **~50 s**.

- **Tout le mockup est sombre, dans les deux thèmes** (2026-09-17) : le bloc porte `.section-invert`, bulles
  comprises, pour ressortir sur le fond clair de la section. (Une variante « cadre sombre, bulles claires » a été essayée puis
  abandonnée le même jour.)
- **Lecteur à pause réelle** : le script ne chaîne pas des `setTimeout` mais charge la liste datée des événements
  d'une scène (`charger`) et les joue un par un (`avancer`). `suspendre` mémorise le temps déjà attendu vers le
  prochain événement ; la reprise n'attend que le reste. Pause, sortie de l'écran et reprise ne rejouent rien.
- **Précédent / suivant** (`data-precedent`, `data-suivant`) : saut immédiat au scénario. En lecture, il se joue
  depuis le début ; en pause, il s'affiche complet et se jouera à la reprise. **Aussi actifs sous mouvement réduit**
  (affichage complet, sans animation) : c'est le seul moyen d'y voir les autres métiers. Sous `sm`, l'icône du
  libellé est masquée pour que libellé + trois boutons tiennent à 360 px.
- **Action faite mise en avant** : pastille bordée ambre, coche pleine, et halo `.action-eclat` (`global.css`,
  `box-shadow` qui s'élargit et s'éteint, deux fois, sous `prefers-reduced-motion: no-preference`) relancé à chaque
  apparition. `box-shadow` ne touche pas la mise en page : CLS 0.
- **Pas de cadre de téléphone** (retiré le 2026-09-17, avec la barre de préhension) : un seul bloc bordé
  `border-border-strong`, gain ≈ 40 px de hauteur.
- **Scénarios dans `src/config/demo-hero.ts`**, inventés, dits tels dans la transcription `sr-only`. Le nom du
  fichier reste `demo-hero.ts` alors que le mockup a quitté le hero : renommer est un déplacement gratuit, à faire
  seulement si le fichier est retouché pour une autre raison. **Aucune légende sous le cadre** ; l'eyebrow « cinq
  demandes, cinq réponses » est posé au-dessus, par la section `Offre`.
  Les en-têtes du fichier portent les règles de rédaction : elles font partie du contrat, pas du commentaire.
- **Le connecteur est le bloc central.** Chaque règle est affichée **avec la source d'où elle est lue**
  (catalogue, CRM, agenda, gestion, compta, boîte mail) : c'est ce qui montre que les règles existent déjà chez le
  client. Ce sont des **catégories d'outils, jamais une marque** — pas de logo ni de nom de logiciel tiers sur une
  page publique. Les règles restent **génériques** : on nomme la nature de la règle (« vos taux de TVA »), jamais sa
  valeur. Aucun taux affiché nulle part. Passer à des valeurs exactes = décision humaine.
- **Quatre formes de sortie** : `lignes` (tableau ou fiche), `message`, `agenda` (bande horaire), `barres`
  (classement). La forme suit le besoin — c'est l'argument de polyvalence. En ajouter une = un bloc conditionnel
  dans le composant, les éléments révélés portent `data-item`.
- **Chaque scénario se termine par une action faite**, pas par un texte : « devis créé », « email envoyé »,
  « rendez-vous posé ». L'action n'arrive **qu'après la porte** (`porte`), et le scénario de lecture (question de
  gestion) **n'a pas de porte** : son action est « lecture seule — rien n'a été modifié ». Cette asymétrie est
  volontaire : c'est la doctrine de la section Confiance, montrée au lieu d'être répétée.
- **Une entrée dictée se transcrit mot à mot** ; un email ou un déclencheur **apparaît d'un bloc** — transcrire un
  email caractère par caractère serait un contresens. Le type est porté par `data-entree`.
- **Les scènes sont empilées dans une même cellule de grille** (`col-start-1 row-start-1`, `self-start`) et présentes
  en permanence : la hauteur du bloc vaut celle de la plus haute, elle ne bouge jamais. **C'est ce qui tient le CLS
  à 0.** Corollaire : garder les scénarios de masse comparable (entrée de 13 à 16 mots, **3 règles**, 3 à 4 éléments de
  sortie). Passées de 4 à 3 le 2026-09-17 pour gagner une ligne de hauteur. Écart mesuré à 1440 px : 472 à 516 px,
  soit 44 px de vide au pire.
- **Les libellés d'en-tête sont empilés de la même façon.** Écrire le contexte et le métier dans un seul span et en
  changer le texte faisait varier sa largeur, donc bouger le point séparateur : **CLS 0,005 mesuré**. Cinq spans
  empilés, un seul opaque : plus rien ne bouge.
- **`min-w-0` sur le nom de la règle** : sans lui, l'élément flex refuse de passer à la ligne et déborde à 360 px
  (piège 12). Un nom de règle dépasse rarement 22 caractères ; au-delà il passe à la ligne sous 390 px, ce qui reste
  lisible mais grandit le bloc.
- **État rendu par le serveur = état final du premier scénario.** Sans JS, le bloc reste un scénario complet et
  lisible. Au premier passage, cet état est tenu 1,8 s avant que la boucle prenne la main : le LCP est déjà mesuré.
- **Respecte `prefers-reduced-motion`** (l'exception du terminal ne s'étend pas) : aucune lecture automatique, le
  premier scénario reste affiché, précédent / suivant permettent de voir les autres, complets.
- **Bouton pause toujours rendu** hors mouvement réduit (`motion-reduce:hidden`) : l'animation démarre seule et dure
  plus de 5 s, WCAG 2.2.2 impose un moyen de l'arrêter. **Ne jamais le retirer**, même avec précédent / suivant. Mise en pause aussi hors viewport (`IntersectionObserver`).
- Bloc animé en `aria-hidden`, transcription `sr-only` couvrant les cinq scénarios.
- Guillemets collés par une **espace fine insécable** (U+202F) : typographie française correcte, et la découpe en
  mots du script ne peut pas isoler un « » en fin de bulle.
- **Vérifier après toute modification** : aucun chevauchement de deux scènes (échantillonner l'opacité pendant un
  cycle), CLS nul sur un cycle complet, et `scrollWidth` à 360 px — c'est là que ça casse en premier.

### Rotation d'écrans (RotationEcrans)
Visuel du hero le 2026-09-19, descendu dans « L'offre » le jour même, repris d'une planche de maquettes. Registre **R2, écrans plutôt que schéma**.
Ce qu'il dit : le travail préparé **arrive là où la personne se trouve déjà**. Le même enchaînement — une demande
arrive, la solution consulte les outils de l'entreprise un par un en montrant ce qu'elle y trouve, une action prête
à valider en sort — joué dans quatre décors : messagerie, boîte mail, téléphone, application de gestion.

- **Un écran = un scénario.** Huit écrans depuis le 2026-09-19, **deux par décor** : messagerie (devis, création de
  fiche client), boîte mail (rendez-vous avancé, dépannage sous garantie), téléphone (question de gestion, recherche
  dans l'historique), application (relances, analyse de ventes). Ils sont joués dans l'ordre du DOM, qui alterne les
  décors — jamais deux fois le même de suite. Un tour complet dure ~100 s.
- **Quatre boutons sous la maquette**, un par décor, qui portent la **liste** de leurs écrans (`data-jalon="0,4"`).
  Un clic va au premier exemple du décor ; un deuxième clic passe à l'autre. Le clic **prend la main** : la rotation
  automatique s'arrête, l'écran choisi joue sa séquence une fois et reste. L'état est porté par `aria-pressed`, pas
  par une classe. Les scénarios n'ont pas de bouton propre : huit libellés ne tiennent pas sous une maquette de 24 rem.
- **La largeur vient de la piste de grille, pas de la `max-width`.** Dans « L'offre », la colonne de droite est en
  `lg:grid-cols-[1fr_24rem]` : avec `auto`, la piste se calait sur le max-content de la maquette — c'est-à-dire sur
  la barre de libellés — et élargir sa `max-width` ne produisait rien du tout. **21 rem est le plancher** : c'est la
  largeur la plus étroite où les quatre libellés et le bouton de lecture tiennent encore sur une ligne.
- **L'écart entre les arguments est fixe, pas réparti** (2026-09-20) : `lg:gap-16` (64 px) sur la liste, et
  `lg:items-center` sur la grille. Réparti sur la hauteur de la maquette (`justify-between`), l'écart montait à
  90 px — une ligne de corps de trop, la liste se lisait comme quatre blocs sans rapport. À 64 px elle respire
  encore et reste un ensemble ; elle est un peu plus courte que la maquette, qui la centre en face d'elle.
- **`data-deroule="confirme"`** sur les écrans qui se terminent par une confirmation (aujourd'hui : les relances) :
  ils gardent une cinquième étape. Les autres s'arrêtent à l'étape 4.
- **Libellés courts** (`Messagerie`, `Boîte mail`, `Téléphone`, `Gestion`) : en mono 12, les quatre plus le bouton
  pause tiennent sur **une seule ligne** dans 24 rem — la largeur la plus étroite où la maquette ait tourné —, et
  jusqu'à 360 px. Un libellé plus long (« Application ») les fait
  passer à deux lignes et laisse le bouton pause seul en bas. Le `title` porte la phrase entière.
- **Actif = souligné en `--accent` sur texte `--ink`**, pas de pastille pleine : `accent` sur `accent-soft` est à
  4,28:1 en clair (voir contrastes), donc inutilisable pour du texte 12.
- **Bouton pause obligatoire** : la rotation boucle et dure bien plus de 5 s (WCAG 2.2.2). Rendu hors mouvement
  réduit (`motion-reduce:hidden`), mis en pause aussi hors viewport (`IntersectionObserver`). **Ne jamais le retirer.**
- **La pause est une vraie pause** (2026-09-19). Deux choses s'ajoutent à l'arrêt du minuteur :
  1. `data-fige` sur la racine passe toutes les animations CSS des écrans en `animation-play-state: paused`. Sans
     ça, l'anneau de consultation et la barre de progression continuaient de tourner : rien n'avait l'air arrêté.
  2. Le minuteur retient **ce qu'il restait à attendre** (`reste`, `depart`) et la reprise ne programme que ce
     reliquat. Avant, la lecture repartait au début de l'exemple. Même mécanique que `DicteeMobile`.
  Si plus rien n'est en attente (l'écran choisi à la main a fini sa séquence), le bouton relance l'enchaînement
  depuis l'écran affiché — jamais depuis le premier.
- **Le bouton de lecture est en tête de la barre**, en pastille bordée (`rounded-full border border-border`, accent
  quand la lecture est arrêtée) : posé après les libellés et sans contour, il se lisait comme un glyphe de texte.
- **Sous `prefers-reduced-motion`** : aucune rotation automatique, aucune séquence. Les boutons changent d'écran et
  l'écran arrive directement dans son état final.
- **L'état rendu par le serveur est l'état final du premier écran** (`data-etape="4"`, `data-actif`) : lisible sans
  JS, aucun flash à l'arrivée du script. Les quatre écrans sont empilés dans la même cellule de grille et toujours
  présents : hauteur constante, CLS 0 au changement.
- **Le fondu est séquentiel, pas croisé** : le sortant s'efface entièrement (`--rot-sortie`) avant que l'entrant
  n'arrive (`--rot-entree` après `--rot-attente`). Deux chromes superposés à mi-fondu — les coins arrondis du
  téléphone sur le carré blanc de la messagerie — donnaient une bouillie. Passer par le fond de page une fraction
  de seconde se lit comme un changement d'appareil.
- **Les durées de la CSS et celles du script se répondent** (`--rot-entree` / `ENTREE`, `--rot-sortie` / `SORTIE`) :
  changer l'une oblige à changer l'autre, sinon l'écran qui arrive joue son premier pas dans le vide.
- **Poids** : les huit écrans font ~32 ko de HTML dans le hero, mais ils sont très répétitifs — la page entière
  tient en 21,5 ko une fois compressée. Vérifier ce chiffre avant d'ajouter un neuvième écran.
- **CSS de composant, pas Tailwind** : les quatre décors sont ~22 ko de CSS reprise telle quelle de la maquette,
  dans le `<style>` scopé du composant. Toutes les couleurs y sont des tokens ; les tailles sont en `cqw`
  (`container-type: inline-size` sur l'écran), donc la maquette se redimensionne d'un bloc, comme une capture.
- **Données inventées** (piège 17) : noms, dates et montants sont des exemples, dits tels dans la transcription
  `sr-only`. Les outils consultés restent des **catégories** — « votre catalogue », « votre planning », « vos fiches
  clients », « votre comptabilité » — jamais une marque.

### Schéma du hero (ConvergenceDonnees) — retiré du hero le 2026-09-19, conservé
Remplace `DicteeMobile` dans le hero le 2026-09-17 (voir « Décisions »). Registre **R1, schéma de flux**. Ce qu'il
dit, dans l'ordre : vos données existent déjà mais elles sont **éparpillées** ; elles alimentent **un seul endroit** ;
ce qui en ressort n'est **pas une liste de choses à faire** mais du travail déjà préparé, qui attend un « oui ».
Moins de tâches, pas plus — c'est tout l'argument.

- **Un seul axe vertical** : sources → tronc → hub → flèche → propositions. Une première version en L (hub à
  droite, propositions dessous) a été abandonnée le 2026-09-17 : le lien entre le hub et les actions ne se voyait
  pas. Le hub est une **barre pleine largeur**, ce qui rend l'enchaînement évident.
- **Une seule passe, pas de boucle** (2026-09-17, demande explicite). L'état final rendu par le serveur est tenu
  1,4 s (le temps que le LCP soit pris), puis le schéma se rembobine et se trace une fois, en ~3,1 s. Ensuite il ne
  bouge plus. **Pas de bouton pause** : le mouvement dure moins de 5 s et ne repart jamais, WCAG 2.2.2 ne
  s'applique pas. **Remettre une boucle = remettre le bouton, sans discussion.**
- **Pas de cadre** (2026-09-17) : contrairement à `DicteeMobile`, le bloc ne porte ni `.section-invert`, ni bordure,
  ni fond. Il vit sur le fond de la page, dans les deux thèmes. Conséquence : les traits sont en `--accent`
  (contraste correct partout) et **non** en `--accent-bright`, qui serait délavé sur fond clair.
- **Trois sources seulement**, et une quatrième ligne sans pastille ni liaison — « … et tous les autres » — pour
  dire qu'il y en a bien plus. Au-delà de trois, le schéma se lit comme un inventaire.
- **Libellés en HTML, liaisons en SVG.** Un texte SVG suit l'échelle du `viewBox` (piège 20). Les liaisons sont
  dans un SVG `absolute` à `viewBox` 100 × 100 et `preserveAspectRatio="none"`, qui s'étire avec la zone ;
  `vector-effect="non-scaling-stroke"` garde l'épaisseur du trait constante. Elles passent **derrière** les
  pastilles, opaques : aucun calage au pixel, rien ne casse quand la colonne change de largeur.
- **Tracé orthogonal, pas des courbes** : trois départs horizontaux, un tronc vertical, une arrivée dans le hub.
  Les courbes essayées le même jour passaient derrière les pastilles du bas et se lisaient comme des fragments
  détachés (piège 21). Des segments droits ne se déforment pas quand la zone s'étire.
- **Le tronc est à x = 62 %**, à droite de tout ce que porte la colonne de gauche : la pastille la plus large (35 %)
  et la ligne « et tous les autres » (49 % à 360 px). À 50 %, mesuré, le tronc traversait cette ligne à 360 px.
  **Rallonger un libellé ou décaler une pastille impose de revérifier à 360 px.**
- **Les y des liaisons sont les centres des lignes** : quatre blocs `h-7` séparés par `gap-2` font 136 px, plus
  12 px de débord en bas, soit 148 px — d'où 9,5 / 34 / 58 %. **Changer la hauteur des lignes, leur nombre ou leur
  espacement impose de recalculer ces y.**
- **`pb-3 -mb-3` sur la zone de dessin** : elle déborde de 12 px dans le `gap` de la figure et la marge négative
  reprend ces 12 px, si bien que le bas du tronc tombe exactement sur le haut du hub. Ne **pas** écrire cela avec
  `-bottom-3` sur le SVG (piège 22).
- **Le désordre est le message** : `decalage` (`ml-0`, `ml-8`, `ml-3`) empêche les pastilles d'être alignées. Ne pas
  « ranger » la colonne.
- **Propositions d'une ligne** : le constat à gauche (« 3 devis sans réponse »), l'action faite à droite
  (« ✓ relances envoyées »). Porte et « fait » occupent la même cellule de grille : passer de l'un à l'autre ne
  décale rien, et la cellule garde la largeur du plus large des deux.
- Même contrat que partout ailleurs : tout est toujours dans le DOM, seule l'opacité bouge, l'état rendu par le
  serveur est l'état **final**, bloc en `aria-hidden` + transcription `sr-only`, rien ne bouge sous mouvement réduit.
- **Contenus inventés**, dits tels dans la transcription : aucun nom de client, aucun montant, aucune pièce réelle
  (piège 17). Les sources sont des **catégories** (« vos devis », « votre agenda »), jamais une marque.
- **Vérifier après toute modification** : `scrollWidth` à 360 px, CLS nul, hauteur du bloc constante, et qu'aucun
  libellé de la colonne de gauche n'atteint le tronc à 360 px.

### Écran partagé de « Sous le capot »
Depuis le 2026-09-20, le terminal n'occupe plus toute la largeur : il tient la moitié gauche d'une grille
`lg:grid-cols-2`, la moitié droite attendant un second visuel. Cette moitié porte le marqueur `ACompleter` (§9)
dans un cadre en pointillés, **jamais un vide** : un trou silencieux part en production sans que personne le voie,
un marqueur ambre non. Le panneau n'est pas en `items-start` — il prend la hauteur de la colonne de gauche, sinon
le partage ressemble à un oubli plutôt qu'à une intention.

### Qui décide quoi (Confiance)
Refait le 2026-09-20 : deux listes plates séparées par un petit badge ne se lisaient pas, et rien n'y avait le
poids de ce qui est promis.
- **Les deux panneaux ont un titre de vrai titre** (`text-18 font-semibold`), pas une étiquette mono : « Elle
  avance seule » / « Elle s'arrête net ». Ce sont les deux moitiés d'une même phrase, il faut qu'on les lise
  avant les listes.
- **Chaque geste porte son signe** : une coche à gauche, un glyphe de pause à droite, tous deux en `--accent`,
  alignés sur la première ligne (`mt-1`). C'est ce qui donne le rythme que les listes nues n'avaient pas.
- **La porte est le seul aplat de couleur de la section** : pastille `bg-accent` / `text-on-accent` (5,02:1,
  voir contrastes). Les engagements en dessous n'ont que des fonds `accent-soft`, donc rien ne lui dispute
  l'attention.
- **Le trait qui la traverse est un filet, pas une flèche** : `h-5 w-px` empilé avant lg, `lg:h-px lg:w-5` en
  ligne ensuite. Deux flèches `→` empilées verticalement dans une colonne `auto` disaient l'inverse du sens de
  lecture.
- **Le chapeau est en trois phrases courtes** (« Elle lit ce qu'il faut. Elle n'en garde rien. Elle n'envoie
  rien sans vous. ») et non en une phrase à trois virgules : c'est la même information, scandée.

### Terminal
- **Vit dans « Sous le capot »** depuis le 2026-09-16 (auparavant dans le hero, voir « Décisions »). Il porte
  `.section-invert` : dans une section déjà invert, il se lit comme un panneau bordé, ce qui est voulu.
- **Ignore `prefers-reduced-motion`** (décision du 2026-09-15, voir « Décisions ») : boucle, curseur clignotant et
  bouton pause identiques pour tous les visiteurs.
- L'état initial (SSR, sans JS) est l'**état final** complet : pas de flash à l'hydratation.
  Premier passage : état final tenu 1,2 s seulement (`FIRST_HOLD`), puis efface et retape ; les passages suivants
  tiennent l'état final 4 s (~12 s au total).
- Toutes les lignes sont toujours dans le DOM ; les parties non tapées sont en `invisible` : hauteur fixe, zéro CLS.
- Bloc animé en `aria-hidden`, transcription complète en `sr-only`.
- Pause : bouton pause/lecture dans la barre de titre, **toujours rendu** (y compris en SSR), seul moyen d'arrêt
  pour les visiteurs sensibles au mouvement (WCAG 2.2.2) ; aussi hors viewport (`IntersectionObserver`).
  **Pas de pause au survol** : voir piège 18. Ne jamais retirer ce bouton.
- Curseur : `.terminal-cursor` déclaré hors de toute media query dans `global.css`.
- Le terminal porte `.section-invert` : sombre dans les deux thèmes.

### Clients (section « Ils nous ont fait confiance »)
Titre de section et libellé de navigation changés le 2026-09-19 : eyebrow `Clients`, titre
**« Ils nous ont fait confiance »**, entrée de menu **« Clients »**. Le composant s'appelle désormais
`sections/Clients.astro`. **L'ancre reste `#cas-client`** : elle est publiée depuis la v1, la renommer
casserait les liens existants. Le titre du cas (« Le devis part du chantier, pas du bureau ») est descendu
en `h3` sous le h2 de section : la section parle des clients, ce cas n'en est qu'un.

- **Compteurs de production** (`production`, 2026-09-19) : +50 devis créés, +30 rendez-vous posés,
  +40 fiches clients créées, 3 rapports d'analyse annuels. Fournis par le client, **jamais lus dans un outil
  connecté** (voir « Aucune donnée de tiers » ci-dessous) et jamais estimés. Le « + » fait partie de la valeur :
  ce sont des planchers. Rendus dans **un seul cadre** (`Card` + `Figure`, 2 × 2), **à côté** de la comparaison
  de temps et non au-dessus (2026-09-20, grille `lg:grid-cols-[2fr_3fr]`) : le « combien » et le « combien de
  temps » se lisent ensemble, et la section ne double pas sa hauteur pour les séparer. Le rapport 2/3 n'est pas
  décoratif — il amène les deux cartes à la même hauteur, sinon la comparaison gouverne et laisse un fond de
  carte vide à gauche.
- **L'intro et les compteurs partagent une rangée** (2026-09-20, `lg:grid-cols-[3fr_2fr]`) : le titre, le logo et
  le paragraphe tiennent dans la colonne de mesure, ce qui laissait toute la moitié droite du haut de section
  vide. La comparaison de temps passe **pleine largeur** en dessous — ses libellés et ses notes tiennent alors sur
  une seule ligne au lieu de deux.
- **Les deux cartes « 0 soirée » et « 100 % » ont été retirées** (2026-09-20, demande de réduction de la
  section). Les deux affirmations restent sur la page, mais en prose et non plus en chiffre mesuré : la
  ressaisie du soir est dite dans la note de la comparaison, la validation explicite est le sujet entier de la
  section Confiance et la fin du paragraphe du cas (« une fois qu'ils ont dit oui »). **Si on veut remettre un
  chiffre mesuré, c'est celui-là qu'il faut rechercher auprès du client, pas le réinventer.**
- **Deux comparaisons de temps, côte à côte** (`lg:grid-cols-2`, 2026-09-20) : le devis (40 min → 2 min) et la
  fiche client (5 min → 30 s). Chaque `CompareBars` cale ses longueurs sur **le maximum de son propre tableau** —
  mises à la même échelle, les 5 min de la fiche client seraient invisibles à côté des 40 min du devis.
  `items-start` sur la rangée : la fiche client n'a pas de note sous ses barres, sa carte est plus courte, et
  l'étirer ne faisait que lui ajouter du blanc.
- **Pas de note inventée sous les barres de la fiche client** : le client a donné les deux durées, rien de plus.
  Sur un cas réel, on ne comble pas les trous — une carte plus courte est préférable à une phrase plausible.
- **La légende des compteurs date la mesure** (2026-09-20) : « Statistiques mesurées au bout de 6 semaines
  d'utilisation. » Fourni par le client. Si les compteurs sont mis à jour, **mettre à jour la durée avec eux** :
  un nombre sans sa fenêtre de mesure n'est pas vérifiable.
- **Le logiciel de gestion du client est nommé** (`casClient.logiciel` = Extrabat) : c'est le seul nom de
  logiciel tiers du site, **exception assumée au piège 17**, qui interdit les marques dans les démonstrations
  inventées. Ici, ce n'est pas une démonstration : c'est ce qui a été construit. Le **nom seul**, jamais le
  logo, jamais de mention de partenariat ou de certification. `null` fait disparaître la phrase entière.

#### Le cas (L'Atelier des Sols & Fils)
- Première exception à la règle « les exemples sont illustratifs, jamais un résultat client » (§5, voir
  « Contenus éditables ») : section dédiée (`Clients.astro`, `#cas-client`), distincte de la collection
  `exemples`, réservée à un **cas réel, nommé avec l'accord explicite du client**. Ne pas généraliser sans le
  même accord pour chaque nouveau cas ; par défaut, un nouveau cas client reste dans `exemples` (illustratif).
- Placée après Exemples, avant SousLeCapot ; `border-t border-border bg-bg-subtle` (alternance de fond),
  pas de `border-b` : le bord bas est fourni par le `border-y` de SousLeCapot. Offre, juste au-dessus, n'a pas
  non plus de `border-t` : celui-ci lui vient du `border-y` de la Méthode.
- Les chiffres d'impact (2 min pour un devis, et les compteurs de production) sont les résultats mesurés du cas
  réel. La démonstration (`EnchainementClient`) illustre le *mécanisme* : client, commune, montants et créneaux
  sont inventés, jamais issus d'une pièce commerciale réelle. **La règle d'invention reste entière** ; seule sa
  mention visible (« Scénario type : … pas une pièce réelle ») a été retirée le 2026-09-19, sur demande
  explicite. Ne pas la remettre sans le redemander.
- **Aucune donnée de tiers** (client final de L'Atelier des Sols & Fils, montant d'un devis réel, numéro de pièce) :
  seul le nom de l'entreprise cliente de sosese apparaît, avec son accord. Voir piège 17.
- **Identité du client** (2026-09-18) : nom, métier, prénom du dirigeant (**Jason**), lien vers son site et logo
  vivent dans `casClient`, `src/config/site.ts` — publiés **avec son accord explicite**, comme le reste de la
  section. Rien ne s'ajoute là sans le même accord : un prénom est une donnée personnelle, pas un détail de mise
  en page.
- **Logo** : fichier fourni par le client, déposé dans `public/clients/` (`casClient.logo` = son chemin). Le
  composant vérifie sa présence au build (`existsSync`, `process.cwd()` — pas `import.meta.url`, qui pointe sur
  un chunk après compilation) : **fichier absent, pas d'image** — jamais de vignette cassée, jamais de logo
  reconstitué. La largeur est déduite du `viewBox` du SVG pour réserver la place (CLS 0).
- **Le logo est posé sur une plaque `.section-invert`** : le lettrage du client est blanc sur fond transparent,
  il disparaîtrait sur le fond clair. Une plaque sombre dans les deux thèmes (même procédé que le terminal) plutôt
  qu'un logo retouché — on ne modifie pas l'identité d'un tiers. Tout nouveau logo de client se juge d'abord sur
  les deux fonds.
- **Un seul lien vers le site du client** : porté par le nom (`Badge href`, avec `↗` en `aria-hidden`). Le logo,
  juste à côté, est décoratif (`alt=""`) — deux liens vers la même destination alourdissent la navigation au
  clavier et au lecteur d'écran sans rien apporter.
- Le temps d'un devis est révélé ligne par ligne au défilement (`CompareBars reveal`, voir « Schémas »).
- Pas de jargon technique (MCP, API, JSON…) dans la section, y compris dans les micro-labels mono : eyebrow
  labels en français neutre (« Aperçu du principe », « sur place, à la voix », « et ensuite, vos chiffres »).
- **`EnchainementClient`** (2026-09-17, remplace l'îlot React `DicteeChiffrageDemo`, supprimé) : montre un
  **enchaînement de fonctions** sur un même client — 01 fiche client dictée sur place, 02 devis rattaché à cette
  fiche, 03 intervention posée —, puis **04 l'analyse** : l'IA consulte les données déjà présentes et propose des
  axes d'analyse, **en lecture seule** (asymétrie volontaire, comme dans le hero). Chaque écriture porte le « oui ».
- Joué **en boucle** (~25 s) : l'étape en cours prend `border-accent`, ses éléments `data-cc-pas` apparaissent un à
  un, tenue finale 3,8 s, fondu, reprise. Même contrat que le mockup du hero : état final rendu par le serveur,
  contenu toujours dans le DOM (`opacity` seule, CLS 0 mesuré), rien sous mouvement réduit, **bouton pause toujours
  rendu** (WCAG 2.2.2 — en pause, l'état complet est réaffiché), arrêt hors écran. Pas d'`aria-hidden` : tout le
  contenu est du vrai texte.
- **Le cadre d'une liste porte `data-cc-pas`, pas sa première ligne** : sinon il apparaît vide avant son contenu
  (même règle que la Méthode).
- JS natif et non React : un îlot de moins sur l'accueil.

Non réalisés (prévus au cahier des charges, jamais nécessaires) : BorderBeam, Tabs.
Toujours réutiliser avant de créer.

### Constat — étiquettes de coût
Au bas de chaque carte du constat, deux étiquettes en `--accent` traduisent le problème en risque :
« perte de temps / risque d'erreur », « occasions manquées / perte de contrôle », « délais
supplémentaires / dépendances ». C'est ce que retient un visiteur qui survole la section.

- **Une seule ligne par carte, à la plus grande taille possible** (demandes du 2026-09-19). Tout le
  reste en découle.
- **Trois colonnes à partir de `xl`**, plus `md` : mesuré, une carte offre 176 px de contenu à 768 px,
  254 px à 1024 px, 302 px à partir de 1152 px — et **302 px est un plafond**, le conteneur étant
  plafonné à 72 rem. Sous `xl`, une colonne : les cartes sont larges (639 px de contenu à 768 px), la
  ligne ne se coupe jamais. **À `lg`, la paire la plus longue passe à deux lignes** — ne pas y remonter
  la grille sans raccourcir les étiquettes.
- **`text-14`, la plus grande taille de l'échelle qui tienne.** Mesuré dans la carte réelle sur la
  paire la plus longue (carte 3), contre 302 px : `text-12` → 264 px, **`text-14` → 288 px**,
  `text-15` → 318 px, `text-16` → 336 px. Il reste 14 px de marge ; `text-16` déborde quelle que soit
  la longueur des libellés. Mesures refaites **sans la webfont** : la police de secours est 3 px plus
  étroite, le FOUT ne peut pas casser la ligne.
- **19 caractères par étiquette au plus.** « opportunités manquées » (21) débordait, « occasions
  manquées » (18) aussi une fois passé en `text-14` (300 px pour 302) ; « occasions perdues » (17)
  passe. Toute étiquette plus longue impose de revenir à `text-12`.
- **Apparence d'un `Badge variant="accent" dot`, en plus compact** : même fond `--accent-soft`, même
  pastille `--accent-bright`, même texte `--ink` (`accent` sur `accent-soft` = 4,28:1 en clair, donc
  jamais de texte accent sur ce fond). Pas le composant lui-même : ses `h-6`, `px-2`, `gap-2` et sa
  police mono demandent 277 px pour la paire la plus courte, 320 px pour la plus longue — davantage que
  ce que la grille offre à n'importe quelle largeur. D'où la reprise en local : police sans, `px-1.5`,
  `py-0.5`, pastille `size-1`. **Si le Badge de série devient plus compact, revenir au composant.**
- `mt-auto` sur la rangée : les étiquettes s'alignent d'une carte à l'autre quelle que soit la longueur
  du texte au-dessus. `flex-wrap` est conservé comme filet de sécurité — jamais de débordement de carte.
- Vérifié avec **et sans** la webfont (`--disable-remote-fonts`) : la police de secours est 2 px plus
  étroite, le FOUT ne peut pas casser la ligne.

### Bandeau d'engagements
- Rangée fluide (`flex-wrap`, libellés en `whitespace-nowrap` à partir de `sm`), pas de grille à colonnes fixes :
  les libellés mono de longueurs inégales débordaient des colonnes et faisaient défiler toute la page (piège 12).
- Sous `sm`, une colonne, libellés autorisés à passer à la ligne. Libellé le plus long : ≈ 32 caractères.
- Contenu et registre du bandeau : voir « Copy (ligne éditoriale) » — pas de « elle » ici, le pronom n'a pas
  encore d'antécédent à cette hauteur de page.

## Copy (ligne éditoriale)
Passe du 2026-09-19 : la promesse de l'accueil est resserrée sur « on part de vos outils, l'administratif en
moins, vos données enfin utiles, elle prend les devants, vous l'améliorez en l'utilisant, elle ne garde rien ».
Aucun chiffre du cas client, aucune durée de la méthode n'a été touché.

- **Mots simples, concepts d'adulte.** Le registre n'est jamais oral appuyé : ni « calé », ni « vaut le coup »,
  ni « c'est top ». Un mot courant à la place d'un mot technique, jamais une phrase qui prend le lecteur de haut.
- **Vocabulaire retiré de l'accueil** : *studio IA*, *cartographier vos processus*, *livrable* (→ « vous
  recevez »), *système d'information* (→ « vos logiciels »), *réversibilité* (→ « vous pouvez reprendre la
  main »), *accord explicite* (→ « votre oui »), *documentation remise à la livraison* (→ « le mode d'emploi est
  livré avec »). Le jargon reste autorisé dans « Sous le capot » **uniquement** (§2.1) — et sur `/a-propos`,
  « studio » décrit ce que sosese est, ce qui est le sujet de la page.
- **« elle » désigne la solution, et a besoin d'un antécédent.** La solution est nommée une seule fois, dans le
  chapeau de l'offre (« une solution qui connaît vos prix… **Elle** prépare le travail »). Partout **au-dessus**
  de ce chapeau — hero, bandeau, constat — le pronom est interdit : un lecteur qui arrive par le haut n'a pas
  encore de sujet. En dessous (offre, cas client, confiance, FAQ), « elle » partout, plus jamais
  « l'automatisation » comme sujet.
- **Règles ≠ données.** « Elle retient vos corrections » (offre) et « rien n'est mémorisé par défaut » (bandeau,
  confiance) se contredisent si les deux objets ne sont pas nommés séparément. Formulation canonique : *elle
  garde vos règles, pas vos données*. **Ne jamais écrire que la solution « apprend de vos documents ».**
- **Pas de promesse d'impossibilité.** Un LLM est dans la boucle : on écrit « elle ne calcule jamais un prix
  elle-même, elle lit vos tarifs dans votre logiciel », jamais « impossible par construction ». La garantie
  tient à la porte de validation, pas à une propriété du modèle.
- **Pro-activité (2026-09-19)** : « elle prend les devants » est tenue par des routines — heure fixe ou seuil de
  déclenchement. Le copy nomme les deux (« tous les lundis matin, ou dès qu'un dossier dépasse le délai que vous
  avez fixé ») : la promesse doit rester adossée à un mécanisme réel.
- **Exception à B8 (un argument, un seul endroit)** : « rien n'est mémorisé par défaut » est énoncé **en fait**
  dans le bandeau d'engagements (réflexe de méfiance nº 1 face à l'IA) et **argumenté** une seule fois, dans la
  section Confiance. Aucun autre argument n'a droit à ce doublon.
- **Titres de cartes scannés, pas lus** : ce qu'on veut faire savoir est dans le titre. C'est pourquoi la carte
  de Confiance s'appelle « Rien de mémorisé, rien qui serve à entraîner l'IA » et non « Aucun entraînement » avec
  la mémoire dans le corps. La grille `lg:grid-cols-4` impose **quatre cartes** : toute carte ajoutée en remplace
  une autre ou fusionne avec elle.
- **Porte de validation (Confiance)** : le libellé est passé de « votre accord » à « elle attend votre oui »,
  puis à **« votre oui »** seul le 2026-09-20. Entre deux panneaux qui disent « Elle avance seule » et « Elle
  s'arrête net », la phrase entière était redondante ; deux mots dans une pastille tiennent en `nowrap` sans
  manger la largeur des panneaux, ce que l'ancien libellé imposait de corriger au `lg:whitespace-normal`.
- **Méthode : des noms courts en titre** (Atelier / Feuille de route / Construction), la phrase d'action en
  première ligne de description. Trois titres commençant par « On » font de sosese le sujet de sa propre
  méthode, et ne se survolent pas.
- **Cas client** : pas de « réel » ni de « vrai » dans l'eyebrow — on ne précise « vrai » que là où le doute
  existe. L'eyebrow est `Cas client`, les chiffres prouvent. La note de `CompareBars` dit « avant la fin du
  rendez-vous » : l'image du camion appartient au chapeau, elle n'est pas répétée.

## Décisions et écarts par rapport au cahier des charges
- **`.section-invert` complétée** avec `--border-strong`, `--accent-hover`, `--accent-bright`, `--accent-soft`
  (absents du §3.3, fuite du thème clair sinon).
- **Badge accent en `text-ink`** au lieu de `text-accent` (contraste, voir tableau).
- **CTA mobile** : bouton flottant toujours visible (demande explicite), et non « après le premier scroll » (§4).
- **Hydratation : tous les îlots en `client:idle`** (ThemeToggle, MobileNav, TerminalDemo, ContactForm ; DicteeChiffrageDemo jusqu'au 2026-09-17), au lieu du
  `client:visible` du §6.1. Mesuré au Lot 5 : tout îlot chargé avant l'affichage du titre (`client:load`, ou
  `client:visible` au-dessus de la ligne de flottaison) fait partir le runtime React (63 ko) tôt et porte le LCP
  mobile simulé à 2,0–2,1 s ; en `client:idle`, 1,5–1,7 s. Le HTML serveur de chaque îlot est déjà utilisable
  (thème posé par le script inline, terminal dans son état final, formulaire rendu) : rien ne change à l'écran avant
  l'hydratation. **Ne pas repasser un îlot en `client:load`** sans remesurer.
- **Terminal du hero animé malgré `prefers-reduced-motion`** (demande explicite, 2026-09-15) : sous ce réglage, le
  terminal restait figé et paraissait cassé (constaté sur un poste GNOME aux animations coupées). Écart assumé à la
  règle « Toute animation respecte prefers-reduced-motion », limité au terminal : c'est du texte tapé, sans
  déplacement ni zoom, et le bouton pause reste toujours disponible. Options écartées : un seul passage puis figé,
  bouton « Lire l'animation ». **Ne pas étendre** à la démo du cas client, au FlowDiagram ni aux transitions.
- **Menu mobile en `<dialog>` natif** : piège de focus, Échap et restitution du focus fournis par le navigateur,
  sans dépendance. Le défilement de la page est bloqué sur `<html>` à l'ouverture et rétabli sur l'événement `close`.
- **Hero : mockup métier, pas terminal** (2026-09-16, suite à la cible 1–50 salariés). Un terminal noir évoque au
  dirigeant de PME le prestataire informatique dont il se méfie ; `DicteeMobile` lui montre son métier : une phrase
  dictée depuis le chantier, le chiffrage fait sur son catalogue, la réponse qui revient dans le même fil, au
  téléphone comme au bureau, et la porte de validation avant création. Le terminal descend dans « Sous le capot ».
  Effet de bord mesuré : plus aucun îlot React au-dessus de la ligne de flottaison, le hero est du HTML pur.
- **Offre resserrée sur une seule chose, et démonstration descendue du hero** (2026-09-17, demande explicite).
  « Audit & diagnostic » et « Ateliers & acculturation » répétaient les étapes 1 et 2 de la Méthode, juste
  au-dessus : supprimées. Le mockup `DicteeMobile` quitte le hero pour l'offre, en face des arguments — c'est là
  qu'il prouve la polyvalence au lieu de servir d'illustration d'accueil. Le `FlowDiagram` de la carte part avec
  (doublon). Conséquence à accepter : **une prestation d'audit détachable n'est plus vendue comme telle sur
  l'accueil**, la Méthode la porte seule.
- **Exemples illustratifs retirés, cas client renforcé** (2026-09-18, demande explicite). La section `Exemples`
  précédait le cas client réel et disait la même chose en moins bien : des cas types inventés juste avant des
  chiffres mesurés. Supprimée, avec sa collection et son composant `MicroFlux`. En face, le cas client gagne
  l'identité du client — logo, lien vers son site, prénom du dirigeant — c'est-à-dire ce qui distingue un cas
  réel d'un cas type : **on peut aller vérifier**. Conséquence à accepter : l'accueil ne montre plus de deuxième
  domaine d'activité que par les cinq scénarios de `DicteeMobile`, dans l'offre.
- **Hero : schéma de convergence, pas mockup d'interface** (2026-09-17, demande explicite). Le mockup était jugé
  trop « geek » en ouverture : il montrait un connecteur, des règles lues et des sources d'outils, c'est-à-dire le
  *comment*. Le hero dit maintenant le *quoi* : vos données sont déjà là, éparpillées, elles alimentent un seul
  endroit, et il en sort du travail déjà fait. Formulation retenue par l'humain : **« moins de tâches à faire, pas
  plus »** — le hub propose des actions accomplies, jamais une liste de choses à faire. Une variante « la question
  du matin » (on pose une question, la réponse revient) a été écartée au profit du schéma, plus direct.
  **Simplifié le même jour**, après une première version jugée trop chargée : plus de cadre sombre, largeur réduite
  (`max-w-md`), cinq sources ramenées à **trois** plus une ligne « … et tous les autres », propositions d'une ligne,
  tracé orthogonal, et surtout **une seule passe au lieu d'une boucle** — donc plus de bouton pause (voir « Schéma
  du hero »).
  **Coût mesuré** (même machine, 3 passages, mobile 360 px bridé 4G + CPU ×4) : LCP médian 696 ms sur `main` contre
  **740 ms** sur la branche, soit **+44 ms** ; HTML de l'accueil +0,5 ko gzip, JS +0,6 ko (77,0 ko au total). Le
  surcoût vient du DOM ajouté, pas du transfert : l'accueil porte désormais **deux** démonstrations. Si la mesure en
  production dérive, le levier est là — alléger `DicteeMobile` (moins de scénarios) plutôt que le schéma du hero,
  qui est au-dessus de la ligne de flottaison. Gain au passage : hero 585 px contre 707 px.
- **Hero animé, cinq tâches en boucle** (2026-09-16 ; précédent / suivant ajoutés le 2026-09-17). Écrit en JS natif
  (~2 ko gzip) et non en îlot React : garder le hero en HTML pur est ce qui tient le LCP. Mesuré : 79,1 ko de JS
  sur l'accueil, LCP inchangé, CLS 0. **Contrepartie assumée : le cycle complet dure ~50 s**, donc un visiteur qui
  ne reste pas ne verra pas les cinq. Réduire le nombre de scénarios ou la tenue finale (`TENUE`) est le levier.
- **Calculateur en JS natif `is:inline`** (2026-09-16) plutôt qu'en îlot React : deux curseurs et une
  multiplication ne valent pas le runtime. L'empreinte sha256 du script est calculée au démarrage du serveur
  depuis `dist/` — rien à configurer, mais **le serveur doit être redémarré après chaque build** (déjà vrai, piège 16).
  Le résultat rendu par le serveur est déjà juste : sans JS, le bloc reste une estimation lisible.
- **Scripts des composants en fichiers externes** (2026-09-17, mesuré avant mise en production). Le hero à cinq
  scénarios et la démonstration du cas client ont porté le HTML de l'accueil de 12,6 à 19,5 ko (brotli, tel que servi),
  au-delà de la première fenêtre TCP (~14 ko) : LCP Lighthouse mobile de 1,5 s (`main`) à 1,8–2,3 s. Les trois
  scripts (hero, Méthode, cas client) étaient en `is:inline` ; ils sont désormais de simples `<script>` Astro, et
  `vite.build.assetsInlineLimit` (`astro.config.mjs`) empêche Astro de les réinjecter dans la page même s'ils font
  moins de 4 ko. Résultat : HTML servi 16,2 ko, LCP 1,8 s (4 passages sur 5), fichiers `/_astro` en cache immuable.
  **Ne pas remettre `is:inline`** sur ces composants. **Écart restant assumé** : ~0,3 s de LCP simulé de plus que
  `main`, dû au contenu lui-même (cinq scénarios empilés, démonstration en quatre étapes). Les leviers, si la mesure
  en production dépasse 1,8 s : moins de scénarios dans le hero, ou démonstration du cas client allégée.
- **Coût du runtime React** : ~67 ko gzip dès qu'un îlot est présent.
  Mesuré le 2026-09-15 avec le cas client : ~74 ko gzip de JS sur l'accueil (runtime 67 ko + îlots ~7 ko).
- **Budget JS porté à 150 ko gzip sur l'accueil** (décision du 2026-09-16, écart au §8.1 qui fixait 100 ko).
  Le plafond monte, **l'objectif ne change pas** : temps de chargement minimal, LCP < 1,8 s, CLS 0. Les 76 ko
  dégagés ne sont pas un budget à dépenser, mais une marge pour les évolutions de la v2. Conditions :
  toute dépendance ajoutée est **très légère** (< 10 ko gzip, vérifié avant installation, jamais un paquet
  qui en tire d'autres) ; à fonctionnalité égale, on préfère du JS natif en ligne à une bibliothèque, et un
  composant Astro statique à un îlot ; le JS gzip de l'accueil est **remesuré et consigné ici à chaque lot**,
  avec le LCP. Dépasser 120 ko sans gain de LCP mesuré = le changement est refusé.
- **Cible éditoriale : PME de 1 à 50 salariés** (décision du 2026-09-16), sans fermer la porte aux structures
  plus grandes — celles-ci restent accueillies, mais le site ne leur parle pas en priorité. Conséquences pour
  la rédaction : vocabulaire du dirigeant qui fait lui-même, pas du responsable informatique ; pas de
  « service IT », « conduite du changement » ni « gouvernance » ; les chiffres d'exemple sont à l'échelle
  d'une petite structure. `src/pages/a-propos.astro` annonce encore « de 15 à 150 personnes » : **écart connu**,
  corrigé dans la passe de réécriture de la v2 (item B1 de `REVUE-V2.md`), pas avant.
- **Visuels : schémas SVG, pas d'images** (décision du 2026-09-16). Toute nouvelle illustration est un schéma
  en SVG en ligne (ou un mockup construit avec les tokens), jamais un bitmap, jamais un fichier importé d'une
  banque d'images. Trois registres autorisés et pas un de plus : schéma de flux, mockup stylisé d'interface,
  comparaison de grandeurs (barres, jauges). Un schéma **remplace** du texte, il ne s'y ajoute pas. Contrat
  identique à celui des îlots existants : état final rendu côté serveur, dimensions fixes (CLS 0), équivalent
  textuel (`aria-label` ou `sr-only`), couleur jamais seule porteuse de sens, animation en enrichissement sous
  `prefers-reduced-motion`. Seules exceptions bitmap prévues : le portrait de `/a-propos` et l'image de partage
  Open Graph, toutes deux via `astro:assets`, dimensions déclarées. Détail dans `REVUE-V2.md` §4.
  **Exception ajoutée le 2026-09-18 : le logo d'un client** (cas client). Un logo n'est pas une illustration :
  c'est l'identité d'un tiers, on ne la redessine pas. Fichier fourni par le client, déposé dans `public/`, servi
  tel quel — pas d'`astro:assets` (l'image ne doit être ni recadrée ni recomposée), `loading="lazy"`, dimensions
  déclarées. Un seul logo de client à la fois, et seulement dans la section « Cas client ».

## Exceptions connues aux valeurs en dur
Tolérées, à ne pas étendre sans raison :
- `letter-spacing` : `-0.02em` (titres), `0.08em` (eyebrow), `tracking-tight` (wordmark, gros titres).
- Anneau de focus : `2px` d'épaisseur et de décalage.
- `grid-cols-[2fr_1fr_1fr_1fr]` dans le footer (proportions de grille, pas un espacement).
- `max-w-xs` sur l'accroche du footer (échelle de largeurs Tailwind conservée).
- `public/favicon.svg` : `#F59E0B` en dur (fichier statique, hors CSS).
- Points de rupture de `tokens.css` (`768px`, aligné sur `md:`) et de `global.css` (`1280px` pour FlowDiagram, aligné sur `xl:`).
- Terminal : curseur en unités relatives à la police (`h-[1em] w-[0.55em] translate-y-[0.15em]`) et lignes vides en `min-h-[1lh]`.
- Proportions de grille : `lg:grid-cols-[1fr_1fr]` (hero), `lg:grid-cols-[1fr_2fr]` (FAQ), `lg:grid-cols-[1fr_auto_1fr_auto_1fr]` (schéma d'intégration).
- Formulaire : champ piège positionné hors écran (`-left-[9999px]`), largeur de colonne des `dl` de `prose-site` (60 × `--space-unit`).
- DotPattern : points de 1px et masque radial (20 % → 75 %) dans l'utilitaire `dot-pattern`.
- Mockups animés (`VracEnActions`, `RotationEcrans`, `DicteeMobile`, `EnchainementClient`) : les **filets** —
  bordures, tiges de liaison, fil du balayage — sont en `px` (`1px`, `1.5px`), pas en `cqw`. Un trait en `cqw`
  passe sous le pixel aux petites largeurs et disparaît. Tout le reste de ces scènes est bien en `cqw`.
- Formulaire : `mt-0.5` sur la case de consentement (alignement optique sur la première ligne de texte).
- EnchainementClient : seuil `IntersectionObserver` à 0,3 ; rythme en millisecondes dans le script (`PAS` 520, `TENUE` 3 800…).
- RotationEcrans : CSS de composant reprise d'une maquette — tailles en `cqw` (la maquette se redimensionne d'un
  bloc), `--rot-entree` 420 ms et `--rot-attente` 260 ms (ramenées à 0 sous mouvement réduit), rythme en
  millisecondes dans le script (`TOUR`, `ENTREE`, `SORTIE`), seuil `IntersectionObserver` à 0,2. **Couleurs : que
  des tokens**, aucune exception.
- Icônes de la section Confiance : tracés SVG en ligne dans le composant (`set:html` sur des chaînes statiques, jamais sur du contenu éditable).
- Délai d'impulsion du FlowDiagram calculé en ligne (`--flow-delay`, pas de 600 ms).
- Schémas : largeur de barre calculée en ligne (`max(<pct>%, calc(var(--space-unit) * 2))`) et proportions en
  `flex-grow` — des proportions, pas des espacements.
- `Clients` : grille `lg:grid-cols-[3fr_2fr]` (schéma large, appoint étroit).
- `Methode` : pas de révélation de 260 ms (420 ms pour un trait) dans le script, décalage `translateY(calc(var(--space-unit) * 3))` de `.revele-cache`.
- `CompareBars reveal` : même pas de 260 ms, seuil `IntersectionObserver` à 0,25.
- `Clients` : logo rendu en `h-12` (48 px), largeur calculée depuis le `viewBox` du SVG.
- `Offre` : pastilles d'icônes en `size-9`, tracé en `size-5` (échelle Tailwind, comme les cartes de Confiance).
- `ConvergenceDonnees` : `viewBox` 100 × 100 en `preserveAspectRatio="none"` et `viewBox` 16 × 24 de la flèche
  (proportions, pas des espacements), `stroke-width` 2 en `non-scaling-stroke`, et les coordonnées des tracés —
  géométrie d'un schéma, calculée dans le composant et commentée là-bas. `max-w-md` (échelle Tailwind conservée,
  comme `max-w-sm` de `DicteeMobile`) et `pb-3 -mb-3` sur la zone de dessin (débord volontaire dans le `gap`).
- `DicteeMobile` : `max-w-sm` (largeur de téléphone, échelle Tailwind conservée comme pour le footer), et
  `rounded-br-sm` / `rounded-bl-sm` sur les bulles — le coin rentrant qui fait lire une bulle de conversation.

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
    en ligne qu'à partir de la largeur qui les contient (FlowDiagram horizontal seulement ≥ xl).
    Revers : un libellé `whitespace-nowrap` plus long que sa colonne déborde **sans rien signaler** et fait défiler
    toute la page horizontalement (cas du bandeau d'engagements). Après tout ajout ou allongement de libellé, vérifier
    `document.documentElement.scrollWidth` à 360, 640, 1024 et 1280 px.
13. **Captures headless sur une ancre (`/#section`) vides** : Chrome headless rend mal le défilement. Capturer la
    page entière (fenêtre très haute) et découper. Dans ce cas, le vide sous la dernière section est normal : `main`
    est en `flex-1` et le footer est poussé en bas de la fenêtre.
14. **`rm -rf` est interdit** par `.claude/settings.json`, y compris dans le scratchpad : une commande qui en contient
    un est refusée en entier. Utiliser de nouveaux noms de dossiers plutôt que de nettoyer.
15. **Fastify 5.12 : `disableRequestLogging` est déprécié** → `logController: new LogController({ disableRequestLogging: true })`.
16. **Réécriture d'URL et racine** : ne jamais réécrire `/` (→ `//`). Les routes « sans slash » sont inventoriées
    au démarrage à partir des `index.html` de `dist/` : un nouveau build impose un redémarrage du serveur.
17. **Cas client construit à partir d'un outil connecté (CRM Extrabat)** : ne jamais interroger de vraies pièces
    commerciales (devis, montants, coordonnées d'un client final) pour alimenter une page publique, même en
    lecture seule — un client final de L'Atelier des Sols & Fils n'a donné aucun accord pour apparaître sur sosese.tech.
    Seuls le nom de l'entreprise cliente (accord explicite) et des chiffres d'impact déjà validés avec elle
    peuvent être utilisés ; toute démonstration visuelle reste un scénario inventé, explicitement légendé comme tel.
18. **Animation qui ne tourne « que sur mobile ».** Une pause au survol (`onMouseEnter`) fige le terminal sur
    grand écran : il occupe la moitié droite du hero, le pointeur passe dessus dès qu'on le regarde. Sur tactile, pas
    de survol, donc l'animation tourne. Les captures headless ne le montrent pas (aucune souris). → Pause uniquement
    via un bouton explicite ; pour vérifier une animation, simuler un `mouseMoved` sur l'élément.
    Autre cause du même symptôme : le poste de test a les animations coupées (GNOME :
    `gsettings get org.gnome.desktop.a11y.interface reduced-motion` → `'reduce'`), le navigateur envoie
    `prefers-reduced-motion: reduce`. Vérifier ce réglage **avant** de chercher un bug d'animation.
19. **Montée de version majeure glissée dans un commit de version.** `chore: version 0.3.0` montait aussi
    `@fastify/static` 8 → 10, `nodemailer` 7 → 10 et `astro` 5 → 7. `@fastify/static` 10 ne passe plus d'objet
    doté de `res.setHeader` à `setHeaders` : crash à la première page servie, `/api/health` restant pourtant OK.
    Le test de démarrage de la CI a bloqué la publication (tag `v0.3` jamais publié, correctif en `v0.4`).
    **Récidive le 2026-09-17 sur `v0.6`**, avec les mêmes paquets (patchs plus récents : la montée a été
    re-résolue, pas recopiée d'une ancienne branche). Même symptôme, même blocage par la CI ; correctif en `v0.7`
    (dépendances et lockfile de la `v0.5` restaurés, build identique au build audité : mêmes empreintes `/_astro`).
    La recette du RUNBOOK (§2.1) n'appelle plus `npm install` et impose un `git diff` de contrôle.
    → Un commit de version ne touche que `version` (`git diff` de `package.json` : une ligne). Les montées de
    dépendances se font dans leur propre branche `chore/`, avec `npm ci && npm run build && npm start` et un
    parcours des pages avant la PR.

20. **Texte SVG dans un schéma qui s'étire.** Un `<text>` dans un SVG à `viewBox` suit l'échelle du viewBox : les
    libellés du schéma du hero, écrits en `text-12`, tombaient à **~8 px à 360 px de large** alors qu'ils faisaient
    ~14 px à 1280 px. Aucun avertissement, et les captures en grand écran ne le montrent pas.
    → Les libellés d'un schéma qui s'étire sont du **HTML** posé au-dessus du SVG ; le SVG ne porte que la
    géométrie. Corollaire utile : si le HTML est opaque, les tracés peuvent passer dessous et aucun calage au pixel
    n'est nécessaire.
21. **Courbes qui passent derrière des blocs opaques.** Dans une zone large et basse, des courbes qui convergent
    depuis une colonne de pastilles repassent sous les pastilles du bas : on ne voit plus que des fragments, et le
    schéma devient illisible. Deux symptômes voisins : des tracés qui se pincent sur un point unique se lisent comme
    des rayons, et un tracé qui s'arrête dans le vide se lit comme un cul-de-sac.
    → Dans une zone étirée, préférer un **tracé orthogonal** (départs horizontaux, tronc vertical) placé à droite de
    tout ce que porte la colonne, et faire finir chaque tracé **dans** un bloc ou par une pointe.
22. **SVG en `absolute` avec `top` et `bottom` : la hauteur n'est pas celle qu'on croit.** Un SVG est un élément
    remplacé : `top-0` + `-bottom-3` ne l'étirent pas, il reprend le ratio de son `viewBox`. Mesuré le 2026-09-17 :
    448 px de haut au lieu des 148 attendus, donc un tracé qui traversait la moitié de la page.
    → Donner sa hauteur au **parent** (`pb-3`, et `-mb-3` si le débord doit manger un `gap`) et poser le SVG en
    `inset-0 size-full`.
23. **`pathLength` est ignoré quand `vector-effect="non-scaling-stroke"` est posé.** Le tiret d'un
    `stroke-dasharray="1"` normalisé par `pathLength="1"` vaut alors **1 pixel** : la liaison apparaît en pointillé
    minuscule au lieu de se tracer. Vérifiable en une ligne (`getComputedStyle(path).strokeDasharray` → `"1px"`).
    → Les deux ne se combinent pas. Soit on renonce à `non-scaling-stroke`, soit — comme ici — on révèle le tracé à
    l'opacité, ce qui est de toute façon plus simple.
24. **`import.meta.url` ne pointe pas sur les sources dans le frontmatter d'un `.astro` au build.** Lire un fichier
    du dépôt avec `new URL("../../../public/…", import.meta.url)` marche en `dev` et échoue silencieusement au
    `build` : le module est alors un chunk de `dist`, l'URL vise à côté, `existsSync` répond `false` et le rendu
    part sans l'image — sans la moindre erreur. Rencontré le 2026-09-18 sur le logo du cas client.
    → Résoudre depuis `process.cwd()` (Astro est toujours lancé depuis la racine du projet), et **vérifier dans
    `dist/`**, pas seulement en `dev`.
25. **Une révélation séquentielle calée sur l'index des éléments se désynchronise dès qu'ils ne sont plus alignés.**
    Un balayage qui traverse un bloc et fait basculer les éléments « lus » derrière lui ne peut pas tirer son délai
    d'un `calc(var(--i) * 300ms)` : ça ne tient que si les éléments sont d'égale largeur et régulièrement espacés.
    Dès qu'ils sont posés librement — des post-it de tailles et de positions différentes — le balayage passe sur
    l'un pendant qu'un autre s'allume. Rencontré le 2026-09-19 sur `VracEnActions`.
    → Calculer le délai depuis la **position horizontale réelle** de chaque élément (`lu(centre)` dans le
    frontmatter, à partir des mêmes % que ceux qui le positionnent), et animer le balayage en `linear` : deux
    courbes d'accélération différentes suffisent à décaler le tout.
26. **Un mockup qui porte déjà `section-invert` disparaît quand on le pose dans une section invert.** `DicteeMobile`
    a son propre `section-invert` pour rester sombre dans les deux thèmes. Descendue dans « Sous le capot », qui
    l'est aussi, il ne lui restait que sa bordure : même fond, aucun relief. Rencontré le 2026-09-19 (elle en est
    ressortie depuis, mais la règle vaut pour tout mockup qu'on y descendrait).
    → L'encadrer dans une carte `bg-surface` (`--surface` reste un cran plus clair que `--bg` dans le jeu invert),
    et la contraindre en largeur — une carte pleine largeur autour d'un mockup de 24 rem fait une boîte vide.

27. **Une animation en `both` dont la dernière image est l'état éteint écrase pour toujours la règle
    d'état.** Un balayage qui passe sur une liste — chaque élément s'allume puis s'éteint — se pose
    naturellement en `animation: scan … both`. Mais l'élément qui doit *rester* allumé ensuite ne le
    fait jamais : le `fill: both` conserve la dernière image du balayage (état éteint) indéfiniment,
    et elle bat la déclaration simple `.choisi { color: var(--accent) }`, qui ne se voit donc plus.
    Aucune erreur, aucune console : l'élément reste simplement gris. Rencontré le 2026-09-20 sur la
    planche d'architecture du labo (compétence retenue du serveur).
    → L'élément qui survit au balayage a **son propre déroulé**, qui contient le passage du balayage,
    l'attente, puis l'allumage final ; sa dernière image est alors l'état d'arrivée et le `both` joue
    pour nous. Ne jamais compter sur une règle d'état pour reprendre la main après une animation `both`.
28. **Un enfant en `position: absolute` d'un conteneur `flex` se pose au début de la ligne.** Sa
    position statique n'est pas là où il est écrit dans le HTML : un élément hors flux d'un conteneur
    flex est aligné comme s'il était le seul élément, donc en `flex-start`. Un compteur posé après un
    libellé (« Vos règles 3 » puis « 4 » en fondu) atterrit sur la première lettre du libellé.
    → Empiler deux états au même endroit se fait avec une **grille d'une seule case**
    (`display: inline-grid` + `grid-area: 1 / 1`) : la boîte réserve la largeur du plus large, rien
    n'est sorti du flux, et le fondu croisé fonctionne partout.
29. **Une capture headless ne tombe jamais sur l'instant voulu.** `--virtual-time-budget=2600` ne
    garantit pas que la page est photographiée à 2 600 ms : le temps virtuel n'avance que quand il y a
    du travail, et les animations d'`opacity` sont composées hors du fil principal. Conséquence
    observée le 2026-09-20 : un état transitoire correct (vérifié par `getComputedStyle`) était
    absent de trois captures d'affilée, ce qui donne toutes les apparences d'un bug de CSS.
    → Pour photographier un état transitoire, figer explicitement :
    `document.getAnimations().forEach(a => { a.pause(); a.currentTime = T })` — `currentTime` inclut
    le délai, donc T se lit directement dans la feuille de style. C'est ce que fait `?fige=N` sur la
    page de contrôle du labo. `--run-all-compositor-stages-before-draw` aide, mais ne suffit pas.

## Anti-patterns
- Dégradés multicolores
- Imagerie IA stock (cerveaux, robots, réseaux de neurones)
- Illustration bitmap ou image de banque là où un schéma SVG fait le travail
- Bibliothèque JS ajoutée pour un effet qu'un composant statique ou quelques lignes de JS natif suffisent à produire
- Emojis dans l'interface
- Plus de 2 niveaux de titre par section
- WebGL, backdrop-filter sur mobile
- Faux témoignages, faux logos clients, chiffres inventés
- `transition-all`, animation sans `motion-safe:` ou sans token de durée
- Texte `--accent` sur fond `--accent-soft`


## V2 locale — architecture validée le 21 septembre 2026

- Six pages commerciales : accueil, accompagnement, cas Atelier des Sols & Fils, éditeurs, à propos, contact. Pages légales conservées à la demande du porteur.
- Public principal : indépendants/TPE/PME jusqu’à environ 50 salariés, Metz + environ 80 km. Parcours éditeurs distinct.
- Direction visuelle conservée : tokens, fontes, ambre, schémas, deux thèmes. Pas de nouvelles dépendances.
- Accueil raccourci : promesse, preuve, trois besoins, méthode synthétique, interlocuteur, trois questions, contact. L’ancien bouton flottant mobile n’est plus rendu.
- Données du cas centralisées dans `src/config/editorial.ts`. Durées qualifiées de rapportées, pas de ROI extrapolé. Les métriques de production sont datées.
- `src/components/v2` porte les nouveaux composants partagés. `ValidationGate` adapte le labo A5. `ProtocoleIntegration` reprend S3 en état final statique, sous un détail facultatif de la page éditeurs, avec texte équivalent.
- Le jargon technique est concentré dans « Sous le capot » de la page éditeurs. L’architecture du schéma est une possibilité, pas une promesse universelle.
- Les prototypes complets restent dans `references/src` en local, hors des routes Astro. Les sources originales du labo restent intactes dans la V1. Seules les adaptations utilisées sont versionnées.
- Les illustrations du hero et du cas affichent une mention visible de données fictives.
- Contact hydraté en `client:load` pour être disponible rapidement ; navigation et thème conservent leurs îlots existants. Sans JS, une alternative email est explicite.
- Le parcours biographique détaillé attend l’accès au profil LinkedIn fourni par l’utilisateur. Aucun employeur, diplôme ou nombre d’années inventé.
