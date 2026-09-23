# Images de partage (Open Graph)

`public/og/accueil.png` et `public/og/realisation.png` (1200 × 630) sont des captures de ces gabarits, qui lisent
`src/styles/tokens.css` et les polices de `public/fonts`. Pour les régénérer après un changement de titre :

    google-chrome --headless=new --hide-scrollbars --allow-file-access-from-files --window-size=1200,630 \
      --virtual-time-budget=3000 --screenshot=public/og/accueil.png "file://$PWD/scripts/og/accueil.html"

Même commande pour `realisation`. Garder chaque PNG sous 150 ko.
