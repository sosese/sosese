# DESIGN.md — sosese

## Règles non négociables
- Aucune couleur, rayon ou espacement en dur. Toujours un token.
- Une seule couleur d'accent. Jamais deux accents dans un même écran.
- --accent-bright n'est jamais une couleur de texte sur fond clair.
- Bordures 1px sur --border. **Cartes : bordure 1px `--border` + `--shadow-sm`** (relief doux, depuis le 2026-10-08,
  plan « site moins geek », étape 5 — l'ombre seule ne se voit pas en thème sombre, la bordure seule faisait
  « grille de tableau de bord »). `--shadow-md` reste réservée aux éléments flottants (bouton flottant, lien
  d'évitement, éléments posés dans les maquettes). Pas d'ombre sur ce qui n'est pas une carte : sections, listes,
  accordéons, filets.
- Tout doit être vérifié dans les deux thèmes avant d'être considéré comme fini.
- Toute animation respecte prefers-reduced-motion. **Seule exception : le terminal** (aujourd'hui dans « Sous le capot », voir « Décisions »).
- Aucun texte technique hors de la section "Sous le capot".
- Les composants interactifs sont des îlots React, **sauf** le mockup du hero, la révélation de la Méthode et la démonstration du
  cas client : JS natif dans une balise `<script>` du composant, servie en fichier externe (voir « Décisions »).
  Tout le reste est statique. Avant de créer un îlot, vérifier qu'un composant statique ou quelques lignes de JS natif ne suffisent pas.

## Tokens
Source unique : `src/styles/tokens.css`. Ils sont exposés à Tailwind dans `src/styles/global.css`
(`bg-bg`, `bg-surface`, `text-ink`, `text-ink-muted`, `border-border`, `bg-accent`, `text-on-accent`,
`rounded-md`, `shadow-md`, `text-14`, `font-display`, `font-mono`…). La palette, les rayons, les ombres, les tailles de texte
et les familles de polices par défaut de Tailwind sont désactivés : une classe comme `bg-red-500` ou `text-sm`
ne produit rien (et sans erreur, voir « Pièges »).

```css
:root {
  /* Base — thème clair */
  --bg:            #FCFBF9;
  --bg-subtle:     #F6F1E9; /* #F5F2ED jusqu'au 2026-10-08 */
  --surface:       #FFFFFF;
  --ink:           #14110E;
  --ink-muted:     #6B6259;
  --border:        rgba(20,17,14,0.10);
  --border-strong: rgba(20,17,14,0.18);

  /* Accent ambre */
  --accent:        #AC4F08; /* texte, bordures, fond de bouton (blanc dessus = 5,4:1) ; #B45309 jusqu'au 2026-10-08 */
  --accent-hover:  #92400E;
  --accent-bright: #F59E0B; /* décoratif uniquement : traits, glows, icônes */
  --accent-soft:   rgba(217,119,6,0.12);
  --on-accent:     #FFFFFF;

  /* Rayons */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-full: 999px;

  /* Ombres — sm : cartes (avec leur bordure) ; md : éléments flottants uniquement */
  --shadow-sm: 0 1px 2px rgba(20,17,14,0.04), 0 4px 12px rgba(20,17,14,0.05);
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

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.25);
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
| Typographie | `--font-sans`, `--font-display` (serif du témoignage seulement), `--font-mono`, `--text-12` … `--text-64`, `--text-body` (17px), `--leading-body` (1.6), `--leading-tight` (1.15), `--measure` (70ch) |
| Espacement / gabarit | `--space-unit`, `--section-y`, `--hero-y`, `--gutter`, `--container`, `--header-h`, `--fab-offset`, `--fab-clearance`, `--dot-gap` (pas de la trame DotPattern) |
| Mouvement | `--duration-fast` (150ms), `--duration-base` (200ms), `--duration-slow` (300ms), `--ease-out` — les durées passent à 0 sous `prefers-reduced-motion` |
| Boucles décoratives | `--duration-blink` (curseur du terminal), `--duration-loop` (impulsions du FlowDiagram) — jamais ramenées à 0 : les animations sont déclarées dans `@media (prefers-reduced-motion: no-preference)` |

### Contrastes vérifiés (WCAG AA, texte normal ≥ 4.5:1)
Recalculés le 2026-10-08 (étape 5, formule WCAG 2.x, fonds translucides composés sur le fond réel) après le passage
de `--accent` à #AC4F08 et de `--bg-subtle` à #F6F1E9. Le thème sombre et les sections invert n'ont pas changé.
| Couple | Clair | Sombre / invert |
|---|---|---|
| ink / bg | 18.19 | 17.25 |
| ink-muted / bg | 5.77 | 6.74 |
| ink-muted / bg-subtle | 5.31 (5.35 avant) | 6.42 |
| ink-muted / surface | 5.97 | 6.18 |
| accent / bg (texte accent, eyebrows) | 5.24 (4.86 avant) | 9.03 |
| accent / surface | 5.42 (5.02 avant) | 8.28 |
| accent / bg-subtle | **4.82** (4.49 ✗ avant) | 8.60 |
| accent / accent-soft (sur bg) | **4.62** (4.28 ✗ avant) | 7.28 |
| accent / accent-soft (sur surface) | 4.77 | 6.43 |
| ink / accent-soft | 16.04 | 13.90 |
| on-accent / accent (bouton) | 5.42 (5.02 avant) | 8.76 |
| on-accent / accent-hover | 7.09 | 11.27 |
| accent-hover / bg-subtle | 6.31 (6.35 avant) | 11.07 |

(La valeur sombre « accent / bg-subtle 6.42 » de l'ancien tableau était celle d'`ink-muted` : recalculée, 8.60.)

Conséquences :
- **Depuis le 2026-10-08, plus aucun couple sous AA** : `--accent` passe en texte sur `bg`, `surface`, `bg-subtle`
  et `accent-soft`, dans les deux thèmes. C'est ce qui permet les eyebrows de section en accent (voir
  « Typographie »).
- On garde pourtant les choix faits quand ces couples échouaient — ils restent justes, et la marge est mince
  (4,62 et 4,82) : Badge accent et actif de `RotationEcrans` en `--ink` sur `--accent-soft`, survol des questions de
  FAQ en `--accent-hover`. Une nouvelle teinte d'accent plus claire les ferait repasser sous AA.
Tout nouveau couple texte / fond doit être recalculé dans les deux thèmes avant usage.

## Thème
- `data-theme="light" | "dark"` sur `<html>`, posé par le script inline en tête de `<head>` (`Base.astro`)
  avant tout rendu : choix mémorisé (`localStorage`, clé `theme`), sinon préférence système.
- Sans choix mémorisé, un changement de préférence système est suivi en direct.
- Chaque thème fixe aussi `color-scheme` (barres de défilement, contrôles natifs).
- Variante Tailwind `dark:` branchée sur `data-theme`, à réserver aux cas où un token ne suffit pas
  (ex. icône soleil / lune).

## Typographie
Inter (corps, titres `h1` à `h4`, libellés) / Georgia (citation de Jason et ses deux chiffres seulement) / JetBrains Mono
(« Sous le capot » seulement, voir plus bas).
Échelle : 12 14 16 18 21 28 36 48 64. Corps 17px, line-height 1.6.
- Fichiers : `public/fonts/inter-var.woff2` et `jetbrains-mono-var.woff2`, polices **variables**, sous-ensemble
  **latin** de Fontsource (couvre é, à, œ, €, guillemets et tirets typographiques). Licences OFL à côté.
- Un seul fichier par famille couvre toutes les graisses. **Seul `inter-var.woff2` est préchargé** (2026-10-08) :
  la mono ne sert plus qu'en bas de l'accueil, dans « Sous le capot » ; son `@font-face` reste, le fichier est
  chargé à la demande. Voir piège 31 avant de remettre ou de retirer un préchargement.
- **JetBrains Mono : « Sous le capot » seulement** (2026-10-08, plan « site moins geek », étape 2) — la section,
  le terminal (`TerminalDemo`) et le labo (`src/labo/`, `src/pages/labo/`). Partout ailleurs, Inter : libellés,
  chiffres, badges, pied de page, flèches « → » des boutons, coches et « ! » des formulaires. Les chiffres
  qu'on compare en colonne prennent `tabular-nums` (valeurs de `CompareBars`, montants d'`EnchainementClient`,
  numéros 01 / 02 / 03 de `/contact` et `/a-propos`, pastilles de la Méthode).
  **Exceptions, non rendues sur une page publique et donc non converties** (invérifiables à l'écran) :
  `Calculateur`, `FlowDiagram`, `DicteeMobile`, `ConvergenceDonnees`, `AgentEnAction`, `VracEnActions`. Elles
  gardent la mono : **à convertir en Inter si l'une revient sur une page**, en revérifiant ses largeurs (piège 12).
- Noms de famille déclarés : `"Inter"` et `"JetBrains Mono"` (et non `"Inter Variable"`).
- Police de secours **`"Inter Fallback"`** (Arial / Liberation Sans / Helvetica locales) avec `size-adjust` et
  `ascent/descent/line-gap-override` mesurés sur `inter-var.woff2` : l'arrivée d'Inter ne change pas la taille du
  texte (pas de saut, pas de second LCP). **Remplacer le fichier Inter = remesurer ces valeurs.**
- Pas d'italique chargée. En ajouter une = nouveau fichier + `@font-face`, pas de faux italique.
- Titres `h1`–`h4` : `line-height: var(--leading-tight)`, `letter-spacing: -0.02em`, `text-wrap: balance`.
- **Titres `h1` et `h2` en Inter semi-gras (600), `tracking-tight`** — la police d'origine, rétablie le 2026-10-08
  (plan « site moins geek », étape 4 bis, décision de l'humain : préférence pour la police d'origine). Les classes
  sont **sur chaque titre** (`font-semibold tracking-tight`, comme avant l'étape 2) : `SectionHeading`,
  `PageHeader`, hero, CTA final, 404, `/a-propos`, `h2` d'étape de l'îlot `Questionnaire` ; `prose-site h2` en 600
  dans `global.css`. **Pas de règle de base `h1, h2`** : un titre ajouté sans classe sortirait en Inter 400, donc
  reprendre `SectionHeading` / `PageHeader` ou recopier les classes.
  - **`letter-spacing`** : la règle de base `h1`–`h4` donne -0,02em ; `tracking-tight` (-0,025em) la remplace sur les
    `h1` / `h2` qui le portent. `prose-site h2` et le `h2` de repli de `/a-propos` (section masquée) restent à
    -0,02em, comme avant l'étape 2.
  - **Historique** : du 2026-10-08 (étape 2) à l'étape 4 bis, les `h1` / `h2` étaient en serif 400 (Georgia,
    puis Noto Serif en repli) par une règle de base dans `global.css`. Retiré : ne pas remettre cette règle.
- **Serif (`--font-display`, utilitaire `font-display`) réservée au témoignage** : la citation de `Temoignage` et
  les deux chiffres de `Clients`, pour qu'ils se détachent comme une parole. **Aucun autre usage** (`grep -rn
  "font-display" src` : `tokens.css`, `global.css`, `Temoignage.astro`, `Clients.astro` — les `font-display: swap`
  des `@font-face` sont un descripteur homonyme). Graisse 400 (Georgia n'a que 400 / 700 ; le gras y sonne titre
  de journal), interlettrage normal.
  - **Pile `Georgia, "Noto Serif", serif`** (correction du 2026-10-08, au lieu de `Georgia, "Times New Roman",
    serif`). Ce que voit chaque système : **Georgia** sur Windows, macOS et iOS ; **Noto Serif** sur Android (c'est
    sa serif) et sur Linux quand elle est installée ; la **serif générique** du système sinon. Ne pas remettre
    « Times New Roman » en second : sous Linux, c'est un alias de Liberation Serif (copie métrique de Times, rendu
    « document Word ») qui passait avant Noto Serif ; Noto Serif est bien plus proche de Georgia (œil large,
    empattements nets).
  - **Aucun impact LCP / CLS** : police système, rien à télécharger ni à échanger, aucun préchargement. Revers : le
    rendu varie selon le système (Georgia ou Noto Serif, largeurs proches mais pas identiques) — accepté.
- Capitales réservées aux eyebrow labels (utilitaire `eyebrow` : **Inter semi-gras (600)**, 12px, capitales
  espacées de 0,08em, `--ink-muted`). Mono jusqu'au 2026-10-08. Le semi-gras est celui de la V7 : en Inter
  normal, des capitales de 12 px paraissent grêles.
- **Deux couleurs d'eyebrow** (2026-10-08, étape 5 — choix du codeur, à confirmer à l'œil par l'humain) :
  - **eyebrow de section en `--accent`** (`eyebrow text-accent`) : `SectionHeading`, `PageHeader`, hero, CTA final,
    404. Il ouvre chaque section d'une touche chaude et marque la hiérarchie. Possible depuis `--accent` #AC4F08 :
    ≥ 4,82:1 sur `bg`, `bg-subtle` et `surface` en clair, ≥ 8,28:1 en sombre et en invert (voir contrastes).
  - **libellés internes en `--ink-muted`** (utilitaire seul) : `dt` de la Méthode, « Avant / Aujourd'hui » de
    Clients, libellés de `Figure`, eyebrow de la maquette de l'offre, `EnchainementClient`, pied de page, `/contact`,
    `/a-propos`, libellés de « Sous le capot ». En accent, les neuf `dt` de la Méthode faisaient une colonne
    orange : trop d'ambre pour des étiquettes qui ne sont pas des titres.
  - `text-accent` passe après `eyebrow` dans le CSS construit (Tailwind 4 ordonne les utilitaires par propriété :
    `color` après `font-family`) : vérifié dans `dist/` et à l'écran. Si un jour l'eyebrow reste gris malgré
    `text-accent`, c'est cet ordre qui a changé (piège 3).

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
| Button | `ui/Button.astro` | statique — `variant` primary/secondary/ghost, `size` sm/md/lg, `href` → `<a>`, sinon `<button type="button">`. **Pilule** (`rounded-full`) depuis le 2026-10-08 (étape 5, `rounded-md` avant) : forme plus douce, la même que le bouton flottant et les puces des formulaires. Les boutons écrits à la main des îlots (envoi du contact, Suivant / Précédent / Envoyer du questionnaire, appel du menu mobile) suivent |
| Card | `ui/Card.astro` | statique — `interactive` (implicite si `href`), `padding` md/lg, `href` → `<a>`. `rounded-lg border border-border bg-surface` **+ `shadow-sm`** depuis le 2026-10-08 (voir « Cartes ») |
| Badge | `ui/Badge.astro` | **non rendu sur une page publique** (revu à l'étape 5, inchangé : un changement invisible ne se vérifie pas) — statique — `variant` neutral/accent, `dot` (pastille `--accent-bright`), `href` → rendu en `<a>` avec `rel="noopener"` et soulignement au survol (cas client), `w-fit` (ne s'étire pas dans un flex en colonne) |
| SectionHeading | `ui/SectionHeading.astro` | statique — `id` (pour `aria-labelledby` de la section), `eyebrow` (en `--accent` depuis l'étape 5), `title` (h2), slot = chapeau |
| FlowDiagram | `ui/FlowDiagram.astro` | statique — `steps`, `label` ; vertical < xl, horizontal ≥ xl (à 1024px, les 4 étapes débordaient de la carte) ; impulsion CSS sur les liaisons, masquée sous mouvement réduit. **Non utilisé depuis le 2026-09-17** (retiré de l'offre, doublon avec `DicteeMobile` placé juste à côté) ; conservé |
| TerminalDemo | `islands/TerminalDemo.tsx` | îlot React, `client:idle` — voir « Terminal » |
| PageHeader | `ui/PageHeader.astro` | statique — en-tête des pages internes : `eyebrow`, `title` (**h1**), slot = chapeau, slot nommé `actions` (rangée de boutons sous le chapeau) |
| ACompleter | `ui/ACompleter.astro` | statique — marqueur visible d'un contenu non fourni (§9), `label` |
| ContactForm | `islands/ContactForm.tsx` | îlot React, `client:idle` — voir « Formulaire de contact » |
| Questionnaire | `islands/Questionnaire.tsx` | îlot React, `client:idle` — questionnaire prospects en six étapes, voir « Questionnaire » |
| Accordion | `ui/Accordion.astro` | statique — `<details>` / `<summary>` natif, `title`, `name` optionnel (ouverture exclusive), slot = réponse. Zéro JS |
| DicteeMobile | `ui/diagrams/DicteeMobile.astro` | statique + script natif — **non utilisé depuis le 2026-09-20** (hero jusqu'au 2026-09-17, « L'offre » jusqu'au 2026-09-19, « Sous le capot » une journée) ; conservé : cinq tâches jouées en boucle, pause réelle, précédent / suivant, connecteur assemblé sur les règles du client. Scénarios dans `src/config/demo-hero.ts`. Voir « Mockup de la dictée » |
| RotationEcrans | `ui/diagrams/RotationEcrans.astro` | statique + script natif — mockup animé de **« L'offre »** depuis le 2026-09-19, en 24 rem depuis le 2026-09-20 (hero le 2026-09-19, le temps d'une itération) : le même enchaînement joué dans quatre décors (messagerie, boîte mail, téléphone, application de gestion), quatre boutons pour aller à l'un d'eux, bouton pause. Voir « Rotation d'écrans » |
| AgentEnAction | `ui/diagrams/AgentEnAction.astro` | statique + script natif — **non utilisé** (hero le 2026-10-07, quelques heures), conservé ; prop `anime={false}` = scène figée sur « Valider », sans boucle ni pause. Contenu : une tâche, l'agent qui consulte trois outils, une proposition à valider puis exécutée. Voir « L'agent en action (hero) » |
| VracEnActions | `ui/diagrams/VracEnActions.astro` | statique + script natif — **non utilisé depuis le 2026-10-07** (remplacé par `AgentEnAction`, jugé trop chargé), conservé ; visuel du hero du 2026-09-19 au 2026-10-07 : ce qui arrive en vrac (post-it, note vocale) est lu par une bande qui traverse, recoupé dans vos outils, rendu en deux actions à valider. Trois intertitres, bouton pause. Voir « Le passage du hero » |
| ConvergenceDonnees | `ui/diagrams/ConvergenceDonnees.astro` | statique + script natif — schéma du hero : trois sources éparpillées rejoignent un tronc, qui descend dans le hub ; il en ressort des actions déjà préparées qui attendent un « oui ». **Une seule passe** (~3,1 s), sans cadre, sans boucle, sans bouton pause. **Non utilisé depuis le 2026-09-19** (remplacé par `RotationEcrans`) ; conservé. Voir « Schéma du hero » |
| Calculateur | `ui/Calculateur.astro` | statique + script `is:inline` — deux curseurs, une estimation d'heures par mois, lien pré-rempli vers `/contact`. **Non utilisé depuis le 2026-09-17** (constat revenu au format de `main`) ; conservé, ainsi que la reprise de `?heures=` dans `ContactForm`, pour pouvoir le remettre. S'il revient : retirer `is:inline` (voir « Décisions », scripts externes) |
| Figure | `ui/diagrams/Figure.astro` | statique — conteneur de schéma : `label` (eyebrow), `caption` (`<figcaption>` Inter 12, mono jusqu'au 2026-10-08), slot = le schéma |
| CompareBars | `ui/diagrams/CompareBars.astro` | statique (+ script natif si `reveal`) — comparaison de grandeurs : `bars` (`label`, `value`, `display`, `note?`, `tone` muted/accent), `max?`, `reveal?` (révélation ligne par ligne au défilement, à la place de `.bar-grow`). Voir « Schémas ». **Non utilisé depuis le 2026-10-08** (retiré de la section Clients avec les anciens chiffres, étape 3 du plan « site moins geek ») ; conservé, ainsi que ses règles `.revele-cache` / `data-revele="barre"` de `global.css` |
| DotPattern | `ui/DotPattern.astro` | statique — trame de points masquée en radial ; **sections invert uniquement**, parent `relative overflow-hidden`, contenu en `relative`. **Seulement dans « Sous le capot » depuis le 2026-10-08** (retiré du CTA final, étape 5 : décor technique hors de la section geek) |
| Header | `layout/Header.astro` | statique — sticky, fond plein (pas de `backdrop-filter`), nav + CTA ≥ md, menu < md |
| Footer | `layout/Footer.astro` | statique — navigation, légal, contact (LinkedIn affiché seulement si `site.linkedin` est renseigné) |
| MobileCta | `layout/MobileCta.astro` | statique — bouton flottant « Parlons-en » en bas à droite, < md uniquement, toujours visible, masqué sur `/contact` |
| ThemeToggle | `islands/ThemeToggle.tsx` | îlot React, `client:idle` |
| MobileNav | `islands/MobileNav.tsx` | îlot React, `client:idle`, plein écran via `<dialog>` modal |
| EnchainementClient | `ui/diagrams/EnchainementClient.astro` | statique + script natif — démonstration en boucle du cas client, **allégée le 2026-10-08** : un devis en trois temps (il demande le devis → le devis se prépare → il vérifie, c'est enregistré), légendée « Exemple illustratif ». Voir « Le cas » |
| Temoignage | `ui/Temoignage.astro` | statique, **aucun script** — parole d'un client réel : `citation` (sans guillemets, ajoutés avec U+202F), `prenom`, `nomFamille` (`null` → prénom seul, sans marqueur), `role`, `entreprise`, `site?` (seul lien du bloc, sur le nom de l'entreprise), `logo?` (chemin dans `public/`, vérifié au build, sur plaque `section-invert`). `<figure>` + `<blockquote>` + `<figcaption>`. **Relief depuis le 2026-10-08 (étape 5 bis)** : filet d'accent vertical à gauche de la citation (`w-1 rounded-full bg-accent`, `aria-hidden`) et guillemets de la citation en `--accent`. Voir « Clients » |
| Base | `layouts/Base.astro` | props `title`, `description`, `noindex` ; script anti-flash, préchargement polices, canonical |

### Cartes (2026-10-08, plan « site moins geek », étape 5)
Une seule apparence de carte sur le site : **`rounded-lg border border-border bg-surface shadow-sm`** — celle de
`Card`. Référence : les cartes du mini-CRM (fond blanc, bordure légère, ombre à peine visible). La bordure seule
faisait « grille de tableau de bord » ; l'ombre seule disparaît en thème sombre — les deux ensemble.
- **Écrites à la main, mêmes classes recopiées** (parce que l'élément n'est pas un `div` ou qu'une prop de `Card` ne
  suffirait pas sans piège 3) : `Temoignage` (`<figure>`, `md:p-10`), les deux blocs de `Clients` (chiffres :
  `div` ; avant / aujourd'hui : `<figure>`), `EnchainementClient` (`<figure data-cc>`), les deux panneaux de
  Confiance (le second garde `border-accent` : c'est la moitié qui s'arrête), le cadre `dl` de la Méthode
  (`rounded-md` → `rounded-lg`).
- **Restent différentes, volontairement** :
  - les trois temps d'`EnchainementClient` (`rounded-md border bg-bg`, sans ombre) : ce sont des cases **dans** une
    carte, et leur bordure passe en `--accent` à l'étape en cours (script inchangé) ;
  - les blocs de « Sous le capot » (`border-border-strong`, sans ombre) : la section reste telle quelle ;
  - le terminal et les maquettes (`RotationEcrans`) : décors d'écran, pas des cartes de page ;
  - les champs de formulaire (`rounded-md border-border-strong`) : contrôles, pas cartes.
- Pas d'ombre sur les accordéons de la FAQ, les sections ni les listes : l'ombre est le signe d'une carte.

Le **hero** porte `VracEnActions` (le passage) depuis le 2026-09-19. Chaque visuel remplacé descend d'un cran dans la
page plutôt que d'être supprimé : `RotationEcrans` (quatre décors, hero le 2026-09-19) est descendu dans « L'offre »,
où il remplace `DicteeMobile`, descendu à son tour dans « Sous le capot ». Avant eux : `ConvergenceDonnees` (schéma de
flux, hero le 2026-09-17), conservé mais non utilisé. `DicteeMobile` avait elle-même remplacé le terminal dans
« L'offre » le 2026-09-16, terminal descendu dans « Sous le capot », où les deux se répondent aujourd'hui — la même
mission (un devis préparé depuis le catalogue) vue côté personne puis côté machine.

Sections de l'accueil (`src/components/sections/`), dans l'ordre : Hero, Engagements, Clients (`#cas-client`),
Methode (`#methode`), Offre (`#offre`), SousLeCapot (invert), Confiance (`#confiance`), Faq (`#faq`), CtaFinal
(invert). Le 2026-10-07 (demande explicite) : la preuve d'abord — Clients monte juste sous le bandeau, sur fond
`bg-bg` (entre le bandeau et la Méthode, tous deux `bg-bg-subtle`) ; la section Probleme (« Le constat ») est
supprimée, ses trois scènes reprises dans les arguments de l'offre. Le menu suit l'ordre de la page. Chaque section : `<section aria-labelledby>` + `py-(--section-y)` (hero : `py-(--hero-y)`) + `container-site` ;
un h2 via SectionHeading, des h3 au plus. Alternance de fond : `bg-bg` / `bg-bg-subtle`, **sans filet** depuis le
2026-10-08 (étape 5, « moins de bordures ») : le changement de fond sépare seul — `bg-subtle` plus chaud y aide.
Retirés : `border-b` du hero et du bandeau, `border-y` de la Méthode, de la FAQ et de la section « posture » de
`/a-propos`. Restent : la bordure basse de l'en-tête collant, celle de `PageHeader` (deux fonds identiques de part
et d'autre), le haut du pied de page.
- **Sections invert** : `.section-invert` + `border-y border-border`. Sans bordure, elles se confondent avec le
  fond de page en thème sombre et le rythme vertical disparaît.

### Pages internes
`/a-propos`, `/contact`, `/questionnaire` (`noindex`, hors navigation), `/mentions-legales`, `/confidentialite`, `404` (`noindex`, produit `404.html` pour le
fallback Fastify du §6.4). Structure : `PageHeader` puis contenu dans `container-site` + `py-(--section-y)`.
La 404 porte un eyebrow « Erreur 404 » au-dessus de son `h1` (plus de « $ cd page-demandee », 2026-10-08 : clin
d'œil de terminal hors « Sous le capot »).
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
- Textes (2026-10-08) : en « je » (« pour que je puisse vous répondre », « Je reviens vers vous par email »,
  « écrivez-moi »). Puce « Reporting » renommée **« Tableaux de bord »** (anglicisme technique) : le libellé est
  aussi la valeur envoyée et validée par le serveur, et il est repris par le questionnaire (`optionsDe`) ; les
  réponses reçues avant cette date portent l'ancien libellé. Un libellé de puce ne contient jamais « , » (le
  serveur découpe la liste sur « , »).
- **Erreurs en `--accent`** (bordure et texte) : pas de rouge, une seule couleur d'accent. Texte d'erreur : `text-accent`
  sur `surface` = 5.42:1 en clair (5.02 avant l'accent #AC4F08). Le message reste compréhensible sans la couleur (préfixe « ! » et texte explicite).
- `action="/api/contact" method="post"` sur le `<form>` : sans JS, les données partent dans le corps (jamais dans
  l'URL) et le serveur répond 415 — le serveur n'accepte que du JSON, choix assumé en V1.
- En dev, Vite relaie `/api` vers `http://127.0.0.1:3000` : lancer `npm run build && npm start` à côté de
  `npm run dev` pour tester l'envoi. Sans serveur, l'état `error` est le comportement attendu.

### Questionnaire (`/questionnaire`)
- Questionnaire de découverte envoyé **par lien direct** aux prospects (étude de marché, premiers rendez-vous),
  et proposé sur `/contact` : bouton principal « Répondre au questionnaire » sous le chapeau (slot `actions` de
  `PageHeader`), suivi de « Pas encore de demande précise ? 6 minutes, sans engagement. » (2026-10-07). Libellé du
  bouton court : `Button` est en `whitespace-nowrap` (piège 12) :
  `noindex`, absent de la navigation principale, bouton flottant `MobileCta` masqué (il couvrait les boutons de l'étape).
  Un seul lien générique, sans paramètre de suivi (décision du 2026-10-07).
- **Source unique : `shared/questionnaire.json`** — sections, questions, options, unités, aides, limites, durée
  minimale, texte de l'accusé de réception. `src/lib/questionnaire.ts` l'expose au front, `server/questionnaire.mjs`
  en construit le schéma zod. Email, téléphone et champ piège reprennent `shared/contact.json`. Ajouter, retirer ou
  reformuler une question = modifier ce JSON seulement. Types : `texte`, `paragraphe`, `nombre`, `choix` (une
  réponse, effaçable), `multi`, `email`, `tel`. `optionsDe: "secteurs" | "irritants"` reprend les listes de
  `shared/contact.json` au lieu de les recopier (réponses croisables avec le formulaire de contact).
- Version du 2026-10-07 : 6 étapes, ~6 minutes, texte libre limité à 4 champs ; identité regroupée à la dernière
  étape, avec l'échéance, la proposition d'échange de 20 minutes et la provenance du lien (lien unique pour tous).
- **Tout est facultatif**, sauf le consentement à la dernière étape. Validation par étape (nombres, email,
  téléphone) avec les mêmes motifs que le formulaire de contact : `aria-invalid`, message relié, focus sur le
  premier champ en erreur, erreurs en `--accent`.
- Changement d'étape (« Suivant » et « Précédent ») et écran « Réponses envoyées » : le focus va sur le titre de
  l'étape (`h2`, `tabIndex=-1`) ou sur le panneau de succès, ce qui l'annonce au lecteur d'écran, **avec
  `preventScroll`** ; puis `scrollIntoView({ block: "start" })` sur la carte (`data-questionnaire-carte`, posé par
  la page sur `Card`). Sa bordure haute s'arrête sous l'en-tête collant, au `scroll-padding-top` de `html`
  (64 + 16 px). Pourquoi (2026-10-08, demande explicite) : un `focus()` seul laissait le navigateur choisir où
  défiler, et il remontait jusqu'au titre de la page — on quittait le questionnaire. Pas d'option `behavior` :
  le défilement doux vient de `scroll-behavior` (`global.css`), donc instantané sous mouvement réduit. Pas de
  défilement au premier rendu (ni à la reprise d'un brouillon). Le focus du premier champ en erreur reste un
  `focus()` simple.
- **Brouillon** en `localStorage` (clé `questionnaire-brouillon` : étape + réponses), relu après hydratation,
  effacé après envoi réussi. Mentionné dans la politique de confidentialité, comme le thème.
- Mise en page (2026-10-08, demande explicite) : **plus d'encart « Avant de commencer »** (durée, questions
  facultatives, brouillon gardé sur l'appareil) — la page va droit au formulaire. Une seule colonne centrée,
  `mx-auto max-w-(--measure)`, aux deux tailles d'écran. Seule la mention de confidentialité survit, en `text-14`
  **sous** la carte : « La confidentialité de vos données est respectée. » — texte de l'humain, au mot près
  (2026-10-08), **sans lien** : la case de consentement de la dernière étape renvoie déjà à `/confidentialite`.
  « données » y est une exception assumée à la liste noire du jargon (sens courant de vie privée). Ne pas redire
  sur la page que les questions sont facultatives ni que le brouillon est gardé sur l'appareil (décision du même
  jour) ; la durée (« six minutes ») reste dans la meta description et sur `/contact`.
- Copy : le questionnaire parle à la première personne (« je »), comme tout le site depuis le 2026-10-08. Le chapeau
  s'adresse aux « artisans, indépendants et petites entreprises ». Les **questions** de `shared/questionnaire.json`
  (dont « IA » et « assistant IA ») n'ont pas été reformulées à l'étape 4 : ce sont des questions d'étude, les
  changer romprait la comparaison des réponses — à revoir avec la pertinence des questions.

### Serveur (`server/index.mjs`)
| Route / comportement | Détail |
|---|---|
| Fichiers statiques | `dist/` ; `/contact` servi sans redirection (réécriture vers `/contact/`) ; 404 → `404.html` avec statut 404 ; `/api/*` inconnu → JSON 404 |
| Cache (§7.8) | `/_astro/*` : `immutable, max-age=31536000` · HTML : `no-cache` · polices et autres : `max-age=604800` |
| Compression | Brotli / gzip **dans Fastify** → **ne pas l'activer dans Traefik** (Lot 5) |
| `GET /api/health` | `{ ok: true }` |
| `POST /api/contact` | JSON uniquement · zod · 5 requêtes / 10 min / IP · `200 {ok:true}` · `400 {erreur:"validation", champs}` · `429` · `502` échec SMTP · `503` SMTP non configuré |
| `POST /api/questionnaire` | `server/questionnaire.mjs` · JSON, `bodyLimit` 64 ko (sept champs de 3 000 caractères) · objet `reponses` strict (clé inconnue = 400) · 5 requêtes / 10 min / IP · `200 {ok:true, accuse}` · mêmes codes d'erreur que le contact · anti-spam : remplissage < 8 s |
| Email du questionnaire | texte brut question par question + **pièce jointe JSON** (`{ recu, reponses }`) pour regrouper les réponses dans un tableur ; `Reply-To` = l'email du prospect s'il est donné ; sujet « Questionnaire — {prénom} — {entreprise} » |
| Accusé de réception | envoyé si un email est donné, **texte fixe** (`accuse` du JSON) : rien de saisi n'y est recopié, l'adresse n'étant pas vérifiée (sinon le formulaire servirait à envoyer un contenu choisi par un tiers depuis le domaine). Son échec est journalisé sans faire échouer la réponse (`accuse: false`) |
| Anti-spam | champ piège rempli ou remplissage < 3 s → `200 {ok:true}` **sans envoi** (le robot n'apprend rien) |
| Sécurité | helmet ; CSP `script-src 'self'` (scripts des composants en fichiers `/_astro`) + empreintes sha256 des scripts restés inline (anti-flash du thème), calculées au démarrage depuis `dist/` ; HSTS et `upgrade-insecure-requests` en production seulement ; retours à la ligne refusés dans les champs d'une ligne (injection d'en-têtes) |
| Journaux | aucune ligne par requête (ni IP ni URL) ; seulement démarrage, envoi / ignoré / échec SMTP, sans données du formulaire |
| Proxy | `trustProxy: 1` : l'IP du rate limit est celle vue par Traefik |

- La CSP dépend du HTML construit : **tout script inline ajouté au site est pris en compte au redémarrage**, sans
  configuration. Un script externe (autre domaine) serait bloqué — c'est voulu (§11, aucune requête tierce).
- Email : texte brut, `Reply-To` = le demandeur, sujet « Demande de contact — {société} ».
- SMTP : port 465 → TLS implicite ; 587 → STARTTLS obligatoire ; autre port (ex. Mailpit 1025) → sans TLS.
- SMTP : délais de 10 s (connexion, accueil) et 20 s (inactivité). Ceux de nodemailer par défaut (2 min, 10 min)
  laissaient le visiteur bloqué sur « Envoi en cours… » si le SMTP se figeait (piège 30).

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

### Scripts de publication et de déploiement (`scripts/`)
- `scripts/release.sh` (`npm run release -- X.Y`, en local) : RUNBOOK §2 de bout en bout, jusqu'à l'image publiée.
  `scripts/deploy-vps.sh` (copié sur le VPS sous `/srv/sosese/deploy.sh`) : RUNBOOK §3, avec rollback automatique.
- Décision (2026-10-07) : **pas de déploiement depuis GitHub Actions**. Le déploiement reste un geste humain sur le
  VPS, en une commande ; aucune clé SSH ni aucun secret de déploiement côté GitHub, la CI ne touche toujours pas au
  VPS. Claude Code ne lance aucun des deux scripts (push, merge, tag et VPS sont réservés à l'humain).
- Tags acceptés par `deploy.sh` : `vX.Y` et `vX.Y-suffixe` (préversions). `release.sh` ne produit que des `vX.Y`.
- Le contrôle de `www` se fait en GET : Traefik répond 301 en GET mais **308 en HEAD** (`curl -I`).
- `deploy.sh` ne modifie que la ligne `image:` de `compose.yml` ; tout autre changement (labels Traefik) se copie à
  la main, et `release.sh` le signale. Rollback automatique seulement sur ce que l'image peut casser (santé,
  `/api/health`, `/`, `/contact` via Traefik) ; SMTP et voisins = alertes sans rollback.
- Nettoyage borné aux images `ghcr.io/sosese/sosese` (version en ligne + 3 plus récentes) : jamais de `prune` global,
  le VPS est partagé.
- Pièges rencontrés en écrivant les scripts :
  - `sort` suit la locale : en `fr_FR`, `package.json` passe avant `package-lock.json` (la ponctuation est ignorée),
    et la comparaison de la liste de fichiers échouait. Toute comparaison de sortie triée se fait en `LC_ALL=C`.
  - Premier passage réel (2026-10-07) : le VPS tournait sur `v0.9-v2-preview.1` alors que `compose.yml` sur `main`
    indiquait `v0.8` (préversion déployée à la main hors de `main`). `deploy.sh` n'acceptait que `vX.Y` et s'est
    arrêté sans rien toucher. Il accepte désormais aussi `vX.Y-suffixe`, en version en ligne comme en cible de
    rollback. Le nettoyage ne touche toujours qu'aux tags `vX.Y` : les préversions restent sur le VPS.
  - Après le changement de version, `package-lock.json` est déjà modifié : vérifier que `npm ci` n'y touche pas se
    fait par empreinte (`git hash-object` avant / après), pas par `git status`.
- Testés le 2026-10-07 avec des `docker`, `curl`, `gh` et `npm` simulés et un dépôt distant local : succès, rollback
  sur conteneur `unhealthy`, tag inexistant, tag déjà publié, diff de version pollué, refus aux confirmations. Le
  premier passage réel a eu lieu le 2026-10-07 avec la `v0.9` (`release.sh` complet, puis `deploy.sh` après le
  correctif des préversions) ; build du tag identique à la production.

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
même promesse. La section ne présente plus que le sur-mesure. Si une prestation détachable (audit, ateliers) doit
réapparaître, elle ne revient pas en carte à côté du sur-mesure : la Méthode la décrit déjà.

**Offre : trois assistants** (2026-10-08, décision de l'humain, étape 4 ter). `h2` « Quel assistant vous
faut-il ? » (eyebrow « Ce que je construis »), puis **trois cartes** (`assistants` en tête de `Offre.astro`) où
chaque visiteur se reconnaît : commercial, chiffres (gestion), saisie. Elles remplacent les quatre arguments
(« L'administratif en moins, pas un logiciel en plus », « Vos informations enfin réunies », « Il prend les
devants », « Il garde vos règles, pas vos données »).
- **Contrat de carte** : `Card` non interactive (rien de cliquable sauf un lien), pastille d'icône
  `size-9 rounded-md bg-accent-soft text-accent` à gauche, `h3` `text-18` semi-gras = **la question** (« Besoin
  d'… ? »), corps `text-16 text-ink-muted`, ligne de preuve éventuelle en `text-14`. La question suffit au survol :
  le corps dit comment, jamais une autre promesse. Liste `ul` en `max-w-(--measure)`, écart fixe `gap-4` (celui des
  cartes de Confiance — les bordures séparent déjà).
- **Preuves autorisées, et seulement celles-ci** : l'assistant de chiffres est **réel** (construit pour Jason, il
  lit l'historique des devis et des bons de commande) → une ligne sans chiffre, « Pour Jason, j'en ai tiré un
  rapport : les chiffres qui comptent et les actions à mener. » ; l'assistant de saisie → lien discret « Voir ce
  qu'en dit Jason » vers `#cas-client` (souligné, `text-ink-muted`, comme le lien de la signature du témoignage).
  Aucune autre affirmation « en service ».
- **Le contenu du rapport ne se publie jamais, même anonymisé** : Jason est nommé sur le site, tout chiffre lui
  serait attribuable, et il n'a donné son accord que pour son témoignage et son logo (piège 17). On dit *ce qui a
  été fait*, jamais *ce qu'il contient*. Tout exemple chiffré éventuel est inventé et légendé « exemple
  illustratif ».
- Ce que les quatre arguments disaient et qui reste dit ailleurs : « rien de nouveau à apprendre » (bandeau),
  « ce qu'il retient — vos règles » (Confiance, FAQ « mémoire »). La pro-activité par routines (« il prend les
  devants ») est revenue dans la carte commerciale (étape 5, voir « Copy », « Pro-activité ») ; « le dossier n'attend
  plus quand la bonne personne est absente » est abandonné (décision de l'humain).
- Les quatre arguments et leur liste de `points` cochés ont disparu ; les `points` étaient déjà absents du code
  avant le 2026-10-08.

**Plus de bento** (2026-09-17) : la grille `md:grid-cols-3 md:grid-rows-2` a disparu avec les deux cartes, et
`BentoOffre.astro` est devenu `Offre.astro`. La section est désormais une grille `lg:grid-cols-[1fr_24rem]` —
cartes à gauche, `RotationEcrans` (24rem) à droite, empilées avant `lg`. Toujours pas de composant
BentoGrid / BentoCard : à créer seulement si un vrai bento réapparaît.

**Les deux colonnes se répondent** (2026-09-18) : `lg:items-center`. Alignées en haut (`items-start`), une colonne
plus courte que la maquette laissait un vide sous elle et la section paraissait bancale. `items-start` reste en
vigueur sous `lg`, où les deux blocs sont empilés. Mesuré le 2026-10-08 avec les trois cartes : 530 px de cartes
face à 550 px de maquette à 1280 px ; à 1024 px les cartes, plus étroites (512 px), montent à 607 px et dépassent
la maquette de 57 px — centrées l'une sur l'autre, sans débordement.

**Une icône par carte** (2026-09-18 pour les arguments, redessinées le 2026-10-08) : tracé SVG en ligne, chaîne
statique passée en `set:html`, `aria-hidden` (la question est écrite juste à côté). Les trois tracés disent
l'assistant : une bulle de message (commercial), un graphique en barres (chiffres), une fiche (saisie). Pas de
bibliothèque d'icônes : quatre tracés dans Confiance, trois ici, c'est tout ce dont le site a besoin.

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

### Décor allégé (2026-10-08, plan « site moins geek », étape 5)
Référence : une page qui ressemble à un outil du quotidien bien tenu, pas à une console. Revue section par section :
- **CTA final** : `DotPattern` retiré (section invert et `border-y` conservées). Le motif ne vit plus que dans
  « Sous le capot », qui ne change pas (terminal, mono, points) : c'est la touche geek assumée.
- **Filets de section** retirés sur les fonds `bg-subtle` (voir « Sections de l'accueil »).
- **Méthode** : le cadre « Votre temps / Durée / Vous recevez » perd ses filets internes (`divide-y`) : l'espace
  (`gap-4`, `p-4`) sépare les lignes, la carte les regroupe. Script de révélation inchangé (`data-revele` aux mêmes
  places). Le trait entre les pastilles reste : c'est le fil de lecture.
- **Clients** : `gap-8` → `gap-12` entre l'en-tête, le témoignage, les chiffres et la démonstration (l'écart des
  autres sections) : plus d'air autour de la parole du client.
- **Schémas affichés sur l'accueil** passés en revue : `EnchainementClient` (un devis, trois temps), `RotationEcrans`
  (messagerie, mail, téléphone, application — que des messages et des cartes à valider, aucun graphique), « Qui
  décide quoi » de Confiance. Aucun n'évoque un tableau de bord ni un terminal : **conservés tels quels**, cartes
  alignées sur `Card`. Le seul terminal est dans « Sous le capot ».

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
- **`CompareBars reveal`** (2026-09-18, cas client ; **non utilisé depuis le 2026-10-08**, conservé) : révélation ligne par ligne au défilement, à la place de
  `.bar-grow`. Libellé + valeur, puis la barre qui se déploie depuis la gauche, puis la note — pas de 260 ms,
  même rythme et même machinerie que la Méthode (`IntersectionObserver` au seuil 0,25, `data-revele`,
  `.revele-cache`). La comparaison se lit alors dans l'ordre de l'histoire : les 40 minutes d'abord, les 2 minutes
  ensuite. La barre porte `data-revele="barre"` : `transform-origin: left center`, et son état masqué est
  `scaleX(0)` **à `opacity: 1`** — elle se déploie, elle n'apparaît pas. Les deux animations **s'excluent** :
  avec `reveal`, la classe `.bar-grow` n'est pas émise, sinon la barre finirait sa croissance au défilement
  pendant qu'elle est encore masquée, et serait déjà pleine en apparaissant.
- `transform` n'affecte pas la mise en page : une barre animée ne décale rien. Toute animation de schéma doit
  rester sur `transform` ou `opacity` pour cette raison.

### Hero en texte seul (2026-10-07)
Demande explicite, après trois essais le même jour (photo, `AgentEnAction` animé, puis figé) : **le hero ne porte
plus de visuel**. Une seule colonne : eyebrow, h1 en `text-64` à partir de `lg` (`max-w-4xl` pour garder trois
lignes), chapeau à la mesure, deux boutons. La démonstration du service commence au cas client, juste en dessous.
Effet de bord : plus aucun script ni animation au-dessus de la ligne de flottaison. **Remettre un visuel = revenir à
la grille `lg:grid-cols-[1fr_1fr]` et au `text-48`**, sinon le titre écrase la colonne de droite.

**Titre (2026-10-08, décision de l'humain, étape 4 ter)** : « Vous me parlez de votre métier. Je construis
l'assistant qui s'occupe du reste. » — il remplace « Moins de temps à recopier. Plus de temps pour votre métier. »,
jugé pas assez fort, qui reste l'accroche du pied de page. Il pose la **relation** (vous parlez, je construis) au
lieu d'un bénéfice abstrait, et présente « l'assistant » dès le titre. Sans « IA ». **Couleurs inversées le
2026-10-08** (étape 5, décision de l'humain) : première phrase en `text-ink-muted`, **la promesse (« Je construis
l'assistant… ») en `text-ink`** — c'est elle qui porte le message. Tailles inchangées (`text-36` / `sm:text-48` /
`lg:text-64`, `max-w-4xl`).
Le chapeau ne redit plus « je construis un assistant » : « Je repère avec vous les tâches qui remplissent vos
journées, et je relie votre assistant aux logiciels que vous utilisez déjà. »

**Hero sur téléphone (2026-10-08, étape 5, mesuré)** : `h1` en `text-36` sous `sm` **conservé**. Il tient sur
5 lignes à 390 et 360 px (4 à 640 px en `text-48`), mais le bouton « Parlons-en » reste au-dessus de la ligne de
flottaison : haut / bas du bouton à **547 / 595 px** sur 390 × 844, **595 / 643 px** sur 360 × 740 (`npm start`,
Chromium, Inter chargée). Marge suffisante même avec les barres du navigateur (Safari iOS laisse ~660 px visibles sur
un 390 × 844). Descendre à `text-28` aurait gagné une ligne, mais le `h1` aurait eu la taille des `h2` sur téléphone (`text-28`
sous `md`) : la hiérarchie se perdait. À remesurer si le chapeau ou l'eyebrow s'allongent. Le bouton flottant `MobileCta` reste de toute
façon visible en permanence sous `md`.

### L'agent en action (AgentEnAction) — non utilisé, conservé
Depuis le 2026-10-07, à la place de `VracEnActions` (demande explicite : une seule idée, lisible d'un coup d'œil).
**Vos tâches sont prises en charge par l'agent avec les données de vos outils actuels ; vous validez, il exécute.**
- Trois temps numérotés dans une carte : 01 la tâche (une bulle, la phrase du dirigeant), 02 « Il consulte vos
  outils » (logiciel de gestion, boîte mail, agenda, chacun avec ce qu'il y trouve), 03 « Vous validez, il
  exécute » (la proposition, le bouton « Valider » qui devient « ✓ Envoyées » dans la même case — piège 28).
- **Seul aplat de couleur : le bouton « Valider »**, comme dans la version précédente. La carte de la
  proposition n'a qu'une bordure `--accent`.
- « il » = l'agent : le hero est au-dessus du chapeau de l'offre, « elle » y est interdit (voir « Copy »).
- Contrat des schémas : tout est dans le DOM, seule l'opacité change ; l'état rendu par le serveur est l'état
  **final** (« ✓ Envoyées ») ; sans JS ou sous mouvement réduit, rien ne bouge et le bouton pause reste masqué.
  Scène en `aria-hidden` + `figcaption` `sr-only` ; le bouton pause est **hors** de la zone `aria-hidden`.
- Rythme dans le script (`PAS`, `APPUI`, `FAIT`, `BOUCLE` ≈ 11 s) ; l'attente du « oui » est le temps le plus long.
- Lignes d'outils : nom et résultat empilés avant `sm`, côte à côte ensuite (à 360 px, la ligne coupait mal).

### Le passage du hero (VracEnActions) — retiré du hero le 2026-10-07, conservé
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
arrive, l'assistant consulte les logiciels de l'entreprise un par un en montrant ce qu'il y trouve, une action prête
à valider en sort — joué dans quatre décors : messagerie, boîte mail, téléphone, application de gestion.
- **Textes (2026-10-08)** : dans la maquette, c'est l'assistant qui parle à la première personne (« Je regarde dans
  vos logiciels… », « Je consulte vos logiciels », « outils » avant) — une réplique de personnage, comme les phrases
  des clients inventés, pas la voix de sosese. La transcription `sr-only` dit « l'assistant », jamais « la solution ».
  Remplacer un titre de panneau par un plus long impose de revérifier qu'il tient sur une ligne à 360 px (case de
  hauteur constante).

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
- **L'écart entre les arguments est fixe, pas réparti** (2026-09-20 ; depuis le 2026-10-08, trois cartes en
  `gap-4`, voir « Offre : trois assistants ») : `lg:gap-16` (64 px) sur la liste, et
  `lg:items-center` sur la grille. Réparti sur la hauteur de la maquette (`justify-between`), l'écart montait à
  90 px — une ligne de corps de trop, la liste se lisait comme quatre blocs sans rapport. À 64 px elle respire
  encore et reste un ensemble ; elle est un peu plus courte que la maquette, qui la centre en face d'elle.
- **`data-deroule="confirme"`** sur les écrans qui se terminent par une confirmation (aujourd'hui : les relances) :
  ils gardent une cinquième étape. Les autres s'arrêtent à l'étape 4.
- **Libellés courts** (`Messagerie`, `Boîte mail`, `Téléphone`, `Gestion`) : en Inter 12 (mono jusqu'au
  2026-10-08), les quatre plus le bouton pause tiennent sur **une seule ligne** dans 24 rem — la largeur la plus
  étroite où la maquette ait tourné —, et jusqu'à 360 px. Mesuré le 2026-10-08 : 223 px de libellés en Inter
  contre 259 px en mono ; à 360 px, la rangée passait à deux lignes en mono, elle tient sur une en Inter. Un libellé plus long (« Application ») les fait
  passer à deux lignes et laisse le bouton pause seul en bas. Le `title` porte la phrase entière.
- **Actif = souligné en `--accent` sur texte `--ink`**, pas de pastille pleine : `accent` sur `accent-soft` était à
  4,28:1 en clair (4,62 depuis l'accent #AC4F08, marge trop mince pour du texte 12 : choix conservé).
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

### Terminal pleine largeur dans « Sous le capot »
Du 2026-09-20 au 2026-10-07, le terminal tenait la moitié gauche d'une grille `lg:grid-cols-2`, la moitié droite
portant le marqueur `ACompleter` d'un second visuel à venir. Marqueur retiré le 2026-10-07 (demande explicite,
avant redéploiement) : le terminal reprend toute la largeur. Un second visuel, s'il arrive, revient avec sa grille ;
**ne pas remettre de moitié vide** à la place du marqueur — un trou silencieux se lit comme un oubli.

### Qui décide quoi (Confiance)
Refait le 2026-09-20 : deux listes plates séparées par un petit badge ne se lisaient pas, et rien n'y avait le
poids de ce qui est promis.
- **Les deux panneaux ont un titre de vrai titre** (`text-18 font-semibold`), pas une étiquette mono : « Il
  avance seul » / « Il s'arrête net » (« Elle… » jusqu'au 2026-10-08). Ce sont les deux moitiés d'une même phrase,
  il faut qu'on les lise avant les listes.
- **Chaque geste porte son signe** : une coche à gauche, un glyphe de pause à droite, tous deux en `--accent`,
  alignés sur la première ligne (`mt-1`). C'est ce qui donne le rythme que les listes nues n'avaient pas.
- **La porte est le seul aplat de couleur de la section** : pastille `bg-accent` / `text-on-accent` (5,42:1,
  voir contrastes). Les engagements en dessous n'ont que des fonds `accent-soft`, donc rien ne lui dispute
  l'attention.
- **Le trait qui la traverse est un filet, pas une flèche** : `h-5 w-px` empilé avant lg, `lg:h-px lg:w-5` en
  ligne ensuite. Deux flèches `→` empilées verticalement dans une colonne `auto` disaient l'inverse du sens de
  lecture.
- **Le chapeau est en trois phrases courtes** (« L'assistant lit ce qu'il faut. Il n'en garde rien. Il n'envoie
  rien sans vous. ») et non en une phrase à trois virgules : c'est la même information, scandée. La première
  renomme l'assistant : l'offre, où il est présenté, est trois sections plus haut.

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
- **Dernière ligne (`result`) sans chiffre** : « devis prêt, en attente de votre oui » (2026-10-08, plan « site
  moins geek », étape 4 bis ; « 38 min économisées par devis » avant). Un visiteur rapprochait ce chiffre inventé
  des 25 → 3 min de Jason. **Ne pas y remettre de durée ni de gain** : les seuls chiffres de résultat du site sont
  ceux du client. Seule retouche de texte du terminal depuis l'étape 2 (« ne pas toucher »).

### Clients (section « Ce qu'en dit Jason, chez L'Atelier des Sols & Fils »)
Refaite le 2026-10-08 (plan « site moins geek », étape 3, décision de l'humain) : **une parole de client à la
place d'un tableau de bord**. Composant `sections/Clients.astro`, eyebrow `Clients`, entrée de menu « Clients ».
**L'ancre reste `#cas-client`** (publiée depuis la v1). Place dans la page inchangée : juste sous le bandeau, `bg-bg`.
Voix : la section parle au **« je »** (Joris), comme tout le site depuis le 2026-10-08.

Ordre de lecture, pensé pour 10 secondes :
1. **Titre `h2` qui résume seul** : « Ce qu'en dit {prénom}, chez {entreprise} » (valeurs de `casClient`), puis un
   chapeau en « je » : qui ils sont (« Son entreprise pose des sols… », Metz – Luxembourg, 4 à 9 personnes) et ce que
   j'ai construit, en mots simples (« Jason demande le devis, le devis se prépare dans le logiciel, Jason le
   vérifie, et c'est enregistré »). **Le nom de l'entreprise n'est pas répété dans le chapeau** (il est déjà dans le
   titre et la signature), et **Jason est nommé comme sujet de chaque geste** : avec « un assistant » juste avant,
   un « il » se rattachait à la machine (corrigé le 2026-10-08).
2. **`Temoignage`, la pièce maîtresse** : logo sur sa plaque, citation principale en serif (`font-display`,
   `text-21` → `text-28` dès `md` → `text-36` dès `lg`, `--leading-tight`), signature « Jason, commercial et
   gestionnaire — L'Atelier des Sols & Fils ↗ ». Carte `bg-surface` bordée, `shadow-sm` (comme `Card`, depuis l'étape 5).
   **Relief (étape 5 bis)** : deux des trois pistes du plan — un **filet d'accent** vertical à gauche de la citation
   (`w-1` = 4 px, pas de l'échelle, `rounded-full bg-accent`, `aria-hidden`, pleine hauteur de la citation) et les
   **guillemets de la citation en `--accent`** (5,42:1 sur `surface` en clair, 8,28:1 en sombre). Écartés : le
   **grand guillemet décoratif** ajouté au-dessus (il doublait les guillemets du texte, qu'on ne retire pas) et le
   **fond `accent-soft`** sur la carte (il aurait fait de la carte du témoignage un bloc ambre de plus, juste au-dessus
   de la carte « Aujourd'hui » bordée d'accent). Le texte de la citation ne change pas.
3. **Deux chiffres, pas un de plus** (`<dl>`) : « Pour un devis : 25 min → 3 min » et « Gagnées par semaine : ≈ 4 h »,
   légende commune « Selon Jason. ». Sobres : serif `text-28`/`text-36` en `--ink`, **pas d'accent, pas de grille de
   compteurs, pas de barres**. La flèche est en Inter (`font-sans`) : en Noto Serif, elle collait à « min ».
   Lecteur d'écran : `→` et `≈` en `aria-hidden`, doublés en `sr-only` : le devis se lit **« avant 25 min,
   maintenant 3 min »** (« 25 min au lieu de 3 min », lu jusqu'au 2026-10-08, inversait le sens), l'autre
   « environ 4 h ». **Ne pas
   afficher** les 2 h d'administratif d'avant (il faudrait expliquer qu'il en gagne 4 parce que l'assistant fait
   aussi du suivi commercial) ni sa note de recommandation.
4. **Avant / aujourd'hui côte à côte** (`sm:grid-cols-2`), puis « le temps gagné », trois `blockquote` de ses mots
   dans une même `<figure>` (« Jason, dans ses mots. »). Du texte, pas de graphique.
5. **La démonstration (`EnchainementClient`) vient après** : ses montants inventés ne doivent jamais concurrencer
   les deux chiffres du client.

Grille de la rangée 3-4 : `lg:grid-cols-[2fr_3fr]` + `items-start` ; chiffres **en premier dans le DOM** pour
qu'empilés sur mobile ils suivent directement la citation. Un `h2` et aucun `h3` dans la section (les temps de la
démonstration sont des paragraphes, pas des titres).

- **Source unique des contenus : le formulaire de satisfaction rempli par le client** (2026-10-08). Phrases et
  chiffres viennent de lui ; ils sont recopiés dans `Clients.astro` et `casClient`, le formulaire lui-même n'est
  **jamais commité**. Citations **retouchées pour l'orthographe seulement, avec l'accord du client** (ses mots
  « ma CRM » et « L'IA » deviennent « mon logiciel » et « l'assistant », sens inchangé). « automatisations » reste
  dans la citation : ce sont ses mots, exception assumée à la liste noire du jargon.
- **Les retours privés du formulaire ne se publient pas** — ni sur le site, ni dans un commentaire de code, ni ici.
  Seules les réponses destinées au site (avis, avant / après, temps gagné, chiffres, identité) sont utilisables.
- **Nom de famille non fourni** : `casClient.nomFamille = null`. La signature dit **« Jason » seul, sans marqueur
  « à compléter »**, ni en dev ni en production (demande de l'humain, 2026-10-08) : un prénom suffit à signer un
  témoignage. Écart assumé à la convention `ACompleter` des pages vitrines. Ne jamais l'inventer ni le déduire d'un
  outil connecté ; s'il est fourni un jour, le renseigner dans `casClient` et il s'affiche.
- **Rôle** : `casClient.role` = « commercial et gestionnaire », mot du client (petite entreprise, plusieurs casquettes).
- **Anciens chiffres retirés le 2026-10-08** : devis 40 min → 2 min, fiche client 5 min → 30 s, compteurs de
  production (+50 devis, +30 rendez-vous, +40 fiches, 3 rapports d'analyse) et « mesuré au bout de 6 semaines ».
  Remplacés par ceux du formulaire ; ne pas les remettre. `CompareBars` n'est plus utilisé (conservé).
- **Le logiciel de gestion du client est nommé** (`casClient.logiciel` = Extrabat), dans le chapeau : seul nom de
  logiciel tiers du site, **exception assumée au piège 17** — ce n'est pas une démonstration, c'est ce qui a été
  construit. Le **nom seul**, jamais le logo, jamais de partenariat. `null` → « leur logiciel de gestion ».

#### Le cas (L'Atelier des Sols & Fils)
- Première exception à la règle « les exemples sont illustratifs, jamais un résultat client » (§5) : section
  réservée à un **cas réel, nommé avec l'accord explicite du client**. Ne pas généraliser sans le même accord pour
  chaque nouveau cas.
- **Aucune donnée de tiers** (client final de L'Atelier des Sols & Fils, montant d'un devis réel, numéro de pièce),
  **aucune donnée lue dans un outil connecté** (CRM, messagerie) : voir piège 17.
- **Identité du client** : nom, métier, prénom (**Jason**), rôle, nom de famille (`null`), lien vers son site et
  logo vivent dans `casClient`, `src/config/site.ts` — publiés **avec son accord explicite**. Rien ne s'ajoute là
  sans le même accord : un prénom est une donnée personnelle, pas un détail de mise en page.
- **Logo** : fichier fourni par le client, déposé dans `public/clients/` (`casClient.logo`). `Temoignage` vérifie sa
  présence au build (`existsSync`, `process.cwd()` — piège 24) : **fichier absent, pas d'image**. Hauteur `h-10`
  (40 px), largeur déduite du `viewBox` (CLS 0). **Posé sur une plaque `.section-invert`** : lettrage blanc sur fond
  transparent, il disparaîtrait sur le fond clair. Plaque sombre dans les deux thèmes plutôt qu'un logo retouché.
- **Un seul lien vers le site du client** : le nom de l'entreprise dans la signature (`↗` en `aria-hidden`). Le
  logo est décoratif (`alt=""`). (Avant le 2026-10-08 : un `Badge href` à côté du logo.)
- **`EnchainementClient`, allégé le 2026-10-08** (il montrait fiche client → devis → intervention → analyse,
  avec « L'IA » dans le texte) : **trois temps sur un seul devis** — 1 « Il demande le devis » (la bulle ; « il dicte » jusqu'au 2026-10-08, remplacé à la demande de l'humain : le formulaire du client ne parle pas de dictée), 2 « Le devis se
  prépare » (quatre lignes, montants en `text-12`, total en `--ink` semi-gras, **jamais en accent**), 3 « Il
  vérifie, c'est enregistré » (sa réponse, la pastille « oui », « devis enregistré dans le logiciel »).
  Eyebrow « Un devis, en trois temps ». La racine est une `<figure>`.
- **Légende visible remise** : « Exemple illustratif : client et montants inventés. » (`figcaption`). Elle avait été
  retirée le 2026-09-19 sur demande ; le plan « site moins geek », validé par l'humain, la redemande. **La règle
  d'invention reste entière** : client, commune et montants ne viennent d'aucune pièce réelle.
- Joué **en boucle** (~14 s) : l'étape en cours prend `border-accent`, ses éléments `data-cc-pas` apparaissent un à
  un, tenue finale 3,8 s, fondu, reprise. Contrat inchangé : état final rendu par le serveur, contenu toujours dans
  le DOM (`opacity` seule, CLS 0 mesuré sur un cycle), rien sous mouvement réduit, **bouton pause toujours rendu**
  hors mouvement réduit (WCAG 2.2.2 — en pause, l'état complet est réaffiché), arrêt hors écran. Script inchangé.
  Pas d'`aria-hidden` : tout le contenu est du vrai texte.
- **Le cadre d'une liste porte `data-cc-pas`, pas sa première ligne** : sinon il apparaît vide avant son contenu.
- Pas de jargon technique dans la section, y compris dans les petits libellés.
- JS natif et non React : un îlot de moins sur l'accueil. `Temoignage` n'a aucun script.

Non réalisés (prévus au cahier des charges, jamais nécessaires) : BorderBeam, Tabs.
Toujours réutiliser avant de créer.

### Constat — étiquettes de coût (section supprimée le 2026-10-07)
Historique : la section et son composant ont été retirés ; leurs scènes ont vécu dans les arguments de l'offre jusqu'au 2026-10-08 (trois assistants depuis).
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
  pastille `--accent-bright`, même texte `--ink` (`accent` sur `accent-soft` = 4,28:1 en clair à l'époque, donc
  jamais de texte accent sur ce fond). Pas le composant lui-même : ses `h-6`, `px-2`, `gap-2` et sa
  police mono (Inter depuis le 2026-10-08) demandaient 277 px pour la paire la plus courte, 320 px pour la plus longue — davantage que
  ce que la grille offre à n'importe quelle largeur. D'où la reprise en local : police sans, `px-1.5`,
  `py-0.5`, pastille `size-1`. **Si le Badge de série devient plus compact, revenir au composant.**
- `mt-auto` sur la rangée : les étiquettes s'alignent d'une carte à l'autre quelle que soit la longueur
  du texte au-dessus. `flex-wrap` est conservé comme filet de sécurité — jamais de débordement de carte.
- Vérifié avec **et sans** la webfont (`--disable-remote-fonts`) : la police de secours est 2 px plus
  étroite, le FOUT ne peut pas casser la ligne.

### Bandeau d'engagements
- Rangée fluide (`flex-wrap`, libellés en `whitespace-nowrap` à partir de `sm`), pas de grille à colonnes fixes :
  les libellés de longueurs inégales débordaient des colonnes et faisaient défiler toute la page (piège 12).
- **Inter 14 et coches douces** (2026-10-08, étape 2 du plan « site moins geek ») : libellés en Inter (mono avant),
  chaque « ✓ » dans une pastille ronde `size-5 bg-accent-soft text-accent text-12`, alignée sur la ligne de base
  du libellé (`items-baseline` + `inline-flex`). Coche en `aria-hidden` : exemptée de la règle « pas de texte
  accent sur accent-soft », comme les autres coches décoratives. Comportement de la rangée inchangé ; mesuré sans
  débordement à 360 / 640 / 1024 / 1280 px (1 colonne sous `sm`, 3 lignes à 640, 2 lignes à partir de 1024).
- Sous `sm`, une colonne, libellés autorisés à passer à la ligne. Libellé le plus long : 34 caractères
  (« chiffré uniquement sur vos besoins », « accès limités au strict nécessaire »).
- Contenu et registre du bandeau : voir « Copy (ligne éditoriale) » — des faits sans sujet, pas de « il » pour
  l'assistant : le bandeau doit se lire seul.

## Copy (ligne éditoriale)
Passe du 2026-10-08 (plan « site moins geek », étape 4) : **le site parle à la première personne et à tout le
monde**. Ton de référence : `variantes/v10/COPY.md` (« Voix et ton »). Elle remplace la passe du 2026-09-19
(« on part de vos outils… elle prend les devants… »), dont l'esprit reste : mots simples, promesses adossées à un
mécanisme réel. Aucun chiffre, aucune durée, aucun prix n'a été ajouté à cette occasion.

- **Voix : « je » (Joris), vouvoiement du lecteur.** sosese, c'est Joris : plus de « on » ni de « nous » pour
  sosese, nulle part (titres, chapeaux, FAQ, formulaires, pages légales là où sosese parle). Joris est nommé dès le
  chapeau du hero (« Je suis Joris. »). Restent permis : le « on » impersonnel (« les questions qu'on me pose »),
  « Parlons-en » (vous et moi), et le « nous / nos » des **personnages** (phrases des clients inventés dans les
  maquettes, mots de Jason) ou du **visiteur** (une question de FAQ posée par lui).
- **Cible : artisans, indépendants, petites entreprises** — dans cet ordre, ou « les petites entreprises » seul.
  Plus de « PME », plus de « vos équipes » quand le lecteur peut être seul (« vous ou votre équipe »).
- **Phrases courtes, un titre = un message, aucun point d'exclamation.** On doit comprendre l'offre en ne lisant
  que les titres : ce que je fais (hero), la preuve (Clients), comment (Méthode), quoi (Offre), les garanties
  (Confiance), quoi faire (CTA).
- **Liste noire, hors « Sous le capot »** : *IA*, *agent*, *connecteur*, *automatisation / automatisé*, *API*,
  *MCP*, *données*, *outil* (quand « logiciel » suffit), *workflow*, *PME*, *processus*, *chronophage*, *solution*
  (pour désigner ce que je construis). Mots de remplacement : « l'assistant », « vos logiciels », « relier »,
  « préparer », « prendre en charge », « vos informations ». Exceptions assumées, à ne pas étendre :
  - **« IA »** : seulement dans la FAQ, là où la question la pose (« Et si l'IA invente un prix ? »), dans les
    questions du questionnaire prospects (on y mesure l'usage de l'IA, ce sont des questions d'étude), et dans
    **« rien ne sert à entraîner une IA »** — carte « Rien de mémorisé, rien de réutilisé » de Confiance et réponse
    de FAQ « Mes données sortent-elles de l'entreprise ? » (décision de l'humain, 2026-10-08, étape 4 bis) : c'est
    la crainte réelle du visiteur, « un autre programme » l'esquivait.
  - **« données »** au sens de vie privée : titre de Confiance (« Vos données restent les vôtres »), « Vos données
    ne quittent pas l'Europe », questions de FAQ sur la confidentialité,
    mention du questionnaire et pages légales.
  - **« automatisations »** et **« expertise »** dans la citation de Jason : ses mots.
  - **« outils »** quand le mot englobe papier, téléphone et logiciels (chapeau du questionnaire, section « Vos
    outils ») ou quand le logiciel est un instrument de détection (politique de confidentialité).
  - « Sous le capot » garde tout son jargon : c'est la touche geek assumée. Il passe au « je » comme le reste.
  - Pages légales : seulement le passage au « je » là où sosese parle, **jamais un changement de sens juridique**.
- **Un seul nom pour ce que je construis : « l'assistant »** (le mot du client dans son témoignage). Plus de « la
  solution », plus de « elle ». Il est présenté dans le titre du hero (« Je construis l'assistant qui s'occupe du
  reste », 2026-10-08) et décliné dans l'offre en trois assistants (commercial, chiffres, saisie — voir « Offre :
  trois assistants »).
- **« il » a besoin d'un antécédent.** Il désigne l'assistant seulement dans un texte où « l'assistant » vient
  d'être nommé (hero, offre, chapeau de Confiance, FAQ) ; une section éloignée le renomme avant d'employer le
  pronom (chapeau de Confiance : « L'assistant lit ce qu'il faut. Il n'en garde rien. »). Dans le cas client, « il »
  désigne **Jason**, jamais la machine — et le chapeau nomme Jason à chaque geste pour lever l'ambiguïté. Le
  bandeau d'engagements n'emploie aucun pronom.
- **Règles ≠ données.** « Il retient vos règles » et « rien de mémorisé » se contredisent si les deux objets ne
  sont pas nommés séparément. Depuis le 2026-10-08 (trois assistants), l'offre n'en parle plus : la distinction vit
  dans la carte « Rien de mémorisé, rien de réutilisé » de Confiance (« Ce qu'il retient — vos règles, vos
  préférences ») et dans la FAQ « mémoire ». Formulation canonique si elle revient ailleurs : *il garde vos règles,
  pas vos données* (au sens de vie privée : les documents lus ne sont pas conservés). **Ne jamais écrire que
  l'assistant « apprend de vos documents ».**
- **Pas de promesse d'impossibilité.** Un LLM est dans la boucle : on écrit « il ne calcule jamais un prix
  lui-même, il lit vos tarifs dans votre logiciel », jamais « impossible par construction ». La garantie tient à la
  porte de validation, pas à une propriété du modèle.
- **Pro-activité** : « il prend les devants » est tenu par des routines — heure fixe ou seuil de déclenchement.
  La promesse reste adossée à un mécanisme réel. Retirée de l'offre le 2026-10-08 avec les quatre arguments, **revenue
  le même jour dans la carte commerciale** (étape 5, texte de l'humain) : « … repère qui relancer, chaque lundi ou
  dès qu'un devis attend trop, et vous propose le message, prêt à partir. » — « chaque lundi » est l'heure fixe,
  « dès qu'un devis attend trop » le seuil. « Le dossier n'attend plus quand la bonne personne est absente » est
  abandonné.
- **Exception à B8 (un argument, un seul endroit)** : « accès limités au strict nécessaire » est énoncé **en fait**
  dans le bandeau d'engagements (réflexe de méfiance nº 1 : « il va tout lire ») et **argumenté** une seule fois,
  dans la section Confiance (« Il ne consulte que ce qu'il faut »). Aucun autre argument n'a droit à ce doublon.
  (« les accès de l'IA sont maîtrisés » jusqu'au 2026-10-08 ; avant, « rien n'est mémorisé par défaut ».)
  Le chapeau du hero décrit le déroulé (« il prépare le travail, vous vérifiez, puis c'est enregistré ») sans
  argumenter la porte : c'est Confiance qui la promet et la détaille.
- **Titres et descriptions des pages (SEO)** suivent les mêmes règles : titre de l'accueil = ce que je fais et pour
  qui (« Un assistant sur mesure pour artisans, indépendants et petites entreprises | sosese », 2026-10-08 — le
  `h1` « Vous me parlez de votre métier… » ne dit rien seul dans un onglet ou un résultat de recherche ; jusque-là
  le titre reprenait l'ancien `h1`), descriptions en « je » (Joris nommé sur l'accueil
  et `/a-propos`), sans « IA » ni « PME ». Titre et description par défaut dans `site.ts` (`site.title`,
  `site.description`). Les pages légales gardent leur description descriptive à la troisième personne.
- **Mêmes libellés de bouton partout** : l'appel principal vient de `cta.label` (`site.ts`, « Parlons-en ») pour
  l'en-tête, le hero, le bouton flottant, le menu mobile, le CTA final et la 404 — ne jamais l'écrire en dur.
- **Titres de cartes scannés, pas lus** : ce qu'on veut faire savoir est dans le titre. La carte de Confiance
  s'appelle « Rien de mémorisé, rien de réutilisé » (« … rien qui serve à entraîner l'IA » jusqu'au 2026-10-08) et
  non « Aucun entraînement » avec la mémoire dans le corps. La grille `lg:grid-cols-4` impose **quatre cartes** :
  toute carte ajoutée en remplace une autre ou fusionne avec elle.
- **Porte de validation (Confiance)** : **« votre oui »** seul, dans une pastille, entre « Il avance seul » et « Il
  s'arrête net ». Deux mots tiennent en `nowrap` sans manger la largeur des panneaux.
- **Méthode : des noms courts en titre** (Atelier / Feuille de route / Construction), la phrase d'action en
  première ligne de description, en « je » (« Je regarde avec vous, sur le terrain… »). Trois titres commençant
  par « Je » feraient de moi le sujet de ma propre méthode, et ne se survolent pas.
- **Cas client** : pas de « réel » ni de « vrai » dans l'eyebrow — on ne précise « vrai » que là où le doute
  existe. L'eyebrow est `Clients`, la parole du client prouve. « IA » n'y apparaît pas hors de ses mots.
- **Vocabulaire retiré depuis 2026-09-19, toujours valable** : *studio IA*, *cartographier vos processus*,
  *livrable* (→ « vous recevez »), *système d'information* (→ « vos logiciels »), *réversibilité* (→ « vous pouvez
  reprendre la main »), *accord explicite* (→ « votre oui »), *documentation remise à la livraison* (→ « le mode
  d'emploi est livré avec »). Registre jamais oral appuyé (ni « calé », ni « vaut le coup », ni « c'est top ») :
  un mot courant à la place d'un mot technique, jamais une phrase qui prend le lecteur de haut.
- **Vérifier après toute retouche de texte** : `grep -rniE "\b(nous|notre|nos|on )\b" src shared` et la liste
  noire (`grep -rnwiE "IA|agent|connecteurs?|automatis[a-zéè]*|API|MCP|données|outils?|workflow|PME|solution"`),
  hors labo et composants non rendus ; chaque occurrence restante est un commentaire de code, une réplique de
  personnage, « Sous le capot » ou une exception ci-dessus. Puis `scrollWidth` à 360 / 640 / 1024 / 1280 px
  (piège 12) si un libellé s'est allongé.

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
  d'une petite structure. **Précisée le 2026-10-08** (plan « site moins geek », étape 4) : artisans, indépendants,
  petites entreprises — le site dit que c'est pour tout le monde. L'écart « de 15 à 150 personnes » de
  `/a-propos` est corrigé (« J'accompagne les artisans, les indépendants et les petites entreprises »).
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
- `letter-spacing` : `-0.02em` (titres), `0.08em` (eyebrow), `tracking-tight` (`h1` / `h2`, wordmark, messages de succès des formulaires, liens du menu mobile).
- Anneau de focus : `2px` d'épaisseur et de décalage.
- `grid-cols-[2fr_1fr_1fr_1fr]` dans le footer (proportions de grille, pas un espacement).
- `max-w-xs` sur l'accroche du footer (échelle de largeurs Tailwind conservée).
- `max-w-4xl` sur le h1 du hero en texte seul (même échelle de largeurs).
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
- `Clients` : grille `lg:grid-cols-[2fr_3fr]` (chiffres à gauche, avant / aujourd'hui à droite).
- `Methode` : pas de révélation de 260 ms (420 ms pour un trait) dans le script, décalage `translateY(calc(var(--space-unit) * 3))` de `.revele-cache`.
- `CompareBars reveal` : même pas de 260 ms, seuil `IntersectionObserver` à 0,25.
- `Temoignage` : logo rendu en `h-10` (40 px), largeur calculée depuis le `viewBox` du SVG.
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
12. **Libellés qui passent à la ligne** (mono à l'origine) dans une rangée étroite : forcer `whitespace-nowrap` et ne passer
    en ligne qu'à partir de la largeur qui les contient (FlowDiagram horizontal seulement ≥ xl).
    Revers : un libellé `whitespace-nowrap` plus long que sa colonne déborde **sans rien signaler** et fait défiler
    toute la page horizontalement (cas du bandeau d'engagements). Après tout ajout ou allongement de libellé, vérifier
    `document.documentElement.scrollWidth` à 360, 640, 1024 et 1280 px. Vaut aussi pour un **changement de
    police** : le passage de la mono à Inter (2026-10-08) a raccourci tous les libellés, revérifié sans débordement.
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
    La recette du RUNBOOK (§2.4 et §2.5, et `scripts/release.sh` depuis la v0.9) n'appelle plus `npm install` et impose un `git diff` de contrôle.
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

30. **Un SMTP qui se fige ne renvoie aucune erreur : la requête reste pendante.** Rencontré le 2026-10-07 en
    local : Mailpit acceptait les connexions sans plus répondre, et le questionnaire restait sur « Envoi en
    cours… » sans message ni journal d'erreur. Avec les délais par défaut de nodemailer, ce serait jusqu'à 10 min
    en production. → Délais explicites sur le transport (`server/index.mjs`) ; en local, un envoi qui ne répond
    plus se diagnostique par `printf 'QUIT\r\n' | nc 127.0.0.1 1025` (pas de « 220 » = redémarrer Mailpit).

31. **Retirer un préchargement de police peut faire apparaître un décalage qui existait déjà.** Le 2026-10-08,
    sans le `preload` de la mono, un CLS de 0,0008 à 0,0012 est apparu une fois sur trois en local (Chrome
    headless, `npm start`, ≥ 1024 px, pages internes) : une première image peinte pendant que l'analyse du HTML
    est arrêtée sur le script d'amorçage des îlots d'Astro, au début du groupe de droite de l'en-tête (bouton de
    thème) — groupe encore vide, donc la navigation centrée par `justify-between` se décale de 88 px quand il se
    remplit. Le second préchargement retardait simplement la première image. **Sous réseau bridé** (150 ms,
    1,6 Mb/s) : 0 décalage sur 30 chargements, avant comme après ; c'est un artefact de serveur local instantané.
    → Pour juger un CLS de chargement, mesurer plusieurs passages, **dont un bridé**, et comparer au commit
    précédent (worktree + `PORT=3001`) avant de conclure. Si le décalage devait apparaître en production, la piste
    est l'en-tête (réserver la largeur du groupe de droite), pas le retour du préchargement.

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
- Texte `--accent` sur fond `--accent-soft` (AA de justesse depuis le 2026-10-08, 4,62:1 : la règle reste)
