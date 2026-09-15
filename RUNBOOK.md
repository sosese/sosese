# RUNBOOK — sosese.tech

Procédure de modification, de publication et de déploiement.

**Règle fondatrice** : le développement se fait exclusivement en local. Claude Code n'a jamais d'accès au VPS
(`ssh`, `scp` et `rsync` sont bloqués dans `.claude/settings.json`). Les sections 3 à 7 sont exécutées **par l'humain**.
Les décisions techniques et leurs raisons sont dans `DESIGN.md`.

---

## Référence

| Élément | Valeur |
|---|---|
| Site | https://sosese.tech (`www` redirige en 301 vers l'apex) |
| Dépôt | `github.com/sosese/sosese` (privé) |
| Image | `ghcr.io/sosese/sosese:<tag>` (paquet privé) |
| Version en production | le tag de `image:` dans `compose.yml` sur `main` |
| VPS | `186.241.17.83`, dossier `/srv/sosese` (`compose.yml` + `.env`) |
| Réseau Traefik | `traefik-net` |
| Certresolver | `letsencrypt` (challenge HTTP, renouvellement automatique par Traefik) |
| Entrypoint | `websecure` |
| Voisins à ne pas casser | `traefik`, `crowdsec`, `fastmcp-extrabat`, `filebrowser-quantum` |

---

## 1. Modifier — en local

### 1.1 Partir d'un état propre

```bash
cd ~/dev/sosese
git checkout main
git pull
git status          # doit être vide
```

### 1.2 Créer une branche

Une branche par modification cohérente. Nommage : `feat/`, `fix/`, `content/`, `chore/`, `docs/`.

```bash
git checkout -b fix/formulaire-message-erreur
```

### 1.3 Session Claude Code

```bash
claude
```

`CLAUDE.md` se charge automatiquement ; il impose de lire `DESIGN.md` avant toute modification.

Pour une modification structurante, passer en plan mode (`Shift+Tab` deux fois) et demander le plan avant le code :

```
Plan uniquement, ne code pas.
Objectif : <description précise>
Dis-moi les fichiers touchés, les composants réutilisés depuis DESIGN.md,
et ce que tu crées de nouveau.
```

**Contrat de fin de tâche** — rappelé dans `CLAUDE.md`, à exiger systématiquement :

```
Avant de dire que c'est fini :
- npm run build passe
- aucune valeur en dur (couleur, rayon, espacement) hors tokens.css
- vérifié en thème clair ET sombre
- hiérarchie de titres cohérente, focus visible au clavier
- animations sous prefers-reduced-motion
- aucun jargon technique hors "Sous le capot"
- DESIGN.md mis à jour si un composant, une décision ou un piège est apparu
```

### 1.4 Valider soi-même, dans le navigateur

```bash
npm run dev                          # http://localhost:4321
# pour tester le formulaire en dev, dans un second terminal :
npm run build && npm start           # serveur Fastify sur le port 3000, relayé par npm run dev
```

- Les deux thèmes, avec rechargement dans chacun (aucun flash)
- Parcours complet au clavier
- Mobile réel, pas seulement le mode responsive du navigateur

La description de l'agent n'est pas une validation.

Îlots React vides en dev avec `jsxDEV is not a function` dans la console : relancer `npm run dev -- --force`.

### 1.5 Committer

```bash
git status                           # relire ce qui part
git add <fichiers>
git commit -m "fix: message d'erreur explicite si le SMTP tombe"
```

Un commit par unité de sens : c'est le point de retour si une session part de travers.
`git restore .` revient au dernier commit **en effaçant définitivement** les modifications non commitées ;
`git stash` les met de côté sans les perdre.

### 1.6 Tester comme en production

Modification front (contenu, styles, sections) :

```bash
npm run build && npm start           # http://localhost:3000 : Fastify, CSP et cache de production
```

Backend, `Dockerfile` ou dépendances modifiés :

```bash
docker compose -f compose.dev.yml up --build
# http://localhost:3000 — envoyer le formulaire
# http://localhost:8025 — Mailpit, vérifier la réception
docker compose -f compose.dev.yml ps      # "healthy" (~30 s)
docker compose -f compose.dev.yml down    # projet sosese-dev, local uniquement
```

Sans `.env` local, les emails restent dans Mailpit. Avec un `.env` local, l'envoi est réel.

### 1.7 Fusionner

```bash
git push -u origin fix/formulaire-message-erreur
gh pr create --base main --fill
gh pr merge --merge
git checkout main && git pull
git branch -d fix/formulaire-message-erreur
```

`main` doit rester déployable à tout moment.

---

## 2. Publier une version

Le tag déclenche GitHub Actions : build, **test de démarrage du conteneur**, puis publication sur GHCR.
Rien ne part sur le VPS.

### 2.1 Préparer la version sur `main`

Dans une branche `chore/vX.Y`, puis PR et merge comme en 1.7 :

```bash
npm pkg set version=0.3.0 && npm install --package-lock-only
sed -i 's#sosese/sosese:v0.2#sosese/sosese:v0.3#' compose.yml
git add package.json package-lock.json compose.yml
git commit -m "chore: version 0.3.0"
```

`compose.yml` sur `main` est la source de vérité du VPS : il doit toujours désigner la version déployée.

### 2.2 Taguer

```bash
git checkout main && git pull
git tag -a v0.3 -m "v0.3 — <résumé>"
git push origin v0.3
```

- Versionnage `vX.Y`, qui correspond à `version` = `X.Y.0` dans `package.json`.
- Ne jamais republier ni déplacer un tag existant.
- Passage en `v1.0` : à décider (par exemple une fois les mentions légales complétées).

### 2.3 Suivre le build

```bash
gh run watch
```
ou https://github.com/sosese/sosese/actions — durée typique : 2 minutes.
Si le test de démarrage échoue, rien n'est publié.

### 2.4 Vérifier l'image en local

```bash
docker login ghcr.io -u sosese            # une fois ; jeton GitHub read:packages
docker run --rm -p 127.0.0.1:3000:3000 --read-only --tmpfs /tmp --env-file .env ghcr.io/sosese/sosese:v0.3
curl -I http://localhost:3000
curl http://localhost:3000/api/health     # {"ok":true}
```

Une image qui ne démarre pas en local ne démarrera pas mieux en production.

---

## 3. Déployer — sur le VPS, manuellement

Snapshot Hostinger avant toute intervention sur l'infrastructure (Traefik, réseaux, volumes). Pas nécessaire pour un
simple changement de tag.

### 3.1 Mettre à jour `compose.yml`

Depuis le poste local, sur `main` à jour (le fichier contient déjà le nouveau tag, cf. 2.1) :

```bash
scp compose.yml root@186.241.17.83:/srv/sosese/compose.yml
```

Puis sur le VPS :

```bash
ssh root@186.241.17.83
cd /srv/sosese
grep image: compose.yml          # vérifier le tag
```

### 3.2 Déployer

```bash
docker compose config --quiet    # valide le fichier SANS l'afficher
docker compose pull
docker compose up -d
docker compose ps                # attendre "healthy", ~30 s
docker compose logs web          # « SMTP : connexion et authentification vérifiées »
```

⚠ Ne jamais lancer `docker compose config` sans `--quiet` : la sortie contient les valeurs du `.env`, mot de passe
SMTP compris. Ne jamais la coller dans une session.

### 3.3 Vérifier

```bash
curl -I https://sosese.tech                          # 200
curl -I https://www.sosese.tech                      # 301 vers https://sosese.tech/
curl https://sosese.tech/api/health                  # {"ok":true}
curl -I https://traefik.sosese.tech/dashboard/       # 401 : les voisins répondent toujours
curl https://mcp-extrabat.sosese.tech/health         # 200
docker ps --format 'table {{.Names}}\t{{.Status}}'
```

Puis, dans le navigateur : le site, et le formulaire envoyé en réel avec vérification de la réception.

Une session Claude Code peut ensuite vérifier la synchronisation (section 8), par requêtes HTTP publiques uniquement.

### 3.4 Nettoyer — uniquement si nécessaire

```bash
docker image prune -f            # images sans tag et sans conteneur
```

**Jamais** `docker system prune -a`, `docker volume prune`, ni `docker stop $(docker ps -q)` : ces commandes touchent
tous les projets du VPS.

Garder au moins les deux dernières images taguées : ce sont les cibles de rollback.

---

## 4. Rollback

```bash
cd /srv/sosese
sed -i 's#sosese/sosese:v0.3#sosese/sosese:v0.2#' compose.yml
docker compose up -d
curl -I https://sosese.tech
```

Quelques secondes : l'image précédente est en cache local, aucun build, aucune dépendance réseau.

Reporter ensuite le tag de rollback dans `compose.yml` sur `main`, corriger en local, publier une `v0.4`, redéployer.

---

## 5. Cas particuliers

### Modifier une variable d'environnement

Le `.env` vit uniquement sur le VPS (et éventuellement en local pour les tests), jamais dans Git.

```bash
cd /srv/sosese
nano .env                         # valeur contenant $ : entourer d'apostrophes 'comme ceci'
chmod 600 .env
docker compose up -d --force-recreate
docker compose logs web           # vérifier la ligne « SMTP : … »
```

Toute nouvelle clé : l'ajouter sans valeur dans `.env.example` côté dépôt.

### Modifier les labels Traefik

Modifier `compose.yml` **dans le dépôt** (branche, PR, merge), puis le copier sur le VPS comme en 3.1.
Ne jamais éditer seulement la copie du VPS : le prochain `scp` écraserait la modification.

```bash
docker compose up -d
docker logs traefik --since 2m 2>&1 | grep -iE "sosese|error"
```

Vérifier immédiatement les autres services (3.3) : Traefik recharge à chaud, et un nom de routeur ou de middleware
en double écrase silencieusement un voisin. Tous les noms doivent commencer par `sosese`.

### Ajouter une question de FAQ ou un exemple

Un seul fichier Markdown dans `src/content/faq/` ou `src/content/exemples/` (voir `DESIGN.md`).
Pas de session Claude Code nécessaire : `npm run build` pour valider, puis branche, PR, version, déploiement.

### Compléter les mentions légales ou la politique de confidentialité

Tout est dans `src/config/site.ts` (`legal`, `personne`, `zoneIntervention`). Une valeur à `null` s'affiche en
« à compléter » ; le build liste les champs manquants des mentions légales.
`legal.dureeJournauxTechniques` (« 6 mois ») doit rester aligné sur la rotation logrotate du journal Traefik.

### Accès au registre

Le paquet GHCR est privé. Sur une machine qui n'a pas encore tiré l'image :

```bash
docker login ghcr.io -u sosese
# mot de passe = jeton GitHub, scope read:packages uniquement
```

Le jeton est stocké en clair (base64) dans `~/.docker/config.json`.

---

## 6. Diagnostic

Toutes les commandes sont à exécuter par l'humain. Pour faire analyser un problème, coller la sortie dans la session
Claude Code — ne jamais donner l'accès, ne jamais coller de secret.

```bash
docker compose ps                              # état et santé
docker compose logs web --tail 100             # logs applicatifs (ni IP ni données du formulaire)
docker compose logs web -f                     # en direct
docker stats sosese-web --no-stream            # RAM (limite 256 Mo)
docker logs traefik --since 10m 2>&1 | grep -iE "sosese|acme|error"
curl -I https://sosese.tech
```

| Symptôme | Piste |
|---|---|
| `unhealthy` | `docker compose logs web` : crash au démarrage (image incomplète, port). Des variables SMTP manquantes n'empêchent pas le démarrage : le formulaire répond alors 503 |
| 404 Traefik | label `rule` mal formé, ou conteneur absent du réseau `traefik-net` |
| 502 Traefik | le conteneur tourne mais n'écoute pas sur 3000, ou `loadbalancer.server.port` faux |
| Certificat invalide | `docker logs traefik \| grep acme` : DNS qui ne pointe pas ici, ou enregistrement AAAA vers une autre machine |
| Formulaire en erreur | ligne `SMTP : vérification échouée` au démarrage (`EAUTH` = identifiants, `ESOCKET` = hôte ou port) ; `$` non protégé dans le mot de passe |
| Page « envoyé » mais rien reçu | `docker compose logs web` : `demande ignorée (anti-spam)` avec son motif, ou `email accepté` puis rejet ultérieur (adresse `MAIL_TO` mal formée : rebond dans la boîte `MAIL_FROM`) ; vérifier les spams |
| Formulaire en 429 | limite de 5 envois / 10 min par IP : attendre |
| Redémarrages en boucle | `docker stats` : dépassement de `mem_limit`, et aucun swap sur ce VPS |

---

## 7. Interdits permanents sur ce VPS

```
docker system prune -a
docker volume prune
docker stop $(docker ps -q)
docker compose down        # hors de /srv/sosese
docker compose config      # sans --quiet (affiche les secrets)
```

Le VPS héberge `traefik`, `crowdsec`, `fastmcp-extrabat` et `filebrowser-quantum`. Toute commande sans portée explicite
les concerne aussi.

---

## 8. Vérifier la synchronisation local / dépôt / production

À faire après chaque déploiement. Une session Claude Code peut s'en charger : elle n'utilise que des requêtes HTTP
publiques.

```bash
git fetch --all --tags
git status -sb                                  # main...origin/main, rien en attente
git describe --tags --exact-match origin/main   # tag de la version si main n'a rien de plus
grep image: compose.yml                         # doit correspondre au tag déployé

# Code en ligne = build local du même commit (les noms des fichiers /_astro dérivent de leur contenu)
git checkout <tag> && npm ci && npm run build
cd dist && for f in $(find _astro -type f); do
  [ "$(curl -s https://sosese.tech/$f | sha256sum)" = "$(sha256sum < $f)" ] && echo "ok $f" || echo "DIFFÉRENT $f"
done
```

Les pages HTML ne diffèrent que par les attributs `uid` des îlots, tirés au hasard à chaque build : les comparer
après `sed -E 's/ uid="[^"]*"//g'`.

---

## 9. Entretien régulier

| Quand | Quoi |
|---|---|
| Avant la `v1.0` | compléter les mentions légales (`src/config/site.ts`) |
| Prochaine version | mettre à jour les actions GitHub signalées « Node.js 20 deprecated » (`checkout`, `setup-buildx`, `build-push`, `login`) : versions majeures, à valider sur un tag de test |
| Tous les 1 à 3 mois | `npm outdated` et `npm audit` en local, puis version + déploiement |
| Si la rotation change | aligner `legal.dureeJournauxTechniques` sur `/etc/logrotate.d/traefik` |
| Si Traefik change | figer sa version (`traefik:latest` actuellement) et revérifier les noms de routeurs |
