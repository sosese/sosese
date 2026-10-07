# RUNBOOK — sosese.tech

Procédure de modification, de publication et de déploiement.

**Règle fondatrice** : le développement se fait exclusivement en local. Claude Code n'a jamais d'accès au VPS
(`ssh`, `scp` et `rsync` sont bloqués dans `.claude/settings.json`). Les sections 2 à 7 sont exécutées **par l'humain**
(`npm run release` pousse, merge et tague ; `deploy.sh` agit sur la production).
Les décisions techniques et leurs raisons sont dans `DESIGN.md`.

---

## Référence

| Élément | Valeur |
|---|---|
| Site | https://sosese.tech (`www` redirige en 301 vers l'apex ; 308 sur une requête HEAD) |
| Dépôt | `github.com/sosese/sosese` (privé) |
| Image | `ghcr.io/sosese/sosese:<tag>` (paquet privé) |
| Version en production | le tag de `image:` dans `compose.yml` sur `main` ; en cas d'écart, celui de `/srv/sosese/compose.yml` fait foi (§5, « Préversion ») |
| Historique | `CHANGELOG.md` : versions publiées et déploiements |
| Scripts | `scripts/release.sh` (`npm run release`, §2) ; `scripts/deploy-vps.sh`, copié en `/srv/sosese/deploy.sh` (§3) |
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

## 2. Publier une version — `npm run release`

**En bref**, une fois les PR de la version mergées :

```bash
git checkout main && git pull
npm run release -- 0.10          # local : version, PR, merge, tag, image publiée
ssh root@186.241.17.83
/srv/sosese/deploy.sh v0.10      # VPS : mise en production, rollback automatique si le site ne répond pas
```

Ces commandes poussent, mergent, taguent et touchent la production : elles sont **lancées par l'humain**, jamais par
une session Claude Code.

### 2.1 Avant de commencer

- Toutes les PR de la version sont mergées sur GitHub.
- `main` local est **identique** à `origin/main` : aucun fichier modifié, aucun commit non poussé. Un travail commité
  directement sur `main` doit d'abord passer par une branche et une PR (1.7). Les fichiers non suivis (rapports…)
  ne gênent pas.
- `gh auth status` est connecté ; `node` et `npm` sont installés.
- Le numéro choisi est supérieur à la version actuelle (`package.json`) et le tag n'existe pas encore.

### 2.2 Ce que fait `scripts/release.sh`

1. **Contrôles** : ceux de 2.1. Le moindre écart arrête le script, rien n'est modifié.
2. **Numéro de version**, dans une branche `chore/vX.Y` : `package.json`, `package-lock.json` et la ligne `image:` de
   `compose.yml`, **sans `npm install`**. Contrôle bloquant du diff : 3 fichiers, 4 lignes, uniquement des numéros de
   version (piège 19). Sinon, la branche est supprimée et rien n'est commité.
3. **Build** : `npm ci && npm run build`, le lockfile ne doit pas bouger. Puis, au choix, `npm start` sur
   http://localhost:3000 pour parcourir les pages (`Ctrl+C` pour continuer).
4. **Confirmation**, puis commit `chore: version X.Y.0`, push et PR. Un refus ici annule tout et revient sur `main`.
5. **Confirmation**, puis merge de la PR (branche distante supprimée) et retour sur `main` à jour.
6. **Résumé de la version** (une ligne, il devient le message du tag), **confirmation**, puis tag annoté `vX.Y` poussé.
7. **Suivi du build GitHub Actions** (~2 min) : build, test de démarrage du conteneur, publication sur GHCR.
8. Alerte si `compose.yml` a changé au-delà du tag depuis la version précédente (labels Traefik…) : le copier sur le
   VPS **avant** de déployer (§5). Enfin, affichage de la commande de déploiement.

### 2.3 Si le script s'arrête

| Arrêt | État | Suite |
|---|---|---|
| Contrôles | rien n'a changé | corriger ce qui est signalé, relancer |
| Diff de version ou build | branche `chore/vX.Y` supprimée, retour sur `main` | corriger sur une branche à part, relancer |
| Refus avant la PR | idem | relancer quand prêt |
| Refus avant le merge | PR ouverte sur GitHub | la merger, puis taguer à la main (2.5) |
| Refus avant le tag | `main` contient la version | taguer à la main (2.5) |
| CI en échec | tag poussé, **aucune image publiée** | le tag est grillé : corriger, publier la version suivante |

### 2.4 Règles de version

- Tags `vX.Y`, correspondant à `version` = `X.Y.0` dans `package.json`. Passage en `v1.0` : à décider (par exemple une
  fois les mentions légales complétées).
- Ne jamais republier ni déplacer un tag existant.
- Un commit de version ne touche que les numéros de version. **Jamais `npm install --package-lock-only`** : les tags
  `v0.3` et `v0.6` ont échoué au test de démarrage parce que le commit de version montait aussi `astro` 5 → 7,
  `@fastify/static` 8 → 10 et `nodemailer` 7 → 10 (`DESIGN.md`, piège 19). Les montées de dépendances se font dans
  leur propre branche.
- `compose.yml` sur `main` désigne la version en production. Une préversion déployée hors de `main` crée un écart à
  résorber (§5, « Préversion »).

### 2.5 À la main (secours)

Mêmes étapes que le script, pour reprendre après un arrêt ou s'il est indisponible.

```bash
git checkout -b chore/v0.10
# Numéro de version seul, sans npm install : ne résout ni ne met à jour aucune dépendance.
node -e '
const fs=require("fs"), v=process.argv[1];
for (const f of ["package.json","package-lock.json"]) {
  const j=JSON.parse(fs.readFileSync(f,"utf8")); j.version=v; if (j.packages) j.packages[""].version=v;
  fs.writeFileSync(f, JSON.stringify(j,null,2)+"\n");
}' 0.10.0
sed -i 's#sosese/sosese:v0.9#sosese/sosese:v0.10#' compose.yml

# Contrôle bloquant : exactement 3 fichiers, 4 lignes changées, uniquement des lignes "version".
git diff --stat
git diff package.json package-lock.json | grep '^[-+] '

npm ci && npm run build && npm start   # http://localhost:3000 : parcourir les pages
git add package.json package-lock.json compose.yml
git commit -m "chore: version 0.10.0"
# push, PR et merge comme en 1.7

git checkout main && git pull
git tag -a v0.10 -m "v0.10 — <résumé>"
git push origin v0.10
gh run watch                           # ou https://github.com/sosese/sosese/actions
```

Vérifier une image en local (facultatif) :

```bash
docker login ghcr.io -u sosese            # une fois ; jeton GitHub read:packages
docker run --rm -p 127.0.0.1:3000:3000 --read-only --tmpfs /tmp --env-file .env ghcr.io/sosese/sosese:v0.10
curl http://localhost:3000/api/health     # {"ok":true}
```

---

## 3. Déployer — `deploy.sh` sur le VPS

### 3.1 Installer ou mettre à jour le script

Une fois, puis à chaque modification de `scripts/deploy-vps.sh` sur `main`, depuis le poste local :

```bash
scp scripts/deploy-vps.sh root@186.241.17.83:/srv/sosese/deploy.sh
ssh root@186.241.17.83 chmod 700 /srv/sosese/deploy.sh
```

La copie du VPS n'est pas versionnée : après une modification du script, ne pas oublier de la refaire.

### 3.2 Déployer

```bash
ssh root@186.241.17.83
/srv/sosese/deploy.sh v0.10
```

Le tag doit être publié (2.2, étape 7). Formes acceptées : `vX.Y` et les préversions `vX.Y-suffixe`
(ex. `v0.9-v2-preview.1`). Durée : moins d'une minute.

Snapshot Hostinger avant toute intervention sur l'infrastructure (Traefik, réseaux, volumes). Pas nécessaire pour un
simple changement de tag.

### 3.3 Ce que fait le script

1. **Verrou** : un seul déploiement à la fois.
2. **`docker pull` de l'image avant de toucher à quoi que ce soit** : tag inexistant, CI en échec ou `docker login`
   manquant = arrêt immédiat, production intacte.
3. Copie de `compose.yml` dans `compose.yml.precedent`, remplacement du tag sur la seule ligne `image:`,
   `docker compose config --quiet` (jamais sans `--quiet` : la sortie afficherait le `.env`), `docker compose up -d`.
4. **Vérifications bloquantes** : conteneur `sosese-web` `healthy` sur la bonne image, puis `/api/health`, `/` et
   `/contact` via Traefik. **Un échec déclenche le retour automatique à la version précédente**, vérifié de la même façon.
5. **Vérifications non bloquantes**, signalées en jaune sans rollback (la cause est extérieure à l'image) : ligne SMTP
   des journaux, `www` en 301, Traefik en 401, Extrabat en 200.
6. **Nettoyage** des seules images `ghcr.io/sosese/sosese` en `vX.Y` : la version en ligne et les 3 plus récentes sont
   conservées. Les préversions ne sont jamais supprimées. Aucun `prune` global.
7. Affichage de la version en ligne, de la précédente et de la commande de rollback.

### 3.4 Après le déploiement

- Dans le navigateur : le site, et le formulaire envoyé en réel avec vérification de la réception.
- Synchronisation dépôt / production (§8) : une session Claude Code peut s'en charger, par requêtes HTTP publiques.
- Consigner le déploiement dans `CHANGELOG.md` (date, tag, version précédente).

### 3.5 Si le script s'arrête

| Message | Production | Suite |
|---|---|---|
| `Usage : deploy.sh vX.Y` | intacte | tag mal formé |
| `Ligne image: introuvable ou en double` | intacte | `grep -n image /srv/sosese/compose.yml \| cat -A` : forme inattendue de la ligne |
| `Image … introuvable` | intacte | CI en échec (`gh run list`), tag mal tapé, ou `docker login ghcr.io` (§5) |
| `compose.yml invalide` | intacte, fichier restauré | comparer avec `compose.yml` de `main` |
| `Rollback réussi` | version précédente | `docker compose logs web --tail 100`, corriger, publier la version suivante |
| `Le rollback lui-même ne répond pas` | **incertaine** | diagnostic manuel (§6) |
| alerte jaune SMTP | en ligne | identifiants ou hébergeur SMTP (§6) |
| alerte jaune voisins | en ligne | vérifier Traefik et Extrabat (§6) |

### 3.6 À la main (secours)

```bash
# poste local, sur main à jour
scp compose.yml root@186.241.17.83:/srv/sosese/compose.yml

# VPS
cd /srv/sosese
grep image: compose.yml          # vérifier le tag
docker compose config --quiet    # valide le fichier SANS l'afficher
docker compose pull
docker compose up -d
docker compose ps                # attendre "healthy", ~30 s
docker compose logs web          # « SMTP : connexion et authentification vérifiées »

curl -s -o /dev/null -w '%{http_code}\n' https://sosese.tech                  # 200
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://www.sosese.tech/   # 301 https://sosese.tech/
curl https://sosese.tech/api/health                  # {"ok":true}
curl -I https://traefik.sosese.tech/dashboard/       # 401 : les voisins répondent toujours
curl https://mcp-extrabat.sosese.tech/health         # 200
docker ps --format 'table {{.Names}}\t{{.Status}}'
```

`curl -I` (requête HEAD) sur `www` renvoie **308** et non 301 : c'est Traefik, pas une erreur. Tester en GET comme
ci-dessus.

Nettoyage, uniquement si nécessaire : `docker image rm ghcr.io/sosese/sosese:<ancien tag>`, ou `docker image prune -f`
(images sans tag). **Jamais** `docker system prune -a`, `docker volume prune`, ni `docker stop $(docker ps -q)` : ces
commandes touchent tous les projets du VPS. Garder au moins les deux dernières images : ce sont les cibles de rollback.

---

## 4. Rollback

```bash
/srv/sosese/deploy.sh v0.9       # sur le VPS : le tag précédent, affiché à la fin de chaque déploiement
```

Quelques secondes : l'image précédente est en cache local (le nettoyage en garde 3), aucun build.

Puis, côté dépôt : `compose.yml` sur `main` désigne encore la version retirée. Corriger en local et publier la version
suivante, qui remet `main` et la production d'accord. Consigner le rollback dans `CHANGELOG.md`.

À la main : `sed -i 's#sosese/sosese:v0.10#sosese/sosese:v0.9#' compose.yml && docker compose up -d` dans
`/srv/sosese`.

---

## 5. Cas particuliers

### Préversion (tag hors de `main`)

Une version de démonstration peut être publiée depuis une autre branche avec un tag `vX.Y-suffixe`
(ex. `v0.9-v2-preview.1`, branche `codex/site-v2`), sans passer par `npm run release` : `git tag -a` puis
`git push origin <tag>` depuis la branche. Le déploiement se fait avec `deploy.sh <tag>` comme d'habitude.

`compose.yml` sur `main` ne désigne alors plus la production. Consigner l'écart dans `CHANGELOG.md` et le résorber au
déploiement suivant d'une version de `main`. Précédent : du 2026-09-21 au 2026-10-07, la production a tourné sur
`v0.9-v2-preview.1` alors que `main` indiquait `v0.8`, sans trace dans le dépôt ; découvert au premier `deploy.sh`.

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

Modifier `compose.yml` **dans le dépôt** (branche, PR, merge), puis le copier sur le VPS comme en 3.6
(`npm run release` le signale). `deploy.sh` ne modifie que la ligne `image:`.
Ne jamais éditer seulement la copie du VPS : le prochain `scp` écraserait la modification.

```bash
docker compose up -d
docker logs traefik --since 2m 2>&1 | grep -iE "sosese|error"
```

Vérifier immédiatement les autres services (3.6) : Traefik recharge à chaud, et un nom de routeur ou de middleware
en double écrase silencieusement un voisin. Tous les noms doivent commencer par `sosese`.

### Ajouter une question de FAQ

Un seul fichier Markdown dans `src/content/faq/` (voir `DESIGN.md`). La collection `exemples` a été supprimée
le 2026-09-18 avec la section qu'elle alimentait.

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
