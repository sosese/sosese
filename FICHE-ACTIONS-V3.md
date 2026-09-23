# Fiche actions : ce qui dépend de toi

La V3 est prête sous `/v3` (branche `feat/site-v3`). Tout ce qui ne dépend que du code est fait.
Il reste ce que seul toi peux fournir ou décider. Les actions sont **classées par impact** : la 1 rapporte le plus.

Où remplir : `src/config/site.ts`. Une valeur à `null` n'apparaît pas sur le site. Une fois remplie, elle s'affiche
toute seule au bon endroit. `npm run dev` montre en orange chaque emplacement encore vide.
Les valeurs entre guillemets ci-dessous sont des **exemples de format**, pas des recommandations.

## A. Avant de montrer la V3 à qui que ce soit

| # | Action | Pourquoi | Où / format | Temps |
|---|---|---|---|---|
| 1 | **Relire la V3 et confirmer les engagements repris de la V1** : « atelier sous 15 jours », « 2 jours / 1 semaine / 4 semaines », « une demi-journée avec vos équipes », « sur place autour de Metz ou à distance », « code et accès à votre nom » | Ce sont des promesses publiques. Si l'une n'est plus tenable, elle doit changer avant diffusion | `src/config/editorial.ts` (`etapes`), `src/config/faq.ts` | 30 min |
| 2 | **Donner ta fourchette de prix** : prix de l'atelier + feuille de route, fourchette d'une première automatisation, frais d'usage mensuels types, diagnostic déduit ou non | Levier n° 1 de conversion (NN/g). Sans prix, le site affiche seulement le *format* (devis ferme par étape) | `prix.diagnostic` : `"450 € HT"` · `prix.premiereAutomatisation` : `"entre 2 000 et 5 000 € HT"` · `prix.fraisUsage` : `"environ 20 € par mois"` · `prix.diagnosticDeduit` : `true` / `false` | 15 min |
| 3 | **Obtenir de Jason** : (a) une phrase sur ce qui a changé, avec accord écrit ; (b) son rôle exact ; (c) le mois de mise en service ; (d) sur combien de devis et quelle période les 40 → 2 min ont été relevés ; (e) le sens de « 3 rapports d'analyse annuels » | C'est ta seule preuve. Une citation signée et un protocole clair valent plus que tout le reste du texte | `casClient.citation` (mot pour mot, 15-30 mots) · `casClient.role` · `casClient.miseEnService` : `"août 2026"` · `casClient.protocole` : `"sur 12 devis de pose, en septembre 2026"`. Accord écrit archivé **hors dépôt** | 1 échange |
| 4 | **Photo et une phrase de parcours** | On achète une personne. NN/g : les vraies photos rassurent, jamais une photo générée | Portrait réel, format 4:5, dans `public/equipe/joris.webp` → `personne.photo` : `"/equipe/joris.webp"` · `personne.parcours` : `"Je viens de …"` (vérifiable sur LinkedIn) | 1 h |
| 5 | **Délai de réponse que tu tiens toujours, et téléphone si tu l'acceptes** | L'artisan préfère souvent appeler. Un délai annoncé rassure sous chaque bouton | `delaiReponse` : `"sous 48 h ouvrées"` · `telephone` : `"06 12 34 56 78"` | 5 min |

## B. Pour publier la V3 sur `sosese.tech/v3`

| # | Action | Détail |
|---|---|---|
| 6 | **Tester le titre auprès de 5 dirigeants de ton réseau** | Montre le haut de `/v3` 5 secondes sur ton téléphone. Demande : « C'est quoi ? Pour qui ? Vous feriez quoi ensuite ? » Si l'angle « terrain » fait fuir des non-artisans que tu vises, dis-le moi : je bascule sur l'option B du rapport (« Vos logiciels ne se parlent pas. Je les relie. ») |
| 7 | **Autoriser push, PR et tag**, puis déployer | Procédure complète dans `V3-LOCAL.md`. Tag proposé : `v0.10-v3-preview.1`. Le déploiement ne change ni la V1 (racine) ni la V2 |

## C. Juste après la mise en ligne

| # | Action | Pourquoi |
|---|---|---|
| 8 | **Partager le lien de la page Réalisation** (`/v3/realisations/atelier-sols-fils`) à 3 contacts, comme une recommandation, et leur demander ce qu'il leur manque pour appeler | Ton canal est le bouche-à-oreille. Cette page a sa propre image de partage |
| 9 | **Tenir un journal des contacts** (tableur) : date, canal, tâche citée, logiciel, suite donnée. Poser à chaque premier rendez-vous : « Qu'est-ce qui vous a décidé à m'écrire ? » et « Qu'est-ce qui a failli vous en empêcher ? » | C'est la seule mesure fiable à ton volume. Le modèle de mail demande déjà « comment j'ai connu sosese » |
| 10 | **Créer une fiche Google Business Profile** (Metz, zone 80 km) | Un prospect recommandé tape souvent « sosese Metz » |

## D. Avant de faire de la V3 la page d'accueil (plus tard)

| # | Action | Pourquoi |
|---|---|---|
| 11 | **Mentions légales et politique de confidentialité** : 11 champs « à compléter », et une politique qui décrit un formulaire que la V3 n'a plus | Bloquant avant toute diffusion large (Stanford : « montrer qu'il y a une vraie organisation »). Chantier juridique séparé, comme tu l'as demandé |
| 12 | **Écrire la fiche « données » du cas livré** : service d'IA et région, ce qui est conservé et combien de temps, à qui sont les clés, comment couper l'accès | La page Accompagnement promet ces réponses dans la feuille de route. Les avoir prêtes pour le prestataire informatique d'un prospect |
| 13 | **Éditeurs** : lister les formes de collaboration que tu proposes vraiment (prestation, partenariat, diffusion), et te renseigner sur les conditions d'entrée de la place de marché Extrabat, **sans annoncer de partenariat** | La page Éditeurs reste volontairement ouverte tant que ce n'est pas décidé |
| 14 | **Demander la bascule** : V3 à la racine, redirections des anciennes adresses, retrait du `noindex`, `robots.txt` et `sitemap.xml` | Une évolution dédiée, décrite en fin de `V3-LOCAL.md` |

## À savoir

- La V1 en production garde un bloc « à compléter : second visuel de "Sous le capot" » visible sur l'accueil. Le déploiement de la V3 n'y touche pas. Si la bascule doit attendre plus de deux semaines, demande la correction de la V1 (ticket V1-FIX-01 du rapport).
- Tout ce que la V3 affiche vient de la V1/V2 publiées ou de ce rapport. Aucun chiffre, prix ou fait nouveau n'a été inventé : ce qui manque est vide, pas deviné.
