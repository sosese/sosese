# Cahier des charges — sosese.tech

Site vitrine du studio IA **sosese**. Document de référence pour la session de développement (**Claude Code**, en local uniquement — voir §7.0).
Version 1.2 — workflow de développement et de déploiement durci (§7). Le VPS hébergeant d'autres services en production, l'isolation du projet est une contrainte de premier ordre. Périmètre V1 volontairement resserré : vitrine + formulaire de contact par email.

---

## 1. Contexte et objectifs

### 1.1 Offre à valoriser
Accompagnement de bout en bout :
1. **Identification des opportunités** — ateliers sur site, cartographie des processus, diagnostic de maturité.
2. **Priorisation** — feuille de route chiffrée (gain de temps / coût / faisabilité).
3. **Conception sur-mesure** — automatisations et solutions IA intégrées au SI existant.

### 1.2 Objectifs du site
| Objectif | Indicateur |
|---|---|
| Générer des demandes de contact qualifiées | ≥ 2 % visiteur → formulaire envoyé |
| Crédibiliser une structure jeune | Preuves concrètes visibles < 10 s |
| Rendre une offre abstraite tangible | Exemples d'automatisations concrets, zéro jargon |
| Servir de support commercial | Présentable sur écran en rendez-vous |

### 1.3 Hors périmètre V1
Cas clients réels, témoignages, blog/ressources, prise de RDV en ligne, base de données, espace client, multilingue, analytics. → V2.

---

## 2. Cibles

**Persona principal — Dirigeant de PME (15–150 salariés)**
Non technique, pragmatique, saturé de démarchage « IA ». Craint le gadget, le coût caché, la dépendance au prestataire, la fuite de ses données. Cherche du temps gagné et des erreurs en moins.

**Persona secondaire — Responsable opérationnel / DAF / RH**
Prescripteur interne. Veut des exemples proches de son quotidien : devis, factures, SAV, reporting, recrutement.

**Persona tertiaire — Responsable informatique du client**
Vérifie la crédibilité technique. C'est lui que rassure la touche geek.

### 2.1 Règle éditoriale centrale
> **Le geek est dans le visuel, jamais dans le vocabulaire.**
> On écrit « vos devis rédigés en 2 minutes au lieu de 40 », pas « orchestration d'agents LLM en architecture RAG ».
> Le lexique technique est confiné à la section « Sous le capot » et aux micro-labels en monospace.

---

## 3. Direction artistique

### 3.1 Parti pris
**Clair par défaut, dark mode commutable.** Le thème clair porte la confiance et la lisibilité ; le thème sombre est un signal de modernité pour les visiteurs techniques et un confort réel de lecture.

Deux à trois **sections « invert »** restent sombres dans les deux thèmes (démo terminal, « Sous le capot », CTA final) : elles structurent le rythme vertical de la page.

- Préférence système au premier chargement, puis choix mémorisé (`localStorage`).
- Script anti-flash inline dans le `<head>`, avant tout rendu.
- Le bouton de bascule vit dans le header, icône seule, `aria-label` explicite.

### 3.2 Attributs visuels
- Grille stricte, bordures 1 px peu contrastées, beaucoup de respiration.
- Une seule couleur d'accent, utilisée avec parcimonie : CTA, chiffres clés, états actifs.
- Trame de points ou grille technique masquée en radial, uniquement sur les sections invert.
- Micro-interactions au survol systématiques : cartes, boutons, lignes. Sensation d'application, pas de page.
- Aucune illustration stock, aucune imagerie IA générique (cerveau, robot, réseau de neurones).
- Animations courtes (150–300 ms), fonctionnelles, désactivées si `prefers-reduced-motion`.

### 3.3 Design tokens

Palette ambre chaude, base neutre légèrement chaude pour éviter le gris hôpital.

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

/* Sections invert : sombres dans les deux thèmes */
.section-invert {
  --bg: #0F0D0B; --bg-subtle: #17130F; --surface: #1C1713;
  --ink: #F5F1EC; --ink-muted: #A19788;
  --border: rgba(255,255,255,0.09);
  --accent: #F59E0B; --on-accent: #14110E;
}
```

**Règle de contraste non négociable** : `--accent-bright` (#F59E0B) ne sert jamais de couleur de texte sur fond clair. Sur fond clair, tout texte ou icône accentué utilise `--accent` (#B45309).

### 3.4 Typographie
| Usage | Police |
|---|---|
| Titres et corps | **Inter** variable |
| Labels, chiffres, terminal, code | **JetBrains Mono** |

Échelle : 12 / 14 / 16 / 18 / 21 / 28 / 36 / 48 / 64. Corps 17–18 px, interlignage 1.6, 65–75 caractères par ligne. Pas de capitales au-delà des eyebrow labels.
Polices auto-hébergées en `.woff2` (RGPD + performance), jamais Google Fonts. `font-display: swap`, préchargement des deux graisses utilisées.

### 3.5 Identité
Nom en minuscules : **sosese**. Wordmark typographique en Inter, aucune icône imposée. Piste si logogramme souhaité : un point ambre en fin de mot (`sosese.`) — exploitable en favicon.

---

## 4. Arborescence V1

```
/                   Accueil (page longue, ancres vers les sections)
/a-propos           Le studio, la posture, la personne
/contact            Formulaire + coordonnées
/mentions-legales
/confidentialite
```

La méthode et l'offre sont des **sections de l'accueil**, pas des pages dédiées : à ce stade le volume de contenu ne justifie pas l'éclatement.

Navigation : Méthode · Offre · À propos · [toggle thème] · **[Parlons-en]** (bouton accent).
Mobile : menu plein écran, CTA persistant en bas d'écran après le premier scroll.

---

## 5. Spécification de l'accueil

| # | Section | Rôle | Contenu / composant |
|---|---|---|---|
| 1 | **Hero** | Comprendre en 5 s | Titre orienté résultat (ex. « Vos tâches répétitives, automatisées. Sans changer vos outils. »), sous-titre 2 lignes, CTA primaire *Parlons-en* + secondaire *Voir la méthode*. À droite : **terminal animé** (§5.1) |
| 2 | **Bandeau engagements** | Rassurer | 3–4 énoncés courts en monospace. Faute de chiffres clients : engagements vérifiables (« premier atelier sous 15 jours », « livrable en 4 semaines », « votre code vous appartient », « données hébergées en UE ») |
| 3 | **Le problème** | Miroir | 3 cartes : saisie en double, informations éparpillées, process qui ne tiennent qu'à une personne |
| 4 | **La méthode** | Structurer | Timeline horizontale 3 étapes (Atelier → Feuille de route → Construction). Par étape : durée, livrable, temps demandé au client |
| 5 | **L'offre — Bento grid** | Détailler | 1×1 Audit & diagnostic · 1×1 Ateliers & acculturation · 2×2 Solutions sur-mesure avec mini-schéma de flux animé |
| 6 | **Exemples d'automatisations** | Projeter | 4–6 cartes courtes, **illustratives et explicitement présentées comme telles** : devis à partir d'un email entrant, tri et relance de factures, réponse de premier niveau au SAV, compte-rendu automatique de réunion, synthèse hebdomadaire d'activité. Chaque carte : avant / après + ordre de grandeur du gain |
| 7 | **Sous le capot** (invert) | Crédibiliser | Grille de technos en monospace, schéma d'intégration au SI existant. Seul endroit où le jargon est autorisé |
| 8 | **Confiance & données** | Lever les freins | 4 engagements : hébergement UE, aucun entraînement sur vos données, code et accès qui vous appartiennent, réversibilité. **Section critique sur cette cible** |
| 9 | **FAQ** | Objections + SEO | 6–8 questions : combien ça coûte, combien de temps, faut-il changer nos logiciels, nos données sortent-elles, et si ça ne marche pas, qui maintient ensuite |
| 10 | **CTA final** (invert) | Convertir | Reprise de la proposition + lien vers `/contact` |
| — | Footer | | Navigation, mentions, email, LinkedIn, « conçu et hébergé en France » |

Section 6 : formulations génériques tant qu'aucun cas client n'est publiable. Aucun faux témoignage, aucun logo client fictif, aucun chiffre inventé.

### 5.1 Composant Hero — terminal animé
Séquence typée en boucle, ~12 s, **en français et en langage métier** :

```
$ atelier --client "PME industrie" --duree 2j
→ 14 processus cartographiés
→ 6 candidats à l'automatisation
→ 2 quick wins identifiés

$ build devis-auto
✓ lecture des demandes entrantes
✓ génération du devis depuis votre catalogue
✓ envoi pour validation
→ 38 min économisées par devis
```

Exigences : pause au survol, affichage direct de l'état final si `prefers-reduced-motion`, texte réel dans le DOM, hauteur fixe (zéro CLS), arrêt de la boucle hors viewport (`IntersectionObserver`).

### 5.2 Formulaire de contact — V1
**Une seule étape, un seul écran.** Pas de tunnel multi-étapes en V1.

Champs : nom · société · email · téléphone (optionnel) · secteur (select) · « Où perdez-vous le plus de temps ? » (puces multi-sélection, visuellement dynamiques, valeurs concaténées) · message libre · case de consentement RGPD non pré-cochée.

Comportement : validation côté client puis `POST /api/contact`, états `idle / sending / success / error` explicites, l'adresse email de repli est affichée en cas d'échec. Anti-spam : honeypot + délai minimum de remplissage (3 s) + rate limit IP côté serveur. Pas de captcha.

---

## 6. Stack technique

### 6.1 Choix retenu
| Brique | Techno | Raison |
|---|---|---|
| Framework | **Astro 5** | Sortie statique, zéro complexité serveur, îlots React natifs |
| UI interactive | **React 19** en îlots `client:visible` | Permet d'utiliser tel quel tout composant shadcn / Magic UI / Aceternity |
| Styles | **Tailwind CSS v4** | Tokens CSS natifs, config minimale, bascule de thème par `data-theme` |
| Primitives | **shadcn/ui** (Radix) | Accessibilité et gestion du focus gratuites |
| Animations | **Motion** | Uniquement dans les îlots |
| Composants d'effet | Magic UI / Aceternity, **code copié** dans `src/components/ui` | Aucune dépendance externe à suivre |
| Contenu | Astro Content Collections (Markdown) | FAQ et exemples éditables sans toucher au code |
| Emails | **Nodemailer** + SMTP | Une seule route serveur |

Pas de base de données, pas d'analytics, pas de Cal.com en V1.

### 6.2 Architecture d'exécution
**Un seul conteneur Docker.** Un service Node (Fastify) sert les fichiers statiques construits par Astro et expose l'unique route `POST /api/contact`.

Justification : le VPS tourne déjà sous Docker + Traefik. Un conteneur unique évite un second routeur Traefik, un second Dockerfile et une configuration Nginx supplémentaire, pour un site dont la seule dynamique est un envoi d'email. Le service redémarre seul en cas d'incident (`restart: unless-stopped`).

*Alternative si l'on veut isoler l'API : deux conteneurs (image statique + API) avec un routeur Traefik par chemin. Non retenue en V1 — surcoût d'exploitation sans bénéfice à ce volume.*

### 6.3 Arborescence projet
```
/src
  /components
    /ui          primitives shadcn + composants copiés (BorderBeam, Terminal, DotPattern…)
    /sections    Hero, Probleme, Methode, BentoOffre, Exemples, SousLeCapot, Confiance, Faq, CtaFinal
    /islands     TerminalDemo, ThemeToggle, ContactForm, MobileNav
  /content
    /faq         *.md
    /exemples    *.md
  /layouts/Base.astro
  /pages
  /styles/tokens.css
/server/index.mjs      Fastify : static + POST /api/contact
/public/fonts
DESIGN.md
Dockerfile
compose.yml
.env.example
```

### 6.4 Serveur — périmètre exact
`server/index.mjs`, ~80 lignes :
- `@fastify/static` sur `dist/`, fallback `404.html`.
- `POST /api/contact` : validation zod, honeypot, `@fastify/rate-limit` (5 requêtes / 10 min / IP), envoi Nodemailer, réponse JSON.
- `GET /api/health` → `{ ok: true }`.
- En-têtes de sécurité via `@fastify/helmet`, CSP restrictive.
- Aucune persistance. Le seul stockage des leads est votre boîte mail.

Variables d'environnement : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`, `MAIL_FROM`. Jamais commitées.

---

## 7. Workflow de travail et déploiement

### 7.0 Modèle de travail — règle fondatrice

Le VPS héberge déjà des services en production qui ne font pas partie de ce projet.
**Aucun agent, aucune session de code n'a d'accès au VPS.** Le développement est intégralement local ; le VPS ne reçoit que des images déjà construites et testées.

| Environnement | Acteur | Périmètre |
|---|---|---|
| Poste local | Claude Code | Code, build, tests, `compose.yml`, CI, documentation |
| GitHub (repo privé) | — | Source de vérité + registre d'images (GHCR) |
| VPS Ubuntu | **l'humain, manuellement** | `docker compose pull && docker compose up -d` dans `/srv/sosese` |

Corollaires :
- Le site est intégralement reconstructible depuis Git. Aucune donnée n'existe sur le VPS hormis `/srv/sosese/.env` et `/srv/sosese/compose.yml`.
- Tout diagnostic de production se fait en collant la sortie de commande dans la session de code, jamais en donnant la main.
- Le build ne s'exécute jamais sur le VPS (voir §7.3).

### 7.1 Garde-fous — `.claude/settings.json`

À créer au Lot 0, avant toute autre chose. Empêche la session de sortir du périmètre local.

```json
{
  "permissions": {
    "deny": [
      "Bash(ssh:*)",
      "Bash(scp:*)",
      "Bash(rsync:*)",
      "Bash(docker system prune:*)",
      "Bash(docker volume rm:*)",
      "Bash(docker network rm:*)",
      "Bash(docker stop:*)",
      "Bash(docker rm:*)",
      "Bash(rm -rf:*)",
      "Bash(git push --force:*)",
      "Read(./.env)",
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)"
    ],
    "allow": [
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)"
    ]
  }
}
```

`.env` n'est jamais lu ni écrit par la session : seul `.env.example` existe dans le repo. Le vrai `.env` est créé à la main sur le VPS, `chmod 600`, propriétaire non-root.

### 7.2 Hygiène du repo

```
.gitignore     → .env, node_modules, dist, .astro, *.local
.env.example   → toutes les clés, aucune valeur
CLAUDE.md      → pointe vers DESIGN.md + rappelle les règles du §7.0
```

Branches : `main` protégée et déployable en permanence, travail sur `feat/lot-N`, merge après validation visuelle. Un tag `v0.x` par mise en production — c'est l'unité de rollback.

### 7.3 Build : en CI, jamais sur le VPS

Le multi-stage Node consomme 1 à 2 Go de RAM en pic. Exécuté sur le VPS, il entre en concurrence avec les services de production et expose à un arbitrage de l'OOM-killer. Le build est donc délégué à GitHub Actions, qui publie l'image sur GHCR.

**Dockerfile — multi-stage**
Étape 1 `node:22-alpine` : `npm ci && npm run build`.
Étape 2 `node:22-alpine` : `npm ci --omit=dev`, copie de `dist/` et `server/`, `USER node`, `CMD node server/index.mjs`.

`HEALTHCHECK` sans dépendance externe (ni `curl` ni `wget` dans l'image finale) :
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
```

**`.github/workflows/deploy.yml`** — build + push sur tag :
```yaml
on:
  push:
    tags: ['v*']
jobs:
  build:
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ghcr.io/<user>/sosese:${{ github.ref_name }}
            ghcr.io/<user>/sosese:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

Aucun secret de déploiement dans GitHub : le workflow ne touche pas au VPS.

### 7.4 `compose.yml`

```yaml
name: sosese          # ← isole le projet quel que soit le dossier d'exécution

services:
  web:
    image: ghcr.io/<user>/sosese:latest
    container_name: sosese-web
    restart: unless-stopped
    env_file: .env
    networks: [traefik]
    read_only: true
    tmpfs: [/tmp]
    security_opt: ["no-new-privileges:true"]
    mem_limit: 256m
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=<reseau-traefik-existant>"
      - "traefik.http.routers.sosese.rule=Host(`sosese.tech`) || Host(`www.sosese.tech`)"
      - "traefik.http.routers.sosese.entrypoints=websecure"
      - "traefik.http.routers.sosese.tls.certresolver=<votre-resolver>"
      - "traefik.http.services.sosese.loadbalancer.server.port=3000"
      - "traefik.http.middlewares.sosese-www.redirectregex.regex=^https://www\\.sosese\\.tech/(.*)"
      - "traefik.http.middlewares.sosese-www.redirectregex.replacement=https://sosese.tech/$${1}"
      - "traefik.http.middlewares.sosese-www.redirectregex.permanent=true"
      - "traefik.http.routers.sosese.middlewares=sosese-www"

networks:
  traefik:
    external: true
    name: <reseau-traefik-existant>
```

`name: sosese` en tête de fichier : Compose n'utilise plus le nom du dossier courant, une commande lancée depuis le mauvais répertoire ne peut pas atteindre un autre projet.
`mem_limit` : borne le conteneur, l'empêche de menacer les services voisins.
`read_only` : le service n'écrit rien sur disque, aucune raison de lui laisser un filesystem inscriptible.

**Un `compose.dev.yml` distinct** pour le local : `build: .`, `ports: ["3000:3000"]`, pas de réseau Traefik, pas de labels. Les deux fichiers ne se croisent jamais.

### 7.5 Pré-vol — à vérifier avant la première mise en production

Commandes de lecture seule, à exécuter sur le VPS et à reporter dans la session :

```bash
docker network ls                                    # nom exact du réseau Traefik
docker inspect traefik | grep -i certresolver        # nom du certresolver
docker ps --format '{{.Names}}'                      # collision de container_name ?
docker compose ls                                    # collision de nom de projet ?
grep -rn "sosese" /chemin/vers/traefik/              # collision de routeur/middleware
df -h && free -m                                     # marge disque et RAM
```

Un routeur ou middleware Traefik homonyme d'un existant est silencieusement écrasé : la vérification n'est pas optionnelle.

### 7.6 Cycle de déploiement

Sur le VPS, dans `/srv/sosese` uniquement :

```bash
cd /srv/sosese
docker compose pull
docker compose up -d
docker compose logs -f web      # Ctrl-C une fois le health check vert
```

Rollback :
```bash
# éditer image: ghcr.io/<user>/sosese:v0.3 dans compose.yml
docker compose up -d
```
L'image précédente est encore dans le cache local : le retour arrière prend quelques secondes et ne dépend ni du réseau ni d'un build.

**Interdits permanents sur ce VPS** — ces commandes touchent tous les projets, pas seulement celui-ci :
```
docker system prune -a
docker volume prune
docker stop $(docker ps -q)
docker compose down        # hors de /srv/sosese
```

Snapshot du VPS (ou export de la config Traefik + liste des volumes) avant le premier `up`.

### 7.7 DNS

`sosese.tech` et `www.sosese.tech` → A/AAAA vers le VPS. Vérifier qu'aucun enregistrement n'entre en conflit avec les sous-domaines de services déjà exposés. Créer les enregistrements **après** le pré-vol §7.5 : un certresolver qui échoue en boucle sur un domaine mal pointé peut faire atteindre le rate limit Let's Encrypt, qui s'applique à l'ensemble du VPS.

### 7.8 Performance du service

Traefik gère TLS, HTTP/2 et la redirection HTTP→HTTPS. Compression `gzip`/`brotli` activée au niveau Traefik **ou** Fastify (`@fastify/compress`), jamais les deux.
Cache : assets hashés `immutable, max-age=31536000`, HTML `no-cache`.

---

## 8. Performance, accessibilité, SEO

### 8.1 Budgets
| Métrique | Cible |
|---|---|
| Lighthouse Performance (mobile) | ≥ 95 |
| LCP | < 1,8 s en 4G simulée |
| CLS | < 0,05 |
| INP | < 200 ms |
| JS exécuté sur l'accueil | < 100 ko gzip |
| Poids total de l'accueil | < 500 ko |

Images en AVIF/WebP via `astro:assets`, dimensions toujours déclarées, aucune image lazy au-dessus de la ligne de flottaison, pas de WebGL, `backdrop-filter` proscrit sur mobile.

### 8.2 Accessibilité — WCAG 2.2 AA
Contraste ≥ 4.5:1 **dans les deux thèmes** (à vérifier explicitement au moment de la bascule), navigation clavier complète, focus visible jamais supprimé, lien d'évitement, hiérarchie de titres cohérente, `aria-live` sur les états du formulaire, `prefers-reduced-motion` respecté partout.

### 8.3 SEO
Français uniquement. Une intention par page, `title` ≤ 60 caractères orienté bénéfice. Données structurées `ProfessionalService` et `FAQPage`. `sitemap.xml` et `robots.txt` générés au build. Image OG statique par page. Zone d'intervention mentionnée en clair, fiche Google Business Profile liée le cas échéant.

### 8.4 Conformité
Mentions légales (SIRET, hébergeur), politique de confidentialité (finalité, base légale, durée de conservation, droits, sous-traitant SMTP), consentement explicite non pré-coché. Aucun cookie, aucun script tiers → **pas de bandeau de consentement**.

---

## 9. Contenus à produire

| Élément | Bloquant pour |
|---|---|
| Logo / wordmark, favicon | Header, OG |
| Titre et sous-titre du hero | Section 1 |
| Formulation des 4 engagements | Sections 2 et 8 |
| 4 à 6 exemples d'automatisations | Section 6 |
| Photo et bio | `/a-propos` |
| Contenu FAQ | Section 9 |
| SIRET, hébergeur, adresse | Mise en ligne |
| Identifiants SMTP | `/contact` |

---

## 10. Lotissement

**Lot 0 — Fondations**
`.gitignore`, `.env.example`, `.claude/settings.json` (§7.1), `CLAUDE.md`, repo Git initialisé et poussé sur GitHub privé — **en premier, avant toute ligne de code**.
Puis `DESIGN.md`, `tokens.css` bi-thème, polices auto-hébergées, `ThemeToggle` + script anti-flash, layout, header, footer, primitives Button / Card / Badge. **Aucune section ne démarre avant validation visuelle de ce lot, dans les deux thèmes.**

**Lot 1 — Accueil**
Sections 1 à 5, puis 6 à 10.

**Lot 2 — Pages internes**
`/a-propos`, `/contact`, mentions légales, confidentialité, 404.

**Lot 3 — Backend**
`server/index.mjs`, Dockerfile multi-stage, `compose.dev.yml`, test d'envoi réel depuis le conteneur local.

**Lot 4 — Chaîne de livraison**
`.github/workflows/deploy.yml`, premier tag `v0.1`, image publiée sur GHCR et **vérifiée en local** (`docker run` sur l'image tirée du registre). Rien n'est encore poussé sur le VPS.

**Lot 5 — Mise en production**
Pré-vol §7.5 → `compose.yml` de production renseigné avec les noms réels → DNS → `/srv/sosese/.env` créé à la main → premier `up`. Puis passe Lighthouse + axe, relecture mobile réelle.

**V2** : cas client réel et page dédiée, témoignages, prise de RDV (Cal.com), analytics sans cookie (Umami), ressources/SEO sectoriel, calculateur de gain de temps.

---

## 11. Critères d'acceptation
- [ ] Budgets §8.1 atteints sur l'accueil
- [ ] Zéro erreur axe DevTools, **dans les deux thèmes**
- [ ] Aucun flash de thème au chargement, quel que soit le thème mémorisé
- [ ] Parcours complet réalisable au clavier seul
- [ ] Rendu conforme sur Safari iOS, Chrome Android, Firefox, Safari macOS
- [ ] Le formulaire arrive bien en boîte mail, et affiche une erreur explicite si le SMTP tombe
- [ ] Aucune requête vers un domaine tiers
- [ ] Une question de FAQ s'ajoute en créant un seul fichier Markdown
- [ ] Aucune couleur, rayon ou espacement codé en dur hors `tokens.css`
- [ ] `.env` absent du repo et de l'historique Git
- [ ] `docker compose config` sur le VPS ne révèle aucune collision de nom, réseau ou routeur
- [ ] Les services préexistants du VPS répondent toujours après le déploiement (vérifié explicitement, un par un)
- [ ] Un rollback vers le tag précédent a été testé au moins une fois

---

## Annexe A — `DESIGN.md` à placer à la racine du repo

```markdown
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
[coller le bloc CSS du §3.3]

## Typographie
Inter (titres, corps) / JetBrains Mono (labels, chiffres, terminal).
Échelle : 12 14 16 18 21 28 36 48 64. Corps 17px, line-height 1.6.

## Espacement
Multiples de 4. Rythme vertical des sections : 96px desktop / 64px mobile.

## Composants disponibles
Button, Card, Badge, BentoGrid, BentoCard, Terminal, BorderBeam, DotPattern, Tabs, Accordion, ThemeToggle.
Toujours réutiliser avant de créer.

## Anti-patterns
- Dégradés multicolores
- Imagerie IA stock (cerveaux, robots, réseaux de neurones)
- Emojis dans l'interface
- Plus de 2 niveaux de titre par section
- WebGL, backdrop-filter sur mobile
- Faux témoignages, faux logos clients, chiffres inventés
```

## Annexe B — Prompt d'amorçage de la session de code

> Contexte : cahier des charges joint, projet **sosese** (sosese.tech). On démarre le **Lot 0**, rien d'autre.
> **Contrainte de sécurité, lis le §7.0 avant tout : tu travailles exclusivement en local. Tu n'as, et n'auras à aucun moment, d'accès au VPS. Aucune commande `ssh`, `scp` ou `docker` visant une machine distante. Le déploiement est fait à la main par moi.**
> Commence par créer `.gitignore`, `.env.example`, `.claude/settings.json` (contenu du §7.1) et `CLAUDE.md`, puis initialise le dépôt Git.
> Ensuite seulement : initialise un projet Astro 5 + Tailwind 4 + React. Crée `src/styles/tokens.css` avec les tokens bi-thème du §3.3, auto-héberge Inter et JetBrains Mono, implémente la bascule de thème (préférence système, mémorisation, script anti-flash inline), crée `DESIGN.md` à partir de l'annexe A, puis livre le layout de base avec header, footer et les composants Button / Card / Badge.
> Montre-moi le rendu dans les deux thèmes. Ne code aucune section de l'accueil tant que je n'ai pas validé.
