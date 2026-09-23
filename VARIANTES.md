# Quatre pistes à comparer : V3, V4, V5, V6

Toutes partagent les mêmes faits (cas L'Atelier des Sols & Fils, durées et engagements de la V1, Metz + 80 km),
les mêmes valeurs à compléter (`src/config/site.ts`), le même contact par email. Elles diffèrent par **à qui
elles parlent** et **comment**. Aucune n'invente de chiffre, de prix ou de fait.

| | V3 — terrain, site complet | V4 — « Vos logiciels ne se parlent pas » | V5 — l'assistant de devis, bâtiment | V6 — la lettre |
|---|---|---|---|---|
| Rapport | Option A (§3.4.1) | Option B + alternatives de Dunford | Option C poussée : offre produit | Hors rapport : voix personnelle, page unique |
| Cible | Entreprises de terrain | Indépendants, TPE, PME de tous métiers | Artisans et entreprises du bâtiment, utilisateurs d'Extrabat d'abord | Dirigeant recommandé, qui lit sur son téléphone |
| Titre | Dictez le devis sur le chantier. Retrouvez-le prêt dans votre logiciel. | Vos logiciels ne se parlent pas. Je les relie. | Dictez le devis sur le chantier. Il est dans Extrabat avant votre retour. | Bonjour. Vous tapez sans doute deux fois les mêmes choses. |
| Structure | 6 pages | 1 page, problème → preuve → alternatives | 1 page produit : ce qu'il fait, démo, ce qui est compris | 1 lettre signée |
| Nouveauté | Socle | Filtre « pour vous / pas pour vous », tableau « plutôt que… » qui dit quand une autre option est meilleure | Chiffres en bandeau, liste de ce qui est compris, FAQ d'artisan | Calculateur « avec vos chiffres », « ce que je promets / ne promets pas », aucun îlot React |
| Visuels | Vrac → actions (hero) | Labo A2 « Du chaos au Oui », A4 « Une règle » | Labo A8 « Terrain ↔ bureau », démo d'une visite | Labo A6 « Avant / après » (sans JS) |
| Force attendue | Équilibre, complet | Parle au plus grand nombre, très honnête | Le plus concret et le plus mémorable pour sa cible | Le plus humain, le plus léger, le plus lisible sur mobile |
| Risque | Peut exclure les non-artisans | Titre moins falsifiable, cible large = moins de pouvoir de recommandation | Exclut tout ce qui n'est pas bâtiment ; dépend de l'image d'Extrabat | Moins « professionnel » pour certains ; pas de structure à parcourir |

## Comment les comparer (sans statistiques d'audience)

1. **Test des 5 secondes**, 5 à 8 dirigeants du réseau, chacun voit **deux** variantes dans un ordre différent :
   « De quoi ça parle ? Pour qui ? Vous feriez quoi ensuite ? » Noter les mots employés.
2. **Test de recommandation** : envoyer le lien d'une variante comme si c'était une recommandation. Demander ce
   qui manque pour écrire.
3. **Question décisive** : « Laquelle donneriez-vous à un collègue ? » C'est le canal principal.
4. Retenir **une** direction, puis fusionner : les meilleures sections des autres variantes sont réutilisables
   telles quelles (même socle de composants).

## Adresses

Local : `npm run build && PORT=4330 npm start`, puis `/v3/`, `/v4/`, `/v5/`, `/v6/`. En ligne après déploiement :
`https://sosese.tech/v3/` … `/v6/` (non indexées).
