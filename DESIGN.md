# DESIGN.md — sosese

Comment le site est construit et pourquoi. À lire avant toute modification du front.
Serveur, image, CI et VPS : `RUNBOOK.md`. Règle de rédaction de ce fichier : la règle en vigueur et sa raison en une
phrase ; pas d'historique (il est dans git et `CHANGELOG.md`).

## Règles non négociables
- Aucune couleur, rayon ou espacement en dur : toujours un token de `src/styles/tokens.css` (exceptions listées plus bas).
- Une seule couleur d'accent. `--accent-bright` n'est jamais une couleur de texte sur fond clair.
- Cartes : bordure 1px `--border` + `--shadow-sm` (l'ombre seule disparaît en sombre, la bordure seule fait « tableau
  de bord »). `--shadow-md` est réservée aux éléments flottants. Pas d'ombre sur ce qui n'est pas une carte.
- Tout est vérifié dans les deux thèmes.
- Toute animation respecte `prefers-reduced-motion`. **Seule exception : le terminal** (voir « Terminal »).
- Aucun texte technique hors de la section « Sous le capot » (voir « Copy »).
- Tout est statique. Interactivité : îlots React (`client:idle`) seulement pour thème, menu mobile, terminal,
  formulaire de contact et questionnaire ; ailleurs, JS natif dans un `<script>` de composant (Méthode,
  `CompareBars`, `EnchainementClient`, `RotationEcrans`, `ProtocoleBoutEnBout`), **jamais `is:inline`**.
  Avant de créer un îlot, vérifier qu'un composant statique ou quelques lignes de JS natif ne suffisent pas.
- Jamais de donnée inventée présentée comme réelle, jamais de donnée lue dans un outil connecté (piège 11).

## Tokens
Source unique : `src/styles/tokens.css` (valeurs claires sur `:root`, sombres sur `[data-theme="dark"]`, et
`.section-invert` : sombre dans les deux thèmes, avec **tous** les tokens redéfinis, sinon le clair fuit dedans).
Exposés à Tailwind dans `global.css` via `@theme inline reference` (piège 1) : `bg-bg`, `bg-bg-subtle`, `bg-surface`,
`text-ink`, `text-ink-muted`, `border-border`, `border-border-strong`, `bg-accent`, `text-on-accent`, `rounded-md`,
`shadow-sm`, `text-14`, `font-display`, `font-mono`… La palette, les rayons, ombres, tailles de texte et polices par
défaut de Tailwind sont désactivés : `bg-red-500` ou `text-sm` ne produisent rien, sans erreur (piège 2).

| Groupe | Tokens |
|---|---|
| Couleurs | `--bg`, `--bg-subtle`, `--surface`, `--ink`, `--ink-muted`, `--border`, `--border-strong`, `--accent` (#AC4F08 clair / #F59E0B sombre), `--accent-hover`, `--accent-bright` (décoratif), `--accent-soft`, `--on-accent` |
| Rayons, ombres | `--radius-sm/md/lg/full`, `--shadow-sm` (cartes), `--shadow-md` (flottants) |
| Typographie | `--font-sans`, `--font-display` (serif du témoignage), `--font-mono`, `--text-12` … `--text-64`, `--text-body` (17px), `--leading-body`, `--leading-tight`, `--measure` (70ch) |
| Gabarit | `--space-unit` (4px), `--section-y` (64/96px), `--hero-y` (32/64px), `--gutter` (20/32px), `--container` (72rem), `--header-h` (64px), `--fab-offset`, `--fab-clearance` (place réservée sous le footer pour le bouton flottant), `--dot-gap` |
| Mouvement | `--duration-fast/base/slow` (à 0 sous mouvement réduit), `--ease-out`, `--duration-blink` (curseur du terminal, jamais à 0) |

**Contrastes (WCAG AA, ≥ 4,5:1)** — vérifiés dans les deux thèmes : `ink`, `ink-muted` et `accent` passent en texte sur
`bg`, `bg-subtle` et `surface` ; `accent` passe sur `accent-soft` posé sur `bg` ou `surface` (4,62:1, marge mince).
**Échec : `accent` sur `accent-soft` posé sur `bg-subtle`, en clair (4,28:1)** : n'y mettre que du décoratif
`aria-hidden`, sinon texte en `--ink`. Par prudence, badges et états actifs sur `accent-soft` ont leur texte en
`--ink`. Tout nouveau couple texte / fond se recalcule dans les deux thèmes avant usage.

## Thème
- `data-theme="light" | "dark"` sur `<html>`, posé par le script inline en tête de `Base.astro` avant tout rendu :
  choix mémorisé (`localStorage`, clé `theme`), sinon préférence système, suivie en direct sans choix mémorisé.
- Chaque thème fixe `color-scheme`. Variante `dark:` branchée sur `data-theme`, seulement quand un token ne suffit pas.

## Typographie
- **Inter** partout (corps, titres, libellés, chiffres). **Georgia** (`font-display`, pile `Georgia, "Noto Serif",
  serif`, graisse 400) seulement pour la citation de `Temoignage` et le « ≈ 4 h » de `Clients`. **JetBrains Mono**
  seulement dans « Sous le capot » (section, terminal).
- Polices variables latin dans `public/fonts/`, familles `"Inter"` et `"JetBrains Mono"`. **Seul Inter est
  préchargé** (piège 21). Police de secours `"Inter Fallback"` aux métriques mesurées sur `inter-var.woff2` :
  remplacer le fichier = remesurer. Pas d'italique chargée.
- Échelle 12 14 16 18 21 28 36 48 64 ; corps 17px / 1.6.
- Titres `h1`–`h4` : `--leading-tight`, `-0.02em`, `text-wrap: balance`. **`h1` et `h2` portent leurs classes**
  (`font-semibold tracking-tight`) : il n'y a pas de règle de base, un titre sans classe sortirait en 400 → passer
  par `SectionHeading` / `PageHeader` ou recopier les classes.
- Chiffres comparés en colonne : `tabular-nums`.
- Utilitaire `eyebrow` (Inter 600, 12px, capitales espacées). Eyebrow de section en `text-accent`
  (`SectionHeading`, `PageHeader`, hero, CTA final, 404) ; libellés internes en `--ink-muted`.

## Espacement et mouvement
- Tailwind est rebranché sur `--space-unit` : `p-4` = 16px. Padding, marge et gap en **pas entiers** uniquement ;
  demi-pas tolérés seulement pour un micro-déplacement au survol ou une taille de pastille.
- Contrôles : `h-8/10/12` boutons sm/md/lg, `h-14` bouton flottant ; icônes `size-5` dans des zones `size-10`.
- Transitions `duration-(--duration-fast)` (couleurs, boutons) ou `--duration-base` (cartes), toujours `ease-out`,
  propriétés listées (`transition-[…]`, jamais `transition-all`). Toute transformation est préfixée `motion-safe:`.
- Une animation ne touche que `transform` ou `opacity` (piège 22).

## Accessibilité
- Lien d'évitement → `#contenu` (`<main tabindex="-1">`). Focus : `outline 2px var(--accent)`, offset 2px, global
  sur `:focus-visible`, jamais retiré.
- Icône seule = `aria-label`, SVG en `aria-hidden`. Page courante : `aria-current="page"`. Chaque `<nav>` a un label.
- Un seul `h1` par page, un `h2` par section, des `h3` au plus.
- Toute animation qui boucle plus de 5 s a un **bouton pause toujours rendu** hors mouvement réduit (WCAG 2.2.2),
  et s'arrête hors écran (`IntersectionObserver`). Ne jamais retirer ces boutons.

## Conventions
| Élément | Convention |
|---|---|
| Fichiers | `ui/` primitives statiques, `ui/diagrams/` schémas, `layout/` gabarit, `sections/` sections de l'accueil, `islands/` îlots React (export par défaut), PascalCase |
| Textes partagés | `src/config/site.ts` : `site`, `mainNav`, `legalNav`, `cta` (libellé « Parlons-en », jamais en dur), `legal`, `personne`, `casClient` |
| Utilitaires | token sans utilitaire : `py-(--section-y)`, `max-w-(--measure)` ; maison (`global.css`) : `container-site`, `eyebrow`, `fab-position`, `prose-site`, `dot-pattern` |
| Variantes de composant | `variant`, `size` (sm/md/lg), `href` bascule en `<a>`, `class` fusionnée par `class:list` |
| Groupes de survol | nommés : `group/card` → `group-hover/card:` |
| Ancres, textes, commentaires | en français ; ancres sans accent (`#methode`, `#cas-client`) |
| Wordmark | `sosese<span class="text-accent">.</span>` |

## Composants
| Composant | Fichier | Rôle / API |
|---|---|---|
| Base | `layouts/Base.astro` | `title`, `description`, `noindex` ; script anti-flash, préchargement d'Inter, canonical |
| Header, Footer | `layout/` | en-tête collant à fond plein (pas de `backdrop-filter`) ; footer : nav, légal, contact |
| MobileCta | `layout/MobileCta.astro` | bouton flottant « Parlons-en », < md, toujours visible, masqué sur `/contact` et `/questionnaire` |
| ThemeToggle, MobileNav | `islands/` | îlots ; MobileNav en `<dialog>` modal natif (focus et Échap gérés par le navigateur) |
| Button | `ui/Button.astro` | `variant` primary/secondary/ghost, `size`, `href` ; pilule, `whitespace-nowrap` |
| Card | `ui/Card.astro` | `interactive` (implicite si `href`), `padding` md/lg ; l'apparence de référence des cartes |
| SectionHeading | `ui/SectionHeading.astro` | `id`, `eyebrow`, `title` (h2), slot = chapeau |
| PageHeader | `ui/PageHeader.astro` | en-tête des pages internes : `eyebrow`, `title` (h1), slot chapeau, slot `actions` |
| Accordion | `ui/Accordion.astro` | `<details>` natif, `name` optionnel (ouverture exclusive), zéro JS |
| ACompleter | `ui/ACompleter.astro` | marqueur visible d'un contenu non fourni (`label`) |
| PastilleIcone | `ui/PastilleIcone.astro` | pastille `size-9`, tracé SVG statique (`trace`), `ton` accent / neutre, `aria-hidden` |
| Temoignage | `ui/Temoignage.astro` | parole d'un client réel, sans script : `citation`, `prenom`, `nomFamille` (`null` → prénom seul), `role`, `entreprise`, `site?`, `logo?` (vérifié au build, piège 16) |
| DotPattern | `ui/DotPattern.astro` | trame de points, sections invert seulement (« Sous le capot ») |
| Figure | `ui/diagrams/Figure.astro` | conteneur de schéma : `label`, `caption`, slot |
| CompareBars | `ui/diagrams/CompareBars.astro` | barres de comparaison : `bars`, `max?`, `reveal?` (révélation au défilement) |
| EnchainementClient | `ui/diagrams/EnchainementClient.astro` | démonstration en boucle d'un devis en trois temps (voir « Cas client ») |
| RotationEcrans | `ui/diagrams/RotationEcrans.astro` | maquette de l'Offre (voir « Rotation d'écrans ») |
| ProtocoleBoutEnBout | `ui/diagrams/ProtocoleBoutEnBout.astro` | planche de « Sous le capot » (voir « Le protocole, de bout en bout ») |
| TerminalDemo | `islands/TerminalDemo.tsx` | voir « Terminal » |
| ContactForm, Questionnaire | `islands/` | voir « Formulaires » |

Toujours réutiliser avant de créer.

## Pages et sections
**Accueil** (`src/components/sections/`), dans l'ordre : Hero, Engagements, Clients (`#cas-client`), Methode
(`#methode`), Offre (`#offre`), SousLeCapot (invert), Confiance (`#confiance`), Faq (`#faq`), CtaFinal (invert).
Le menu suit l'ordre de la page.
- Section : `<section aria-labelledby>` + `py-(--section-y)` + `container-site`, un `h2` via `SectionHeading`.
- Fonds alternés `bg-bg` / `bg-bg-subtle`, **sans filet** : le changement de fond sépare. Les sections invert gardent
  `border-y border-border` (sinon elles se confondent avec la page en sombre).
- Une seule apparence de carte (`Card`). Écrites à la main avec les mêmes classes quand l'élément n'est pas un `div`
  (`Temoignage`, blocs de Clients, `EnchainementClient`, panneaux de Confiance, cadre de la Méthode). Sans ombre,
  volontairement : cases **dans** une carte, blocs de « Sous le capot », terminal et maquettes, champs de formulaire.

**Pages internes** : `/a-propos`, `/contact`, `/questionnaire` (`noindex`, hors navigation), `/mentions-legales`,
`/confidentialite`, `404` (`noindex`). Structure : `PageHeader` puis `container-site` + `py-(--section-y)`. Textes
longs : `prose-site` sur le conteneur, HTML simple dedans.

**Contenus non fournis** : valeurs dans `src/config/site.ts`, `null` = non fourni, **jamais inventé**. Pages légales :
`<ACompleter>` partout, et le build liste les champs manquants. Pages vitrines : marqueur en dev, bloc masqué en
production.

**FAQ** : un fichier Markdown par question dans `src/content/faq/` (frontmatter `question`, `ordre` ; schéma dans
`src/content.config.ts`). Le corps est aussi injecté dans le JSON-LD `FAQPage`.

### Hero
Texte seul, une colonne : eyebrow, `h1` (`text-36` / `sm:text-48` / `lg:text-64`, `max-w-4xl`), chapeau, boutons.
Première phrase du titre en `text-ink-muted`, la promesse en `text-ink`. Aucun script ni animation au-dessus de la
ligne de flottaison. Sous `md`, pas de « Parlons-en » dans le hero (le bouton flottant le porte ; masqué par un
conteneur `hidden md:block`, piège 3) : un et un seul « Parlons-en » visible à toute largeur.

### Engagements
Rangée fluide (`flex-wrap`, `whitespace-nowrap` dès `sm`), pas de grille fixe (piège 7). Coches dans une pastille
`accent-soft`, `aria-hidden`. Faits sans sujet ni pronom : le bandeau se lit seul.

### Cas client
Section `Clients.astro` : la parole de Jason, commercial et gestionnaire chez L'Atelier des Sols & Fils.
- **Seul cas réel du site, publié avec l'accord explicite du client.** Identité (entreprise, prénom, rôle, site,
  logo, logiciel) dans `casClient` (`site.ts`). Rien ne s'y ajoute sans le même accord. Nom de famille non fourni
  (`null`) : signature « Jason » seule, sans marqueur.
- **Source unique : le formulaire de satisfaction rempli par le client**, jamais commité. Citations retouchées pour
  l'orthographe seulement (accord du client). Ses retours privés ne se publient nulle part.
- Ordre : titre « Ce qu'en dit {prénom}, chez {entreprise} » ; `Temoignage` (logo sur plaque `section-invert`, car
  lettrage blanc ; filet et guillemets en accent) ; usage et **deux chiffres, pas plus** (devis 25 → 3 min en
  `CompareBars reveal`, « ≈ 4 h » par semaine) ; avant → aujourd'hui (ses phrases mot pour mot) ; puis la démonstration.
- Ne pas afficher : les 2 h d'administratif d'avant, sa note de recommandation, la taille de l'équipe en chiffre.
- Le logiciel du client (Extrabat) est nommé une fois, le nom seul : c'est ce qui a été construit. Aucune autre
  marque tierce sur le site.
- `EnchainementClient` : un devis en trois temps (il demande → le devis se prépare → il vérifie, c'est enregistré),
  légendé « Exemple illustratif : client et montants inventés ». **Tout y est inventé** (piège 11). Total jamais en
  accent : ses montants ne concurrencent pas les chiffres du client. Boucle ~14 s, état final rendu par le serveur,
  `opacity` seule, bouton pause. Le cadre d'une liste porte `data-cc-pas`, pas sa première ligne.

### Méthode
Trois étapes (Atelier / Feuille de route / Construction), pastilles reliées par un trait, cadre « Votre temps / Durée /
Vous recevez ». Cadres alignés dès `md` par sous-grille (`md:grid-rows-subgrid`, conteneur en `md:contents` : ne rien
poser sur un `display: contents`). Révélation séquentielle une fois, par script natif (`IntersectionObserver` 0,25,
`data-revele`, `.revele-cache` posée par le script seulement : sans JS ou sous mouvement réduit, tout est visible).

### Offre
`h2` « Quel assistant vous faut-il ? », trois cartes `Card` (commercial, chiffres, saisie), chacune : pastille
d'icône, `h3` = la question, corps en `text-ink-muted`. Grille `lg:grid-cols-[1fr_24rem]` avec `RotationEcrans` à
droite, `lg:items-center`. Preuves autorisées, et seulement celles-ci : la ligne « Pour Jason, j'en ai tiré un
rapport… » (jamais son contenu, même anonymisé : Jason est nommé, tout chiffre lui serait attribuable) et le lien
« Voir ce qu'en dit Jason ».

### Rotation d'écrans
`RotationEcrans` : le même enchaînement (une demande arrive, l'assistant consulte les logiciels, une action prête à
valider) joué dans quatre décors (messagerie, boîte mail, téléphone, gestion), deux écrans chacun, ~100 s le tour.
- Contrat commun des schémas animés : **état rendu par le serveur = état final**, tout est toujours dans le DOM,
  écrans empilés dans une même cellule de grille (hauteur constante), bouton pause avec **vraie pause** (`data-fige`
  gèle les animations CSS, le minuteur garde son reliquat), arrêt hors écran, rien sous mouvement réduit.
- Quatre boutons de décor (`aria-pressed`) ; un clic prend la main et arrête la rotation.
- Largeur fixée par la piste de grille (24rem ; 21rem est le plancher où libellés et bouton tiennent sur une ligne).
- CSS de composant en `cqw` (se redimensionne d'un bloc), couleurs en tokens. Durées CSS et script appariées
  (`--rot-entree`/`ENTREE`, `--rot-sortie`/`SORTIE`) : changer l'une, changer l'autre. Fondu séquentiel, pas croisé.
- Données inventées ; les outils sont des catégories, jamais une marque. Dans la maquette, l'assistant dit « je » :
  réplique de personnage.

### Confiance
Deux panneaux « Il avance seul » / « Il s'arrête net » séparés par la porte « votre oui » (seul aplat `bg-accent` de
la section), puis quatre cartes (`lg:grid-cols-4` : en ajouter une = en retirer une).

### Sous le capot (section invert)
Seule section technique : jargon, mono et `DotPattern` y sont permis. Contient le terminal (pleine largeur) et, dans le
volet « La pile technique en détail », la planche du protocole.

### Terminal
- `TerminalDemo` porte `.section-invert`. **Ignore `prefers-reduced-motion`** (décision de l'humain : figé, il
  paraissait cassé ; c'est du texte tapé, sans déplacement). Ne pas étendre l'exception à d'autres animations.
- SSR = état final complet ; lignes non tapées en `invisible` (hauteur fixe) ; bloc `aria-hidden` + transcription
  `sr-only` ; bouton pause toujours rendu, **pas de pause au survol** (piège 12).
- Dernière ligne sans chiffre ni gain : les seuls chiffres de résultat du site sont ceux du client.

### Le protocole, de bout en bout
`ProtocoleBoutEnBout` : où tourne quoi (client, serveur MCP, éditeur) et ce que chaque étage fait à l'objet qui
circule ; treize temps en boucle (~39 s). Même contrat que `RotationEcrans` (état final `data-etape="13"`, vraie pause
qui suspend aussi les transitions via `getAnimations`).
- Carrée, tout en `cqw` : lisible à partir de ~1024 px seulement → **masquée sous `lg`** (bloc `hidden lg:flex`,
  phrase de remplacement), transcription `sr-only` hors du bloc masqué. L'`IntersectionObserver` observe le bloc
  masqué, pas la racine (sinon la boucle tourne pour rien sous `lg`).
- Déplacements en `translate` (piège 22). Pas de `section-invert` sur la planche (piège 17).

## Schémas
- Trois registres et pas un de plus : **R1 schéma de flux**, **R2 maquette d'interface**, **R3 comparaison de
  grandeurs**. SVG en ligne ou HTML avec tokens, jamais de bitmap (seule exception : le logo du client, servi tel
  quel). Un schéma **remplace** du texte, il ne s'y ajoute pas.
- La valeur est toujours écrite ; barres et liaisons en `aria-hidden`. Couleur jamais seule porteuse de sens.
- Barres : plancher `max(<pct>%, calc(var(--space-unit) * 2))`, proportions en `flex-grow`, libellés hors du segment.
- `.bar-grow` (scroll-driven, CSS seule) et `CompareBars reveal` (script) s'excluent.
- Libellés en HTML, SVG pour la géométrie seulement (piège 14).

## Formulaires
### Contact (`/contact`, `ContactForm`)
- Règles partagées client / serveur : **`shared/contact.json`** (secteurs, puces, limites, champ piège, durée minimale,
  regex). `src/lib/contact.ts` côté front, schéma zod côté serveur. Modifier une règle = modifier ce JSON.
- Obligatoires : nom, société, email, secteur, consentement. Un libellé de puce ne contient jamais « , » (le serveur
  découpe sur « , »).
- `noValidate` + validation React : `aria-invalid`, message relié, focus sur le premier champ en erreur. Erreurs en
  `--accent` (pas de rouge) avec préfixe « ! ». États `idle` / `sending` / `success` (focus sur le panneau) / `error`
  (`role="alert"`, champs conservés, email de repli affiché).
- Puces : cases `sr-only` dans des `<label>` stylés par `has-checked:` — zéro état React.
- En dev, `/api` est relayé vers `127.0.0.1:3000` : lancer `npm run build && npm start` à côté pour tester l'envoi.

### Questionnaire (`/questionnaire`, `Questionnaire`)
- Questionnaire prospects envoyé par lien direct et proposé sur `/contact`. `noindex`, hors navigation.
- **Source unique : `shared/questionnaire.json`** (sections, questions, options, limites, accusé de réception) ;
  `src/lib/questionnaire.ts` côté front, `server/questionnaire.mjs` côté serveur. Types : `texte`, `paragraphe`,
  `nombre`, `choix`, `multi`, `email`, `tel` ; `optionsDe` reprend les listes de `contact.json`.
- Tout est facultatif sauf le consentement. Validation par étape, mêmes motifs que le contact.
- Changement d'étape : focus sur le `h2` de l'étape (`preventScroll`) puis `scrollIntoView` sur la carte
  (`data-questionnaire-carte`) — un `focus()` seul remontait au titre de la page.
- Brouillon en `localStorage` (`questionnaire-brouillon`), effacé après envoi ; mentionné dans `/confidentialite`.
- Les questions (qui disent « IA ») ne se reformulent pas : ce sont des questions d'étude, comparables entre réponses.

## Copy
- **Voix : « je » (Joris), vouvoiement du lecteur.** Jamais « on » ni « nous » pour sosese. Permis : « on »
  impersonnel, « Parlons-en », le « nous » des personnages (clients inventés, mots de Jason) ou du visiteur.
- **Cible : artisans, indépendants, petites entreprises.** Plus de « PME » ni de « vos équipes ».
- Phrases courtes, un titre = un message, aucun point d'exclamation. On comprend l'offre en ne lisant que les titres.
- **Liste noire, hors « Sous le capot »** : *IA*, *agent*, *connecteur*, *automatisation*, *API*, *MCP*, *données*,
  *outil* (quand « logiciel » suffit), *workflow*, *PME*, *processus*, *chronophage*, *solution*. Remplacements :
  « l'assistant », « vos logiciels », « relier », « préparer », « vos informations ». Exceptions, à ne pas étendre :
  « IA » dans la FAQ là où la question la pose, dans le questionnaire et dans « rien ne sert à entraîner une IA »
  (Confiance, FAQ) ; « données » au sens de vie privée ; les mots de Jason dans sa citation ; « outils » quand il
  englobe papier et téléphone. Pages légales : passage au « je » seulement, jamais de changement de sens juridique.
- **Un seul nom : « l'assistant ».** « il » seulement si « l'assistant » vient d'être nommé ; dans le cas client,
  « il » désigne Jason.
- **Règles ≠ données** : *il garde vos règles, pas vos données*. Ne jamais écrire qu'il « apprend de vos documents ».
- **Pas de promesse d'impossibilité** : la garantie tient à la validation humaine (« votre oui »), pas au modèle.
- Pro-activité seulement adossée à un mécanisme réel (heure fixe, seuil).
- Un argument, un seul endroit. Exception : « accès limités au strict nécessaire », énoncé dans le bandeau et
  argumenté dans Confiance.
- Titre et description par défaut (`site.ts`) = ceux de l'accueil.
- **Vérifier après toute retouche** : `grep -rniE "\b(nous|notre|nos|on )\b" src shared` et
  `grep -rnwiE "IA|agent|connecteurs?|automatis[a-zéè]*|API|MCP|données|outils?|workflow|PME|solution" src shared` ;
  chaque occurrence restante est un commentaire, une réplique de personnage, « Sous le capot » ou une exception
  ci-dessus. Puis `scrollWidth` si un libellé s'est allongé (piège 7).

## Décisions
- **Îlots en `client:idle`**, jamais `client:load` ni `client:visible` au-dessus de la ligne de flottaison : le
  runtime React (~67 ko gzip) partait tôt et portait le LCP mobile de 1,5 à 2,1 s. Le HTML serveur de chaque îlot
  est déjà utilisable. Remesurer avant tout changement.
- **Scripts de composants en fichiers externes** (`assetsInlineLimit` dans `astro.config.mjs`) : inlinés, ils
  faisaient dépasser au HTML de l'accueil la première fenêtre TCP (~14 ko) et coûtaient ~0,5 s de LCP.
- **Budget JS : 150 ko gzip sur l'accueil**, objectif LCP < 1,8 s et CLS 0. Toute dépendance ajoutée fait < 10 ko
  gzip. À fonctionnalité égale : composant statique > JS natif > bibliothèque > îlot.
- **Visuels : schémas SVG, pas d'images** (voir « Schémas »).
- **Bouton flottant mobile toujours visible**, pas seulement après défilement.
- **Aucune requête tierce** : la CSP (`script-src 'self'`) bloque tout script d'un autre domaine, c'est voulu.

## Exceptions connues aux valeurs en dur
Tolérées, à ne pas étendre :
- `letter-spacing` des titres, eyebrows et `tracking-tight` ; anneau de focus 2px.
- Proportions de grille (`grid-cols-[2fr_1fr_1fr_1fr]` footer, `lg:grid-cols-[1fr_2fr]` FAQ,
  `lg:grid-cols-[2fr_3fr]` et `sm:grid-cols-[1fr_auto_1fr]` Clients, `lg:grid-cols-[1fr_24rem]` Offre) ;
  largeurs de l'échelle Tailwind (`max-w-xs` footer, `max-w-4xl` hero).
- `public/favicon.svg` (`#F59E0B`) ; point de rupture `768px` de `tokens.css` (aligné sur `md:`).
- Terminal : curseur en unités de police, lignes vides en `min-h-[1lh]`.
- Formulaires : champ piège en `-left-[9999px]`, `mt-0.5` de la case de consentement, colonne des `dl` de `prose-site`.
- `dot-pattern` : points de 1px et masque radial.
- Filet du témoignage `w-1` ; logo `h-10`, largeur tirée du `viewBox`.
- Maquettes (`RotationEcrans`, `ProtocoleBoutEnBout`, `EnchainementClient`) : tailles en `cqw`, **filets en `px`**
  (un trait en `cqw` disparaît aux petites largeurs), durées et seuils `IntersectionObserver` dans leur script ou
  leur `<style>`. Couleurs : que des tokens.
- Révélations (Méthode, `CompareBars`) : pas de 260 ms, seuil 0,25.
- Icônes : tracés SVG statiques en `set:html`, jamais sur du contenu éditable.

## Pièges
1. **`@theme inline reference`** dans `global.css` : les tokens portent les noms des variables de Tailwind ; sans
   `reference`, Tailwind les réémet en auto-référence. Ne pas retirer `reference`.
2. **Classe inexistante = silence** : une classe hors tokens (`text-sm`, `rounded-xl`) ne génère rien. Si un style
   « ne s'applique pas », vérifier d'abord que la classe correspond à un token.
3. **Surcharger une propriété déjà posée par un composant ne marche pas** (`hidden` sur un `Button` en
   `inline-flex`, fond d'une `Card`) : seul l'ordre du CSS généré compte. → Conteneur
   (`<div class="hidden md:block">`), prop du composant, ou élément écrit à la main.
4. **Bouton dépendant du thème** : le serveur ne connaît pas le thème. Rendre les deux icônes avec
   `dark:hidden` / `dark:block`. Plusieurs `ThemeToggle` observent `data-theme` (`MutationObserver`), pas un état local.
5. **Rechercher une classe dans le CSS construit** : caractères échappés (`.py-\(--section-y\)`).
6. **Îlots vides en dev, `jsxDEV is not a function`** : cache Vite périmé → `npm run dev -- --force`. Regarder la
   console avant de chercher un bug dans le composant.
7. **Libellé `whitespace-nowrap` plus long que sa colonne** : il déborde sans rien signaler et fait défiler toute la
   page. Après tout ajout ou allongement de libellé (ou changement de police), vérifier
   `document.documentElement.scrollWidth` à 360, 640, 1024 et 1280 px.
8. **Captures headless** : une ancre (`/#section`) donne une capture vide → capturer la page entière et découper. Un
   état transitoire n'est jamais photographié à l'instant voulu → figer :
   `document.getAnimations().forEach(a => { a.pause(); a.currentTime = T })`.
9. **`rm -rf` est refusé** (`.claude/settings.json`), même dans le scratchpad : la commande entière est rejetée.
10. **Le serveur inventorie `dist/` au démarrage** (routes sans slash, empreintes CSP) : après un build, redémarrer
    `npm start`. Ne jamais réécrire `/`.
11. **Données réelles d'un outil connecté (CRM Extrabat…)** : ne jamais les interroger pour alimenter une page
    publique, même en lecture seule — les clients finaux n'ont rien accepté. Seuls l'identité et les chiffres
    fournis par le client dans son formulaire sont utilisables ; toute démonstration est inventée et légendée.
12. **Animation qui ne tourne « que sur mobile »** : une pause au survol fige l'animation dès que la souris passe
    dessus. → Pause par bouton seulement. Autre cause : le poste de test a les animations coupées (GNOME :
    `gsettings get org.gnome.desktop.a11y.interface reduced-motion`) — vérifier avant de chercher un bug.
13. **Commit de version qui monte des dépendances** : `v0.3` et `v0.6` ont planté au démarrage (`@fastify/static` 10).
    → Un commit de version ne touche que `version` (jamais `npm install`) ; les montées de dépendances ont leur
    branche `chore/`, avec `npm ci && npm run build && npm start` et un parcours des pages.
14. **Texte SVG dans un schéma qui s'étire** : un `<text>` suit l'échelle du `viewBox` (~8 px à 360 px). → Libellés
    en HTML au-dessus du SVG.
15. **Tracés qui passent derrière des blocs opaques** ou se pincent : dans une zone étirée, tracé orthogonal placé à
    côté des blocs, chaque tracé finit dans un bloc ou par une pointe.
16. **`import.meta.url` dans le frontmatter d'un `.astro`** vise `dist/` au build : `existsSync` répond `false` sans
    erreur. → Résoudre depuis `process.cwd()` et vérifier dans `dist/`.
17. **Un bloc `section-invert` posé dans une section invert disparaît** (même fond). → L'encadrer dans une carte
    `bg-surface`, ou ne pas lui mettre `section-invert`.
18. **Animation `fill: both` dont la dernière image est l'état éteint** : elle écrase pour toujours la règle d'état
    (`.choisi { color: … }`). → L'élément qui doit rester allumé a son propre déroulé, qui finit allumé.
19. **Enfant `absolute` d'un conteneur `flex`** : il se pose au début de la ligne. → Empiler deux états dans une
    grille d'une case (`inline-grid` + `grid-area: 1 / 1`).
20. **Un SMTP figé ne renvoie aucune erreur** : la requête reste pendante. → Délais explicites sur le transport
    (`server/index.mjs`). En local : `printf 'QUIT\r\n' | nc 127.0.0.1 1025` (pas de « 220 » = redémarrer Mailpit).
21. **CLS de chargement en local** : un serveur local instantané fait apparaître des décalages qui n'existent pas en
    réseau réel (et retirer un préchargement peut les révéler). → Mesurer plusieurs passages dont un bridé (150 ms,
    1,6 Mb/s) et comparer au commit précédent avant de conclure.
22. **Animer `left` / `top` est un décalage de mise en page** (CLS 0,029 sur la planche du protocole). → `translate`,
    et mesurer avec `PerformanceObserver` (`layout-shift`, `entry.sources`).
23. **La police de secours n'a pas les largeurs d'Inter** : un bloc centré à largeur en `ch` bouge à l'arrivée de la
    police (CLS 0,005–0,012 sur `/questionnaire`, en réseau bridé seulement ; non corrigé, décision de l'humain).
    → Un bloc centré qui doit rester immobile ne prend pas de largeur en `ch`. Tester en bloquant les `.woff2`.

## Anti-patterns
- Dégradés multicolores, emojis dans l'interface, WebGL, `backdrop-filter` sur mobile.
- Imagerie IA stock, bitmap ou image de banque là où un schéma SVG suffit.
- Bibliothèque JS pour un effet faisable en statique ou en quelques lignes de JS natif.
- Faux témoignages, faux logos clients, chiffres inventés présentés comme réels.
- `transition-all`, animation sans `motion-safe:` ou sans token de durée.
- Texte `--accent` sur `--accent-soft`.
