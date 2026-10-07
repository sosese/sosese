#!/usr/bin/env bash
# Publie une version (RUNBOOK §2) : numéro de version, PR, merge, tag, suivi du build GitHub Actions.
# Usage, depuis la racine du dépôt, sur main à jour :  npm run release -- 0.9
# Ne touche jamais au VPS : la mise en production se fait ensuite avec scripts/deploy-vps.sh.
set -Eeuo pipefail

IMAGE="ghcr.io/sosese/sosese"
VPS="root@186.241.17.83"

rouge=$'\e[31m'; vert=$'\e[32m'; gras=$'\e[1m'; neutre=$'\e[0m'
etape()   { printf '\n%s▸ %s%s\n' "$gras" "$*" "$neutre"; }
ok()      { printf '%s✓ %s%s\n' "$vert" "$*" "$neutre"; }
arreter() { printf '%s✗ %s%s\n' "$rouge" "$*" "$neutre" >&2; exit 1; }
confirmer() {
  local reponse
  read -r -p "$1 [o/N] " reponse
  [[ $reponse =~ ^[oOyY]$ ]] || arreter "Arrêt demandé. $2"
}

# --- Contrôles préalables ---------------------------------------------------------------------------------

[[ ${1:-} =~ ^[0-9]+\.[0-9]+$ ]] || arreter "Usage : npm run release -- X.Y   (exemple : 0.9)"
num="$1"; version="$num.0"; tag="v$num"; branche="chore/$tag"

cd "$(git rev-parse --show-toplevel)"
for outil in git gh node npm; do command -v "$outil" >/dev/null || arreter "$outil introuvable."; done
gh auth status >/dev/null 2>&1 || arreter "gh n'est pas connecté : gh auth login"

etape "Contrôles"
[[ $(git branch --show-current) == main ]] || arreter "Se placer sur main : git checkout main"
[[ -z $(git status --porcelain --untracked-files=no) ]] || arreter "Modifications non commitées : committer ou git stash."
git fetch --quiet origin main --tags
git merge --quiet --ff-only origin/main 2>/dev/null || arreter "main a divergé d'origin/main."
[[ $(git rev-parse main) == $(git rev-parse origin/main) ]] \
  || arreter "main contient des commits non poussés ($(git rev-list --count origin/main..main)) : ils doivent passer par une PR."

git rev-parse -q --verify "refs/tags/$tag" >/dev/null && arreter "Le tag $tag existe déjà (un tag ne se republie jamais)."
[[ -z $(git ls-remote --tags origin "refs/tags/$tag") ]] || arreter "Le tag $tag existe déjà sur GitHub."
git ls-remote --exit-code --heads origin "$branche" >/dev/null && arreter "La branche $branche existe déjà sur GitHub."

actuel=$(node -p 'require("./package.json").version')
[[ $(printf '%s\n' "$actuel" "$version" | sort -V | tail -1) == "$version" && $actuel != "$version" ]] \
  || arreter "La version $version doit être supérieure à la version actuelle $actuel."
tag_prec=$(sed -nE "s#^ *image: $IMAGE:(v[0-9]+\.[0-9]+) *\$#\1#p" compose.yml)
[[ -n $tag_prec ]] || arreter "Ligne image: introuvable dans compose.yml."
ok "main à jour, $actuel ($tag_prec) → $version ($tag)"

# --- Numéro de version (RUNBOOK §2.4, piège 19 : jamais npm install) -------------------------------------

etape "Numéro de version sur la branche $branche"
git checkout --quiet -b "$branche"
node -e '
const fs=require("fs"), v=process.argv[1];
for (const f of ["package.json","package-lock.json"]) {
  const j=JSON.parse(fs.readFileSync(f,"utf8")); j.version=v; if (j.packages) j.packages[""].version=v;
  fs.writeFileSync(f, JSON.stringify(j,null,2)+"\n");
}' "$version"
sed -i "s#$IMAGE:$tag_prec#$IMAGE:$tag#" compose.yml

# Contrôle bloquant : exactement 3 fichiers, 4 lignes remplacées, uniquement des lignes de version.
annuler_branche() { git checkout --quiet -- . && git checkout --quiet main && git branch --quiet -D "$branche"; }
fichiers=$(git diff --name-only | LC_ALL=C sort | tr '\n' ' ')
lignes=$(git diff --numstat | awk '{a+=$1; s+=$2} END {print a"/"s}')
autres=$(git diff -U0 package.json package-lock.json | grep -E '^[-+] ' | grep -vcE '^[-+] +"version": "[0-9.]+",?$' || true)
if [[ $fichiers != "compose.yml package-lock.json package.json " || $lignes != "4/4" || $autres != 0 ]]; then
  git diff --stat
  annuler_branche
  arreter "Le diff de version touche autre chose que les numéros de version (piège 19) : rien n'a été commité."
fi
git diff --stat
ok "3 fichiers, 4 lignes, uniquement des numéros de version"

# --- Build ------------------------------------------------------------------------------------------------

etape "npm ci && npm run build"
empreinte=$(git hash-object package-lock.json)
npm ci --no-audit --no-fund || { annuler_branche; arreter "npm ci a échoué."; }
npm run build              || { annuler_branche; arreter "Le build a échoué."; }
[[ $(git hash-object package-lock.json) == "$empreinte" ]] \
  || { annuler_branche; arreter "npm ci a modifié package-lock.json."; }
ok "Build réussi"

read -r -p "Lancer le serveur de production local (http://localhost:3000) pour parcourir les pages ? [o/N] " r
if [[ $r =~ ^[oOyY]$ ]]; then
  echo "Ctrl+C pour arrêter le serveur et continuer."
  trap ':' INT; npm start || true; trap - INT
fi

# --- Commit, PR, merge ------------------------------------------------------------------------------------

etape "Commit, PR et merge"
read -r -p "Committer, pousser $branche et ouvrir la PR ? [o/N] " r
[[ $r =~ ^[oOyY]$ ]] || { annuler_branche; arreter "Arrêt demandé : version annulée, retour sur main."; }
git add package.json package-lock.json compose.yml
git commit --quiet -m "chore: version $version"
git push --quiet -u origin "$branche"
gh pr create --base main --head "$branche" --title "chore: version $version" \
  --body "Numéro de version seul : \`package.json\`, \`package-lock.json\` et le tag d'image de \`compose.yml\` ($tag_prec → $tag)."
confirmer "Merger la PR dans main ?" "La PR reste ouverte : la merger, puis relancer pour le tag (git tag -a $tag)."
gh pr merge "$branche" --merge --delete-branch
git checkout --quiet main
git pull --quiet --ff-only origin main
git branch --quiet -D "$branche" 2>/dev/null || true
[[ $(sed -nE "s#^ *image: $IMAGE:(v[0-9.]+) *\$#\1#p" compose.yml) == "$tag" ]] || arreter "compose.yml sur main ne désigne pas $tag."
ok "main contient la version $version"

# --- Tag et build GitHub Actions --------------------------------------------------------------------------

etape "Tag $tag"
read -r -p "Résumé de la version (une ligne) : " resume
confirmer "Créer et pousser le tag $tag ? (déclenche la publication de l'image)" "main est prêt : git tag -a $tag puis git push origin $tag."
git tag -a "$tag" -m "$tag — ${resume:-version $version}"
git push --quiet origin "$tag"
ok "Tag poussé"

etape "Build et test de démarrage sur GitHub Actions"
run=""
for _ in $(seq 1 30); do
  run=$(gh run list --workflow deploy.yml --branch "$tag" --limit 1 --json databaseId --jq '.[0].databaseId // empty')
  [[ -n $run ]] && break
  sleep 2
done
[[ -n $run ]] || arreter "Run GitHub Actions introuvable : suivre sur https://github.com/sosese/sosese/actions"
gh run watch "$run" --exit-status \
  || arreter "Build ou test de démarrage en échec : rien n'est publié. Le tag $tag est grillé ; corriger puis publier la version suivante."
ok "Image $IMAGE:$tag publiée"

# --- La suite -----------------------------------------------------------------------------------------------

autre=$(git diff "$tag_prec" "$tag" -- compose.yml | grep -E '^[-+] ' | grep -vE "^[-+] +image: " || true)
if [[ -n $autre ]]; then
  printf '\n%s⚠ compose.yml a changé au-delà du tag depuis %s :%s\n%s\n' "$rouge" "$tag_prec" "$neutre" "$autre"
  echo "  Le copier sur le VPS AVANT de déployer : scp compose.yml $VPS:/srv/sosese/compose.yml"
fi
cat <<EOF

${gras}Mise en production :${neutre}
  ssh $VPS
  /srv/sosese/deploy.sh $tag
EOF
