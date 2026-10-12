# RUNBOOK — sosese.tech

Architecture, publication, déploiement, diagnostic. Le front (design, composants, copy) est dans `DESIGN.md`.

**Règle fondatrice** : le développement se fait en local. Claude Code n'a jamais accès au VPS (`ssh`, `scp`, `rsync`
bloqués dans `.claude/settings.json`). Les sections 2 à 7 sont exécutées **par l'humain**.

## Architecture

```
Astro (statique) ── npm run build ──► dist/
                                        │
server/index.mjs (Fastify) ── sert dist/ + POST /api/contact, /api/questionnaire ──► SMTP (Hostinger)
                                        │
Dockerfile ──► image ghcr.io/sosese/sosese:vX.Y (GitHub Actions, sur tag)
                                        │
VPS : /srv/sosese/compose.yml ──► conteneur sosese-web ◄── Traefik (TLS, routage) ◄── Internet
```

| Élément | Détail |
|---|---|
| Front | Astro 5 en sortie statique, Tailwind 4, îlots React 19. Contenus : `src/`, règles des formulaires : `shared/*.json` |
| Serveur | `server/index.mjs` (Fastify 5) + `server/questionnaire.mjs`. Dépendances de prod : Fastify, nodemailer, zod |
| Image | `Dockerfile` multi-stage, Node 22 alpine, `USER node`, healthcheck sur `/api/health`, copie `dist/`, `server/`, `shared/` |
| CI | `.github/workflows/deploy.yml`, **uniquement sur tag `v*`** : build `linux/amd64` → test de démarrage (`read_only`, 256 Mo, sans SMTP : `/api/health`, `/`, `/contact`, `/questionnaire`, 404, `healthy`) → publication `:<tag>` et `:latest`. Aucun secret de déploiement, la CI ne touche pas au VPS |
| Versions | tag `vX.Y` = `version` `X.Y.0` de `package.json` = ligne `image:` de `compose.yml`. Un tag = une mise en production = une unité de rollback |
| Dépôt, image | `github.com/sosese/sosese` (privé), `ghcr.io/sosese/sosese` (privé : `docker login ghcr.io`, jeton `read:packages`) |

### Serveur (`server/index.mjs`)
| Route / comportement | Détail |
|---|---|
| Statique | `dist/` ; `/contact` servi sans redirection ; 404 → `404.html` ; `/api/*` inconnu → JSON 404. Routes inventoriées au démarrage : **redémarrer après un build** |
| Cache | `/_astro/*` immuable 1 an · HTML `no-cache` · reste 7 jours |
| Compression | brotli / gzip dans Fastify — **jamais aussi dans Traefik** |
| `GET /api/health` | `{ ok: true }` |
| `POST /api/contact` | JSON seul, zod (`shared/contact.json`), 5 req / 10 min / IP. `200` · `400 {erreur:"validation", champs}` · `415` sans JSON · `429` · `502` échec SMTP · `503` SMTP non configuré. Email texte brut, `Reply-To` = demandeur |
| `POST /api/questionnaire` | idem, `bodyLimit` 64 ko, `reponses` strict. Email : texte + pièce jointe JSON. Accusé de réception à texte **fixe** (rien de saisi recopié), envoyé **après** la réponse au visiteur, seulement si l'email des réponses est parti |
| Anti-spam | champ piège rempli ou remplissage trop rapide (< 3 s contact, < 8 s questionnaire) → `200` **sans envoi** |
| Sécurité | helmet ; CSP `script-src 'self'` + empreintes sha256 des scripts inline calculées depuis `dist/` au démarrage ; HSTS en production ; retours à la ligne refusés dans les champs d'une ligne |
| SMTP | 465 TLS implicite, 587 STARTTLS, autre port sans TLS (Mailpit) ; délais 10 s / 20 s ; connexion gardée ouverte (`pool`, 1 connexion) |
| Journaux | aucune ligne par requête (ni IP ni URL), ni donnée de formulaire : démarrage, envoi / ignoré / échec SMTP |
| Proxy | `trustProxy: 1` (IP du rate limit = celle vue par Traefik) |

Aucune donnée n'est stockée côté serveur : les demandes partent par email (`MAIL_TO`). Variables : `.env.example`
(`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`, `MAIL_FROM`). `MAIL_FROM` = `SMTP_USER`.

### VPS et services voisins
VPS Hostinger x86, `186.241.17.83`, ~7 Go de RAM, **sans swap**. Le site vit dans `/srv/sosese` (`compose.yml`,
`.env`, `deploy.sh`). Le VPS est **partagé** : toute commande sans portée explicite touche aussi les voisins.

| Service | Rôle | Contrôle |
|---|---|---|
| `traefik` (`traefik:latest`, projet `traefik-a1wt`) | reverse proxy : TLS Let's Encrypt (certresolver `letsencrypt`, challenge HTTP), entrypoint `websecure`, réseau `traefik-net`, redirection HTTP → HTTPS. Écrit le journal d'accès `/var/log/traefik/access.log` (IP, date, chemin, statut), rotation logrotate hebdomadaire × 26 = 6 mois | `https://traefik.sosese.tech/dashboard/` → 401 |
| `crowdsec` | détection d'intrusion : lit le journal d'accès de Traefik, bloque les IP malveillantes et les signale au réseau CrowdSec (CrowdSec SAS). Déclaré dans `/confidentialite`. Configuration hors de ce dépôt | — |
| `fastmcp-extrabat` | serveur MCP qui relie l'assistant au CRM Extrabat (projet séparé) | `https://mcp-extrabat.sosese.tech/health` → 200 |
| `filebrowser-quantum` | gestionnaire de fichiers web (projet séparé) | — |
| `sosese-web` | ce site | `https://sosese.tech/api/health` |

`compose.yml` du site : tag figé, `read_only`, `tmpfs /tmp`, `cap_drop: ALL`, `no-new-privileges`, 256 Mo,
`pids_limit: 100`, journaux 3 × 10 Mo. **Tous les noms Traefik commencent par `sosese`** : un routeur ou middleware en
double écrase silencieusement un voisin. DNS : `sosese.tech` → VPS, `www` en CNAME, redirigé en 301 vers l'apex
(308 en HEAD : tester en GET).

---

## 1. Modifier — en local

```bash
git checkout main && git pull && git status    # état propre
git checkout -b fix/xxx                        # feat/ fix/ content/ chore/ docs/
npm run dev                                    # http://localhost:4321
npm run build && npm start                     # http://localhost:3000 : serveur de prod, requis pour les formulaires
docker compose -f compose.dev.yml up --build   # image locale + Mailpit (http://localhost:8025), si serveur/Dockerfile/dépendances changent
```

- Valider soi-même : les deux thèmes, le clavier, un vrai téléphone. Sans `.env` local, les emails restent dans Mailpit.
- Fusion : `git push -u origin <branche>`, `gh pr create --fill`, `gh pr merge --merge`. `main` reste déployable.

## 2. Publier une version — `npm run release`

```bash
git checkout main && git pull
npm run release -- 0.12          # local : version, PR, merge, tag, suivi de la CI
```

Prérequis : PR de la version mergées, `main` identique à `origin/main`, `gh auth status` connecté, numéro supérieur
à la version actuelle. Le script (`scripts/release.sh`) : contrôles → branche `chore/vX.Y` avec les seuls numéros de
version (diff contrôlé : 3 fichiers, 4 lignes) → `npm ci && npm run build` (le lockfile ne doit pas bouger) →
confirmations, commit, PR, merge → tag annoté → suivi de la CI → alerte si `compose.yml` a changé au-delà du tag (le
copier sur le VPS **avant** de déployer, §5).

| Arrêt | Suite |
|---|---|
| contrôles, diff de version, build, refus avant PR | rien n'est publié : corriger, relancer |
| refus avant merge ou avant tag | merger la PR / taguer à la main (§2.5) |
| CI en échec | tag grillé, aucune image : corriger, publier la version suivante |

### 2.4 Règles de version
- Ne jamais republier ni déplacer un tag.
- Un commit de version ne touche que les numéros (**jamais `npm install`**, `DESIGN.md` piège 13). Montées de
  dépendances dans leur propre branche `chore/`.

### 2.5 À la main (secours)
```bash
git checkout -b chore/v0.12
node -e 'const fs=require("fs"),v=process.argv[1];for(const f of ["package.json","package-lock.json"]){const j=JSON.parse(fs.readFileSync(f,"utf8"));j.version=v;if(j.packages)j.packages[""].version=v;fs.writeFileSync(f,JSON.stringify(j,null,2)+"\n")}' 0.12.0
sed -i 's#sosese/sosese:v0.11#sosese/sosese:v0.12#' compose.yml
git diff --stat                                # 3 fichiers, uniquement des numéros de version
npm ci && npm run build && npm start
git commit -am "chore: version 0.12.0"         # puis push, PR, merge (§1)
git checkout main && git pull
git tag -a v0.12 -m "v0.12 — <résumé>" && git push origin v0.12
gh run watch
```

## 3. Déployer — `deploy.sh` sur le VPS

### 3.1 Installer ou mettre à jour le script
À chaque modification de `scripts/deploy-vps.sh` sur `main` (la copie du VPS n'est pas versionnée) :
```bash
scp scripts/deploy-vps.sh root@186.241.17.83:/srv/sosese/deploy.sh
ssh root@186.241.17.83 chmod 700 /srv/sosese/deploy.sh
```

### 3.2 Déployer
```bash
ssh root@186.241.17.83
/srv/sosese/deploy.sh v0.12      # vX.Y ou préversion vX.Y-suffixe ; < 1 min
```
Le script : verrou → `docker pull` **avant** de toucher à quoi que ce soit (tag absent = arrêt, production intacte) →
remplace la seule ligne `image:` (sauvegarde `compose.yml.precedent`), `docker compose config --quiet` (jamais sans
`--quiet` : afficherait le `.env`), `up -d` → **vérifications bloquantes** (`healthy`, `/api/health`, `/`, `/contact`
via Traefik ; échec = **rollback automatique**) → vérifications non bloquantes (SMTP, `www` 301, Traefik 401,
Extrabat 200) → nettoyage des seules images `sosese` (en ligne + 3 plus récentes, préversions gardées).

Après : tester le site et un envoi réel de formulaire, vérifier la synchro (§8), **consigner dans `CHANGELOG.md`**.
Snapshot Hostinger avant toute intervention sur l'infrastructure (Traefik, réseaux, volumes), pas pour un changement de tag.

### 3.6 À la main (secours)
```bash
scp compose.yml root@186.241.17.83:/srv/sosese/compose.yml     # poste local, main à jour
cd /srv/sosese && docker compose config --quiet && docker compose pull && docker compose up -d   # VPS
docker compose ps && docker compose logs web    # "healthy" ; « SMTP : connexion et authentification vérifiées »
curl https://sosese.tech/api/health
```

## 4. Rollback
```bash
/srv/sosese/deploy.sh v0.11      # tag précédent, affiché à la fin de chaque déploiement ; image en cache, quelques secondes
```
Puis publier une version corrective depuis `main` (dont `compose.yml` désigne encore la version retirée) et consigner
le rollback dans `CHANGELOG.md`.

## 5. Cas particuliers
- **Variable d'environnement** : `nano /srv/sosese/.env` (valeur avec `$` entre apostrophes), `chmod 600 .env`,
  `docker compose up -d --force-recreate`, vérifier la ligne SMTP des logs. Toute nouvelle clé va aussi, vide, dans
  `.env.example`.
- **Labels Traefik ou autre changement de `compose.yml`** : modifier dans le dépôt (branche, PR), puis copier sur le VPS
  (§3.6) — `deploy.sh` ne change que `image:`. Vérifier ensuite les voisins : Traefik recharge à chaud.
- **Préversion** : tag `vX.Y-suffixe` poussé depuis une autre branche, déployé par `deploy.sh`. `compose.yml` sur `main`
  ne désigne plus la production : le consigner et le résorber au déploiement suivant.
- **Mentions légales, confidentialité** : `src/config/site.ts` (`legal`). `legal.dureeJournauxTechniques` reste aligné
  sur la rotation du journal Traefik.

## 6. Diagnostic
Commandes lancées par l'humain ; coller la sortie dans la session, jamais un secret.
```bash
docker compose ps ; docker compose logs web --tail 100 ; docker stats sosese-web --no-stream
docker logs traefik --since 10m 2>&1 | grep -iE "sosese|acme|error"
```
| Symptôme | Piste |
|---|---|
| `unhealthy` | `docker compose logs web` : crash au démarrage. SMTP manquant n'empêche pas le démarrage (formulaires en 503) |
| 404 / 502 Traefik | label `rule` mal formé ou conteneur hors `traefik-net` / port 3000 |
| Certificat invalide | `docker logs traefik \| grep acme` : DNS ou AAAA vers une autre machine |
| Formulaire en erreur | ligne `SMTP : vérification échouée` (`EAUTH` identifiants, `ESOCKET` hôte/port) ; `$` non protégé dans `.env` |
| « Envoyé » mais rien reçu | logs : `ignoré (anti-spam)` et son motif, ou rebond dans la boîte `MAIL_FROM` ; spams |
| 429 | 5 envois / 10 min / IP : attendre |
| Redémarrages en boucle | `docker stats` : `mem_limit` dépassé, aucun swap |

## 7. Interdits permanents sur ce VPS
```
docker system prune -a      docker volume prune      docker stop $(docker ps -q)
docker compose down         # hors de /srv/sosese
docker compose config       # sans --quiet (affiche les secrets)
```

## 8. Vérifier la synchronisation local / dépôt / production
Faisable par une session Claude Code (requêtes HTTP publiques uniquement).
```bash
git fetch --all --tags && git status -sb && grep image: compose.yml
git checkout <tag> && npm ci && npm run build
cd dist && for f in $(find _astro -type f); do
  [ "$(curl -s https://sosese.tech/$f | sha256sum)" = "$(sha256sum < $f)" ] && echo "ok $f" || echo "DIFFÉRENT $f"
done
```
Les pages HTML ne diffèrent que par les `uid` des îlots : comparer après `sed -E 's/ uid="[^"]*"//g'`.

## 9. Entretien
| Quand | Quoi |
|---|---|
| Avant la `v1.0` | compléter les mentions légales (`src/config/site.ts`) |
| Tous les 1 à 3 mois | `npm outdated`, `npm audit`, en branche `chore/` |
| Si Traefik change | figer sa version (`traefik:latest` aujourd'hui), revérifier les noms de routeurs |
