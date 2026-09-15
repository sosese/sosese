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
`rounded-md`, `shadow-md`, `text-14`, `font-mono`…). La palette, les rayons, les ombres et les tailles
par défaut de Tailwind sont désactivés : une classe comme `bg-red-500` ou `text-sm` ne produit rien.

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

Tokens complémentaires dans `tokens.css` : échelle typographique (`--text-12` … `--text-64`, `--text-body`),
`--leading-body`, `--measure`, `--space-unit`, `--section-y`, `--gutter`, `--container`, `--header-h`,
`--duration-fast/base/slow` (ramenées à 0 si `prefers-reduced-motion`), `--ease-out`.

## Thème
- `data-theme="light" | "dark"` sur `<html>`, posé par le script inline en tête de `<head>` (`Base.astro`)
  avant tout rendu : choix mémorisé (`localStorage.theme`), sinon préférence système.
- Sans choix mémorisé, un changement de préférence système est suivi en direct.
- Variante Tailwind `dark:` branchée sur `data-theme`, à réserver aux cas où un token ne suffit pas
  (ex. icône soleil / lune).

## Typographie
Inter (titres, corps) / JetBrains Mono (labels, chiffres, terminal).
Échelle : 12 14 16 18 21 28 36 48 64. Corps 17px, line-height 1.6.
Polices variables auto-hébergées dans `public/fonts` (sous-ensemble latin), préchargées, `font-display: swap`.
Capitales réservées aux eyebrow labels (utilitaire `eyebrow`).

## Espacement
Multiples de 4 (échelle Tailwind, `--spacing` = `--space-unit` = 4px).
Rythme vertical des sections : 96px desktop / 64px mobile → `py-(--section-y)`.
Conteneur : utilitaire `container-site` (`--container` + `--gutter`).

## Composants disponibles
| Composant | Fichier | Type |
|---|---|---|
| Button | `src/components/ui/Button.astro` | statique — `variant` primary/secondary/ghost, `size` sm/md/lg, `href` → `<a>` |
| Card | `src/components/ui/Card.astro` | statique — `interactive`, `padding` md/lg, `href` → `<a>` |
| Badge | `src/components/ui/Badge.astro` | statique — `variant` neutral/accent, `dot` |
| Header / Footer | `src/components/layout/` | statique |
| ThemeToggle | `src/components/islands/ThemeToggle.tsx` | îlot React |
| MobileNav | `src/components/islands/MobileNav.tsx` | îlot React (`<dialog>` modal) |

Prévus aux lots suivants : BentoGrid, BentoCard, Terminal, BorderBeam, DotPattern, Tabs, Accordion.
Toujours réutiliser avant de créer.

## Anti-patterns
- Dégradés multicolores
- Imagerie IA stock (cerveaux, robots, réseaux de neurones)
- Emojis dans l'interface
- Plus de 2 niveaux de titre par section
- WebGL, backdrop-filter sur mobile
- Faux témoignages, faux logos clients, chiffres inventés
