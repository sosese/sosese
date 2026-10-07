#!/usr/bin/env bash
# Déploie une version publiée sur le VPS (RUNBOOK §3), avec retour automatique à la version précédente si le site
# ne répond pas. Exécuté par l'humain, sur le VPS uniquement. Installé sous /srv/sosese/deploy.sh (RUNBOOK §3.1).
#   /srv/sosese/deploy.sh v0.9      déployer
#   /srv/sosese/deploy.sh v0.8      rollback : même commande, tag précédent
# Ne touche qu'au projet sosese : aucune commande sans portée explicite (RUNBOOK §7).
set -Eeuo pipefail

DOSSIER="${SOSESE_DOSSIER:-/srv/sosese}"
IMAGE="ghcr.io/sosese/sosese"
CONTENEUR="sosese-web"
SITE="https://sosese.tech"
GARDER=3   # images taguées conservées après nettoyage, en plus de la version en ligne

rouge=$'\e[31m'; jaune=$'\e[33m'; vert=$'\e[32m'; gras=$'\e[1m'; neutre=$'\e[0m'
etape()   { printf '\n%s▸ %s%s\n' "$gras" "$*" "$neutre"; }
ok()      { printf '%s✓ %s%s\n' "$vert" "$*" "$neutre"; }
alerte()  { printf '%s⚠ %s%s\n' "$jaune" "$*" "$neutre"; }
arreter() { printf '%s✗ %s%s\n' "$rouge" "$*" "$neutre" >&2; exit 1; }

[[ ${1:-} =~ ^v[0-9]+\.[0-9]+$ ]] || arreter "Usage : deploy.sh vX.Y   (exemple : deploy.sh v0.9)"
tag="$1"
cd "$DOSSIER"
[[ -f compose.yml && -f .env ]] || arreter "compose.yml ou .env absent de $DOSSIER."

# Un seul déploiement à la fois.
exec 9>"$DOSSIER/.deploy.lock"
flock -n 9 || arreter "Un autre déploiement est en cours."

actuel=$(sed -nE "s#^ *image: $IMAGE:(v[0-9]+\.[0-9]+) *\$#\1#p" compose.yml)
[[ $(wc -w <<<"$actuel") == 1 ]] || arreter "Ligne image: introuvable ou en double dans compose.yml."

# --- Fonctions de vérification ------------------------------------------------------------------------------

attendre_sain() {
  local etat="" image=""
  for _ in $(seq 1 30); do
    image=$(docker inspect -f '{{.Config.Image}}' "$CONTENEUR" 2>/dev/null || true)
    etat=$(docker inspect -f '{{.State.Health.Status}}' "$CONTENEUR" 2>/dev/null || true)
    [[ $image == "$IMAGE:$1" && $etat == healthy ]] && return 0
    [[ $etat == unhealthy ]] && break
    sleep 3
  done
  echo "  conteneur : ${image:-absent}, santé : ${etat:-inconnue}"
  return 1
}

statut() { curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$1" || true; }

verifier_public() {
  local sante=""
  # Traefik met quelques secondes à router vers le nouveau conteneur.
  for _ in $(seq 1 10); do
    sante=$(curl -fsS --max-time 10 "$SITE/api/health" 2>/dev/null || true)
    [[ $sante == '{"ok":true}' ]] && break
    sleep 2
  done
  [[ $sante == '{"ok":true}' ]] || { echo "  $SITE/api/health : ${sante:-pas de réponse}"; return 1; }
  local s
  for page in / /contact; do
    s=$(statut "$SITE$page")
    [[ $s == 200 ]] || { echo "  $SITE$page : $s"; return 1; }
  done
  return 0
}

revenir() {
  trap - ERR
  alerte "Retour à $actuel"
  cp compose.yml.precedent compose.yml
  docker compose up -d
  if attendre_sain "$actuel" && verifier_public; then
    alerte "Rollback réussi : $actuel est en ligne. $tag n'est PAS déployé."
  else
    printf '%s✗ Le rollback lui-même ne répond pas : diagnostic manuel (RUNBOOK §6).%s\n' "$rouge" "$neutre" >&2
  fi
  echo "  Journaux : docker compose logs web --tail 100"
  exit 1
}

# --- Récupération de l'image (rien n'est modifié tant qu'elle n'est pas là) --------------------------------

etape "Image $IMAGE:$tag (en ligne : $actuel)"
[[ $tag == "$actuel" ]] && alerte "$tag est déjà la version indiquée dans compose.yml : le conteneur sera recréé si besoin."
docker pull --quiet "$IMAGE:$tag" >/dev/null \
  || arreter "Image $IMAGE:$tag introuvable : build GitHub Actions en échec, tag inexistant ou docker login ghcr.io manquant."
ok "Image récupérée"

# --- Mise à jour de compose.yml et redémarrage ----------------------------------------------------------------

etape "Déploiement"
cp compose.yml compose.yml.precedent
sed -i -E "s#^( *image: $IMAGE:)v[0-9]+\.[0-9]+( *)\$#\1$tag\2#" compose.yml
grep -q "image: $IMAGE:$tag" compose.yml || { cp compose.yml.precedent compose.yml; arreter "Remplacement du tag raté."; }
# --quiet obligatoire : sans lui, la sortie affiche les valeurs du .env (RUNBOOK §3.2).
docker compose config --quiet || { cp compose.yml.precedent compose.yml; arreter "compose.yml invalide : rien n'a été redémarré."; }

trap revenir ERR
debut=$(date -u +%Y-%m-%dT%H:%M:%SZ)
docker compose up -d
attendre_sain "$tag" || { echo "  le conteneur n'est pas passé à healthy"; revenir; }
ok "Conteneur $CONTENEUR healthy sur $tag"
verifier_public || revenir
ok "$SITE répond (/api/health, /, /contact)"
trap - ERR

# --- Vérifications non bloquantes ---------------------------------------------------------------------------
# Elles ne déclenchent pas de rollback : la cause est presque toujours extérieure à l'image (SMTP, voisins).

etape "Vérifications complémentaires"
smtp=""
for _ in $(seq 1 10); do
  smtp=$(docker compose logs --since "$debut" web 2>&1 | grep -oE 'SMTP : (connexion et authentification vérifiées|vérification échouée)|SMTP non configuré' | head -1 || true)
  [[ -n $smtp ]] && break
  sleep 2
done
case "$smtp" in
  *vérifiées) ok "$smtp" ;;
  "")         alerte "Aucune ligne SMTP dans les journaux : docker compose logs web" ;;
  *)          alerte "$smtp : le formulaire ne pourra pas envoyer (RUNBOOK §6)" ;;
esac

s=$(statut "https://www.sosese.tech/"); [[ $s == 301 ]] && ok "www → 301" || alerte "https://www.sosese.tech/ : $s (attendu 301)"
s=$(statut "https://traefik.sosese.tech/dashboard/"); [[ $s == 401 ]] && ok "Traefik → 401" || alerte "Traefik : $s (attendu 401)"
s=$(statut "https://mcp-extrabat.sosese.tech/health"); [[ $s == 200 ]] && ok "Extrabat → 200" || alerte "Extrabat : $s (attendu 200)"

# --- Nettoyage : uniquement les images sosese, jamais de prune global ---------------------------------------

etape "Nettoyage des anciennes images sosese"
anciennes=$(docker image ls "$IMAGE" --format '{{.Tag}}' | grep -E '^v[0-9]+\.[0-9]+$' | grep -vx "$tag" | sort -V | head -n -"$GARDER" || true)
if [[ -n $anciennes ]]; then
  for t in $anciennes; do docker image rm "$IMAGE:$t" >/dev/null && echo "  supprimée : $t"; done
else
  echo "  rien à supprimer"
fi
echo "  conservées : $(docker image ls "$IMAGE" --format '{{.Tag}}' | grep -E '^v' | sort -V | tr '\n' ' ')"

printf '\n%s%s en ligne%s (avant : %s). Rollback : %s %s\n' "$vert$gras" "$tag" "$neutre" "$actuel" "$0" "$actuel"
echo "Reste à faire : envoyer le formulaire depuis $SITE/contact et vérifier la réception."
