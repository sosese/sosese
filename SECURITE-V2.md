# Vérification avant publication — 21 septembre 2026

## Dépendances d’exécution

`@fastify/static` mis à jour de 8.3.x à **10.1.4** ; `nodemailer` de 7.0.x à **10.0.10**. Versions exactes et lockfile mis à jour par npm install. `npm audit --omit=dev` : **0 vulnérabilité signalée** après correction. Ce résultat n’est pas une garantie d’absence de toute faille.

Le callback setHeaders de Fastify Static reçoit désormais une réponse Fastify : utilisation de reply.header. Les tests couvrent à nouveau les routes V1/V2 et le SMTP simulé local (acceptation, rejet, absence de configuration, validation et anti-spam). Les usages raw, JSON transport, OAuth2, paramètres de transport fournis par les visiteurs et listing de répertoire ne sont pas activés dans ce projet ; les paquets concernés sont néanmoins corrigés.

Sources : https://github.com/fastify/fastify-static#compatibility ; https://github.com/advisories/GHSA-83w8-p2f5-377r ; https://github.com/advisories/GHSA-8pvw-jcv7-9cmj ; https://github.com/nodemailer/nodemailer/releases .

## Alertes restantes dans la chaîne de compilation

L’audit complet conserve trois paquets signalés : Astro (critique), sharp (élevée), esbuild (faible). Ces paquets sont des dépendances de développement et ne sont pas copiés dans l’étage final du Dockerfile (`npm ci --omit=dev`).

Le site est exporté statiquement : pas de serveur Astro en production, pas d’optimisation d’images à la demande, pas d’images AVIF/HEIC entrantes, pas de données visiteurs introduites dans le compilateur. Les sources ne contiennent pas de define:vars ni de server:defer. Les autres avis Astro concernent notamment des attributs/noms de slots ou directives issus d’entrées non fiables ; ici les sources compilées sont locales et maîtrisées. Le serveur de développement esbuild Windows n’est pas utilisé sur le VPS Linux.

Cette analyse limite l’exposition du déploiement actuel ; elle ne corrige pas ces outils. Ne pas exposer le serveur de développement ni traiter des contenus/images non fiables avec cette chaîne. Une migration majeure Astro et la mise à jour de ses outils restent à planifier séparément pour supprimer les alertes de build.

Sources : npm audit JSON obtenu lors de cette vérification ; https://github.com/advisories/GHSA-26w7-cxv4-gfx2 ; https://github.com/advisories/GHSA-rgj7-g3m4-5g8c ; https://github.com/advisories/GHSA-g7r4-m6w7-qqqr .
