# Revue sosese v0.5 → cadrage v2

> Document de cadrage. Entrée attendue : ce fichier + `DESIGN.md` + `CLAUDE.md` + `guide_copywriting_prompts_llm.md`.
> Sortie attendue : une roadmap de développement versionnée (v0.6 → v1.0), pas une refonte en un seul lot.
> Rédigé le 2026-09-16 sur la base du code à `a22870a` et de la production `v0.5` (vérifiée par requêtes HTTP publiques).
>
> **Mis à jour le 2026-09-16** avec trois décisions humaines, reportées dans `DESIGN.md` (« Décisions ») :
> **(1)** cible principale = **PME de 1 à 50 salariés**, sans fermer la porte aux structures plus grandes ;
> **(2)** budget JS porté à **150 ko gzip** sur l'accueil, à objectif de chargement inchangé et bibliothèques
> très légères uniquement ; **(3)** les visuels sont des **schémas SVG**, pas des images. Les items concernés
> (B1, C4, C5, C11, E1) et les §4, §8, §9 ont été récrits en conséquence.

---

## 0. Mode d'emploi pour le LLM qui produit la roadmap

1. Chaque item porte un **ID stable** (`A1`, `C4`…). Utiliser ces IDs dans la roadmap, les branches (`feat/c4-calculateur`) et les commits.
2. Un item marqué **🔒 bloqué** attend une donnée ou une décision humaine (§7 et §8). Ne jamais inventer la valeur manquante : c'est une règle dure du projet (`null` = « à compléter »).
3. Les **critères d'acceptation** de chaque item sont opposables : un item n'est fini que s'ils sont tous vrais, **plus** le contrat de fin de tâche de `CLAUDE.md`.
4. Le §9 (contraintes non négociables) doit être recopié dans tout prompt de génération de contenu ou de composant. Il prime sur toute suggestion de ce document.
5. Ne pas traiter le §5 (backlog) comme un ordre d'exécution : l'ordre est au §10.

---

## 1. État des lieux mesuré

### 1.1 Volume de texte (page d'accueil rendue, `dist/index.html`)

| Section | Mots rendus | Forme dominante |
|---|---:|---|
| Hero | 138 | titre + chapeau + terminal animé |
| Engagements | 39 | 7 libellés mono |
| Problème | 123 | 3 cartes de texte |
| Méthode | 147 | 3 cartes + 3 listes de définitions |
| Offre (bento) | 150 | 3 cartes + 1 schéma de flux |
| Exemples | 282 | 5 cartes Avant/Après + 1 carte CTA |
| Cas client | 335 | 2 cartes + 3 chiffres + 1 démo animée |
| Sous le capot | 141 | 1 schéma statique + 6 blocs mono |
| Confiance | 126 | 4 cartes à icône |
| FAQ | 354 | 8 accordéons (repliés) |
| CTA final | 71 | titre + chapeau + bouton |
| **Total** | **1 910** | dont ~1 556 visibles sans déplier la FAQ |

### 1.2 Densité de formes

- **24 cartes bordées** contenant titre + paragraphe gris, réparties sur 6 sections.
- **4 éléments visuels réellement porteurs d'information** : `TerminalDemo`, `FlowDiagram` (4 étapes), `DicteeChiffrageDemo`, schéma d'intégration de « Sous le capot ».
- **4 icônes SVG** (section Confiance), décoratives, sans contenu informatif.
- Aucune image bitmap sur tout le site. Aucune requête tierce.

### 1.3 Qualité rédactionnelle brute

- Longueur moyenne des phrases : **9,6 mots** (cible du guide : < 15). **Le texte n'est pas verbeux au niveau de la phrase.**
- 9 phrases > 20 mots, 4 > 25 mots. Les 3 plus longues : chapeau du cas client (40 mots), chapeau du hero (32), carte « peur de l'erreur » (30).
- Charte lexicale du guide : **respectée**. Aucun terme proscrit (« révolution IA », « plateforme », « disruptif »). Jargon confiné à « Sous le capot », conformément au cahier des charges.
- Adresse directe « vous » + « on » : cohérente sur tout le site, ton juste pour la cible.

**Conclusion de diagnostic** : le problème de « bavardage » n'est **pas** un problème de copywriting au niveau de la phrase. C'est un problème de **redondance inter-sections** et de **monotonie de forme** (§3).

### 1.4 Redondance des messages (mesurée par recherche dans les sources)

Quatre promesses portent à elles seules l'essentiel du volume, chacune répétée dans 4 à 6 endroits :

| Promesse | Occurrences |
|---|---|
| « aucune écriture sans votre accord » / validation humaine | Engagements, Bento, Cas client (chiffre 100 %), Sous le capot (2×), Confiance, FAQ `fiabilite-prix` |
| « le code et les accès vous appartiennent » | Engagements, Bento, Confiance, À propos |
| « sans changer vos outils / aucun nouveau logiciel » | Hero, Engagements, Bento, CTA final, Footer, FAQ `logiciels` |
| « feuille de route chiffrée » | Engagements, Méthode, Bento, Sous le capot, À propos, FAQ `cout`, FAQ `delais` |

Chaque répétition est bien écrite, mais le lecteur qui déroule la page lit **quatre fois la même chose sous quatre formes différentes**. C'est la première source de fatigue, avant toute considération d'illustration.

### 1.5 État vérifié en production (2026-09-16, `https://sosese.tech`)

| Contrôle | Résultat |
|---|---|
| `/mentions-legales` | **8 champs sur 10 affichent « à compléter »** (raison sociale, forme juridique, siège, SIRET, RCS, TVA, directeur de publication, hébergeur) |
| `/robots.txt` | **404** |
| `/sitemap.xml` | **404** |
| Balises `og:*` / `twitter:*` | **aucune** sur la page d'accueil |
| JSON-LD | `FAQPage` uniquement — pas d'`Organization`, pas de `Service` |
| Section « personne » de `/a-propos` | masquée en production (`personne = null`) : **aucun humain identifié sur tout le site** |
| Zone d'intervention | non renseignée |
| Mesure d'audience | **aucune** — aucun KPI du guide n'est actuellement calculable |
| Performance | Lighthouse 100/100/100/100, CLS 0, ~74 ko de JS (plafond porté à 150 ko, voir §4) — **acquis à préserver** |

---

## 2. Écarts par rapport au guide de copywriting

| # | Attendu par le guide | État actuel | Gravité |
|---|---|---|---|
| G1 | Hero < 11 mots, BAB, promesse chiffrée | Titre à 8 mots, contraste présent, **promesse non chiffrée** (aucun « X h par semaine ») | Moyenne |
| G2 | CTA à la 1re personne + réducteur de friction sous le bouton | « Parlons-en », **sans sous-texte**, partout | **Haute** |
| G3 | Bandeau de preuve sociale haut de page (logos outils, métriques) | Bandeau de 7 engagements **abstraits**, aucun logo, aucun chiffre | **Haute** |
| G4 | PAS avec **calcul du temps perdu** | Section Problème descriptive, aucun chiffrage du coût de l'inaction | **Haute** |
| G5 | Voix du client (verbatim) | **Aucune citation** sur tout le site | **Haute** |
| G6 | 4 Ps sur le bloc de fermeture (Picture, Promise, **Prove**, Push) | CTA final = Picture + Promise + Push. **Aucune preuve à proximité** | Moyenne |
| G7 | FAB sur les blocs de service | Bento = Feature + Benefit, l'**Advantage** (pourquoi ça marche) est absent | Basse |
| G8 | Signal de prix / d'engagement | FAQ « Combien ça coûte ? » répond « ça dépend » — réponse la plus coûteuse en B2B TPE/PME | **Haute** |
| G9 | Persona explicite | **Tranché** : 1–50 salariés, aligné sur le guide. Le site (`/a-propos`) annonce encore « 15 à 150 personnes » : écart à corriger (B1) | **Haute** |
| G10 | KPI : conversion, scroll depth, CTR, qualité des leads | Aucun instrument de mesure | **Haute** |
| G11 | A/B testing | Impossible en l'état (site statique, un seul artefact déployé) | Basse |

Points **conformes** à ne pas « corriger » : charte lexicale, longueur des phrases, absence de superlatifs, honnêteté des chiffres (les exemples sont explicitement illustratifs), confinement du jargon.

---

## 3. Diagnostic « site bavard » : causes réelles

1. **Redondance** (§1.4) : 4 messages × 4 à 6 répétitions ≈ 350 à 450 mots redondants sur 1 556.
2. **Monotonie de forme** : 24 cartes identiques. Le cerveau du lecteur cesse de distinguer les sections, donc relit tout ou décroche. C'est la cause principale de l'impression de densité, davantage que le nombre de mots.
3. **Le texte fait le travail du visuel** : « 40 minutes le soir » contre « 2 minutes sur le chantier » est une **comparaison de grandeurs** écrite en 4 puces au lieu d'être montrée en deux barres. Idem pour la méthode (3 étapes, 6 semaines = une frise), pour la journée type, pour le circuit de validation.
4. **Onze sections** en enfilade, sans hiérarchie de poids : le cas client (preuve la plus forte du site) arrive en 7e position, après 5 sections d'affirmations.
5. **Aucune divulgation progressive** hors FAQ : tout le détail est exposé d'emblée, y compris ce qui n'intéresse que 10 % des visiteurs (« Sous le capot »).

**Cible chiffrée v2** : 1 556 mots visibles → **≤ 1 000** (−35 %), à qualité d'argumentation constante, en transférant la charge sur des schémas porteurs d'information — pas en supprimant des arguments.

---

## 4. Doctrine « Show don't tell » pour sosese

Le cahier des charges pose déjà la règle : **« le geek est dans le visuel, jamais dans le vocabulaire »**. La v2 l'applique littéralement. Trois registres visuels **et pas un de plus** — toute proposition hors de ces trois registres doit être refusée :

| Registre | Ce qu'il montre | Technique imposée | Existant à réutiliser |
|---|---|---|---|
| **R1 — Schéma de flux** | un enchaînement d'étapes, une direction, un point de contrôle | SVG en ligne + CSS, dimensions fixes, labels mono | `FlowDiagram.astro`, schéma de « Sous le capot » |
| **R2 — Mockup stylisé** | à quoi ressemble le résultat, sans capture d'écran réelle | Astro/React + tokens, jamais d'image bitmap, jamais de logo tiers dedans | `TerminalDemo`, `DicteeChiffrageDemo` |
| **R3 — Comparaison de grandeurs** | un écart chiffré (temps, volume, coût) | barres / jauges en CSS pur, largeur proportionnelle, valeur toujours écrite à côté | chiffres du cas client (à transformer) |

Règles transversales :

- **Un schéma remplace du texte, il ne s'y ajoute pas.** Tout nouveau visuel doit venir avec le nombre de mots qu'il supprime. Sinon il aggrave le problème.
- **Aucune illustration décorative**, aucune imagerie IA (rappel : anti-pattern déclaré dans `DESIGN.md`).
- **État final rendu côté serveur**, animation en enrichissement seulement (même contrat que `TerminalDemo` et `DicteeChiffrageDemo`). Zéro CLS, lisible sans JS.
- **Budget JS : 150 ko gzip** sur l'accueil (décision du 2026-09-16, contre 100 ko au cahier des charges), dont ~74 ko consommés. **Le plafond monte, l'objectif ne change pas** : LCP < 1,8 s, CLS 0, Lighthouse 100. Les 76 ko dégagés sont une marge, pas une enveloppe à dépenser. En pratique, les nouveaux visuels restent **en Astro + SVG + CSS** : un schéma n'a besoin d'aucun JS, et le JS le moins coûteux est celui qu'on n'écrit pas. Toute bibliothèque envisagée doit peser **< 10 ko gzip**, ne tirer aucune dépendance transitive, et être justifiée par un gain que ni le CSS ni quelques lignes de JS natif ne produisent.
- **Images : aucune.** Tout visuel est un schéma SVG en ligne ou un mockup construit avec les tokens. Deux exceptions prévues sur tout le site : le portrait de `/a-propos` (A2) et l'image de partage Open Graph (A3), toutes deux via `astro:assets`, dimensions déclarées. Un SVG en ligne se thème avec `currentColor` dans les deux thèmes, pèse quelques centaines d'octets, reste net à tout zoom et se met à jour avec le contenu : aucun bitmap n'offre cela.
- **Accessibilité** : tout schéma porte un équivalent textuel (`aria-label` ou `sr-only`), les couleurs ne portent jamais seules l'information, et l'animation reste sous `prefers-reduced-motion` (l'exception « terminal » ne s'étend à rien d'autre).

---

## 5. Backlog

Format : `ID — titre` · priorité · effort (S/M/L) · fichiers · critères d'acceptation.

### Bloc A — Crédibilité et conformité (à traiter en premier, indépendant du reste)

**A1 — Mentions légales réelles** · P0 · S · 🔒
`src/config/site.ts` (`legal`)
Aujourd'hui, 8 champs sur 10 affichent « à compléter » **en production**. Un visiteur B2B qui vérifie l'identité du prestataire avant un premier contact y lit qu'il n'y en a pas. C'est aussi une obligation légale (LCEN art. 6-III).
*Acceptation* : plus aucun `<ACompleter>` rendu sur `/mentions-legales` en production ; aucun `console.warn` de champ manquant au build.

**A2 — Identifier la personne** · P0 · S · 🔒
`src/config/site.ts` (`personne`), `src/pages/a-propos.astro`
Un studio d'automatisation vendu à des dirigeants de TPE/PME se choisit sur une personne. Le bloc existe déjà et est masqué faute de contenu.
*Acceptation* : photo (AVIF/WebP via `astro:assets`, dimensions déclarées), nom, rôle, bio de 2 à 3 paragraphes ; section visible en production ; JSON-LD `Person` lié à l'`Organization` (A5).

**A3 — Métadonnées de partage (Open Graph / Twitter Card)** · P0 · S
`src/layouts/Base.astro`, `public/og/*`
Un lien sosese.tech partagé sur LinkedIn, WhatsApp ou par e-mail s'affiche aujourd'hui **sans titre, sans description, sans image**. Pour un studio dont la distribution passe par LinkedIn et le bouche-à-oreille, c'est le défaut le plus coûteux du site après A1.
*Acceptation* : `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (1200×630, hébergée en propre, < 150 ko), `og:locale=fr_FR`, `twitter:card=summary_large_image` sur toutes les pages ; image dérivée des tokens (fond `--bg`, wordmark, accroche), pas une capture ; vérifié sur les 6 pages.

**A4 — `robots.txt` et `sitemap.xml`** · P0 · S
`public/robots.txt`, intégration `@astrojs/sitemap` ou génération manuelle
Les deux renvoient 404 en production. `/404` reste en `noindex`.
*Acceptation* : `sitemap.xml` listant les 5 pages indexables ; `robots.txt` pointant le sitemap ; aucune requête tierce ajoutée.

**A5 — JSON-LD `Organization` + `Service`** · P1 · S
`src/layouts/Base.astro`
Seul `FAQPage` existe. `Organization` (nom, URL, logo, e-mail, `areaServed`) et `Service` consolident l'éligibilité aux résultats enrichis.
*Acceptation* : JSON-LD valide (Rich Results Test) ; aucune donnée inventée — les champs non fournis sont omis, jamais remplis au jugé.

**A6 — Verbatim du client réel** · P1 · S · 🔒
`src/components/sections/CasClient.astro`
Le guide identifie la voix du client comme le levier le plus puissant ; le site n'a **aucune citation**. Le cas L'Atelier des Sols & Fils est déjà couvert par un accord (piège 17 de `DESIGN.md`) : il manque 2 phrases signées.
*Acceptation* : citation de 15 à 30 mots, attribuée (prénom + rôle + entreprise), accord écrit archivé hors dépôt ; aucune donnée de client final ; rendu typographique dédié (pas une carte de plus).

**A7 — Zone d'intervention** · P2 · S · 🔒
`src/config/site.ts` (`zoneIntervention`) — affichée sur `/contact`, aujourd'hui masquée. Alimente aussi `areaServed` (A5).

### Bloc B — Conversion et copywriting

**B1 — Aligner le site sur la cible retenue : PME de 1 à 50 salariés** · P0 · M — *décidé le 2026-09-16*
`src/pages/a-propos.astro` (ligne 36 : « de 15 à 150 personnes »), `src/config/site.ts`, chapeaux de sections
La cible est tranchée : **PME de 1 à 50 salariés en priorité, sans fermer la porte aux structures plus grandes** — celles-ci restent accueillies, mais le site ne leur parle pas en premier. Le site dit encore l'inverse : `/a-propos` annonce 15–150 personnes, et plusieurs formulations visent implicitement une entreprise dotée d'un service informatique.
Conséquences concrètes sur la rédaction :
- vocabulaire du dirigeant qui fait le travail lui-même, pas du responsable informatique : ni « conduite du changement », ni « gouvernance », ni « service IT » ;
- l'eyebrow « Pour votre responsable informatique » de « Sous le capot » ne correspond plus à la cible — dans une entreprise de 12 personnes, c'est le dirigeant ou son prestataire informatique qui lit cette section. À reformuler (« Pour qui veut regarder sous le capot », ou équivalent) ;
- les échelles chiffrées descendent : un atelier de 2 jours et une construction de 4 semaines restent crédibles à 40 salariés, beaucoup moins à 5. Vérifier que l'offre décrite reste cohérente avec le bas de la fourchette (§8, arbitrage 8) ;
- la porte ouverte aux structures plus grandes s'exprime **une fois**, sobrement (par exemple dans la FAQ), jamais en tête de page : une cible qui s'excuse ne convainc personne.
*Acceptation* : une seule formulation de cible dans tout le dépôt, définie dans `src/config/site.ts` et réutilisée ; aucune formulation supposant un service informatique interne ; le prompt système (§6) reprend la cible mot pour mot ; décision déjà consignée dans `DESIGN.md`.

**B2 — Hero : promesse chiffrée + CTA complet** · P1 · S
`src/components/sections/Hero.astro`, `src/config/site.ts` (`cta`)
Conserver le titre actuel (8 mots, contraste BAB déjà là). Ajouter : (a) un chiffre vérifiable dans le chapeau, tiré du cas client réel, pas d'une moyenne inventée ; (b) un libellé de CTA à la 1re personne ; (c) un réducteur de friction sous le bouton.
Exemple de cible, **à valider** avant écriture : CTA « Demander mon diagnostic », sous-texte « Premier échange de 30 min · sans engagement · réponse sous 48 h ».
⚠️ Ne pas écrire « audit gratuit » : l'atelier sosese est une prestation de 2 jours facturée. Le seul élément gratuit est le premier échange. Toute promesse de délai (« sous 48 h ») doit être tenable et validée par l'humain.
*Acceptation* : chapeau du hero ≤ 25 mots ; sous-texte présent sous le CTA principal du hero, du CTA final et du bouton flottant mobile ; aucune promesse non validée.

**B3 — Système de CTA unifié** · P1 · S
`src/config/site.ts`, `Button.astro`, `MobileCta.astro`, `CtaFinal.astro`, carte CTA de `Exemples.astro`
Le site a 5 points de conversion avec 3 formulations différentes et aucun réducteur de friction.
*Acceptation* : un seul couple libellé/sous-texte défini dans `site.ts` et consommé partout ; le sous-texte reste lisible en thème sombre et sur `.section-invert`.

**B4 — Preuve au-dessus de la ligne de flottaison** · P1 · M
`Engagements.astro` (à transformer), `Hero.astro`
Remplacer 7 engagements abstraits par : **1 chiffre du cas réel + les outils réellement connectés + 3 engagements maximum**. Le reste des engagements est redistribué (B8) ou supprimé.
*Acceptation* : la première hauteur d'écran contient au moins un élément factuel vérifiable (chiffre mesuré ou nom d'outil réel) ; ≤ 40 mots ; pas de débordement horizontal à 360/640/1024/1280 px (piège 12).

**B5 — Preuve à proximité du CTA final (4 Ps)** · P2 · S
`CtaFinal.astro`
Ajouter le verbatim (A6) ou les 3 chiffres du cas client juste avant le bloc de fermeture.
*Acceptation* : la preuve est reprise, pas dupliquée en nouveau texte ; le titre du CTA final cesse de recopier mot pour mot celui du hero (voir aussi le commentaire `aria-label` existant).

**B6 — Signal de prix** · P1 · S · 🔒
`src/content/faq/cout.md`, éventuellement une section « Budget »
« Ça dépend » est la réponse la plus coûteuse en TPE/PME : elle est lue comme « c'est cher » et fait partir le prospect. Trois options honnêtes, par ordre de préférence : (1) prix ferme affiché pour l'atelier + feuille de route ; (2) fourchette « de X à Y € » pour une première automatisation ; (3) à défaut, **le format** du prix (forfait par étape, pas de régie, pas d'abonnement) — ce qui rassure déjà beaucoup sans engager un montant.
*Acceptation* : la FAQ « Combien ça coûte ? » donne au moins un ordre de grandeur ou un format d'engagement ; aucun montant inventé.

**B7 — Objections manquantes dans la FAQ** · P2 · S
`src/content/faq/*.md`
Absentes aujourd'hui, et systématiquement posées : (a) durée d'engagement et conditions d'arrêt ; (b) continuité si le studio disparaît ou devient indisponible (dépendance à une personne — objection majeure face à un studio de petite taille) ; (c) qui détient les accès et les clés d'API, et comment on les révoque ; (d) ce qui se passe quand un outil change d'API.
*Acceptation* : 3 à 4 nouvelles entrées, une réponse de 2 paragraphes maximum chacune, `ordre` recalculé pour classer les questions par force d'objection (coût, délai, données, dépendance en tête).

**B8 — Déduplication des 4 promesses** · P1 · M — **le gain de volume le plus important, sans rien perdre**
Toutes les sections + `src/content/`
Attribuer à chaque promesse **un lieu canonique unique** et supprimer les autres occurrences, ou les réduire à un renvoi :

| Promesse | Lieu canonique proposé | À retirer de |
|---|---|---|
| Validation humaine | schéma « qui décide quoi » (C8) | Engagements, Bento, Sous le capot, chapeau Confiance |
| Propriété du code | Confiance (1 carte) | Engagements, Bento, À propos |
| Sans changer d'outils | Hero (titre) + bandeau outils (C5) | Bento, CTA final, Footer |
| Feuille de route chiffrée | Méthode (frise C2) | Engagements, Bento, À propos |

*Acceptation* : chaque promesse apparaît **une fois** en argument développé (des rappels d'un ou deux mots restent permis) ; total de la page ≤ 1 000 mots hors FAQ ; aucun argument perdu (vérifier par comparaison des deux listes d'arguments avant/après).

**B9 — Friction du formulaire** · P2 · S
`shared/contact.json`, `ContactForm.tsx`
Cinq champs obligatoires (nom, société, e-mail, secteur, consentement) sur une première prise de contact. « Société » et « secteur » se déduisent souvent d'un échange. À arbitrer entre qualification des leads et taux de complétion : recommandation, passer **« secteur » en facultatif** et mesurer (D1) avant d'aller plus loin.
*Acceptation* : toute règle modifiée l'est dans `shared/contact.json` uniquement (jamais un seul des deux côtés) ; le message de confirmation annonce le délai de réponse (aligné sur B2).

### Bloc C — Show don't tell

**C0 — Socle technique des schémas** · P1 · M — **prérequis de C1 à C8**
Nouveau dossier `src/components/ui/diagrams/`, mise à jour de `DESIGN.md`
Créer les primitives partagées : conteneur de schéma (légende, `aria-label`, ratio fixe), échelle de barres, styles de nœuds et de liaisons, animation au défilement avec état final en SSR.
*Acceptation* : un schéma s'écrit en ≤ 20 lignes dans une section ; zéro CLS mesuré ; rendu correct sans JS ; conforme dans les deux thèmes **et** sur `.section-invert` ; documenté dans `DESIGN.md` dans le même tour (règle du projet).

**C1 — « 40 min → 2 min » en barres** · P1 · S — *remplace ~120 mots*
`CasClient.astro`
Deux barres de longueur proportionnelle (40 min / 2 min), légendées « le soir, au bureau » et « sur le chantier ». Le contenu des deux cartes Avant/Après passe de 8 puces à 2 lignes.
*Acceptation* : rapport de longueurs exact (1/20) ; valeurs écrites en toutes lettres à côté des barres ; section Cas client ≤ 200 mots (contre 335).

**C2 — Frise de la méthode** · P1 · M — *remplace ~80 mots*
`Methode.astro`
Frise horizontale S0 → S6 : 3 jalons (Atelier 2 j · Feuille de route 1 sem. · Construction 4 sem.), et **en dessous, une seconde bande « votre temps »** proportionnelle (2 j / 1 h / 1 h par semaine). Le contraste visuel entre les deux bandes fait l'argument : le projet dure 6 semaines, le client y consacre quelques heures. Aujourd'hui, cet argument est enfoui dans trois listes de définitions.
*Acceptation* : verticale sous `md`, horizontale au-dessus (cf. `FlowDiagram`, débordement à 1024 px : piège 12) ; équivalent textuel complet ; les durées restent pilotées par le tableau `etapes` du composant.

**C3 — « Journée type » de la section Problème** · P2 · M — *remplace ~70 mots*
`Probleme.astro`
Une bande horaire 8 h → 19 h où les plages de tâches répétitives sont marquées en accent. Le lecteur voit sa propre journée avant de lire une seule ligne. Les 3 cartes actuelles se réduisent à 3 libellés ancrés sur la bande.
⚠️ Les plages affichées sont un **scénario type**, jamais une mesure : le légender comme tel, exactement comme les exemples illustratifs.
*Acceptation* : légende « exemple type » visible ; lisible en une seule ligne de lecture sur mobile ; ≤ 60 mots dans la section hors titre.

**C4 — Calculateur de temps perdu** · P1 · L — *ajoute de l'interaction, pas du texte*
Nouveau composant + lien vers `/contact`
Deux curseurs (nombre de devis ou de dossiers par semaine, minutes par unité) → un résultat vivant : « ≈ X h par mois ». C'est la traduction directe de l'exigence PAS du guide (« calcul du temps perdu ») et le meilleur candidat « show don't tell » de tout le site : le visiteur produit lui-même son chiffre, il ne le lit pas.
Le résultat pré-remplit le formulaire de contact (paramètre d'URL lu côté client, champ « message » ou puces pré-cochées).
⚠️ Ne **jamais** convertir en euros sans hypothèse affichée (un coût horaire inventé décrédibilise tout le site). Afficher « ≈ » et « estimation, sur la base de vos propres chiffres ».
*Acceptation* : écrit en **JS natif inline** (la CSP calcule les empreintes sha256 au démarrage, aucun réglage à faire). Le budget élargi à 150 ko autoriserait techniquement un îlot React, mais ce composant est deux curseurs et une multiplication : React n'apporterait rien et l'objectif reste le temps de chargement minimal. Utilisable au clavier (`input type=range` natif, `aria-valuetext`) ; valeur par défaut donnant un résultat non nul en SSR ; **coût mesuré ≤ 2 ko gzip** ; JS total de l'accueil ≤ 80 ko gzip après ajout.

**C5 — Bandeau « vos outils »** · P1 · M · 🔒
Remplace ou complète `Engagements.astro`
Une rangée de noms d'outils réellement intégrés, reliés par un trait à un point sosese. Répond visuellement à « faut-il changer nos logiciels ? » (question n°3 de la FAQ) avant qu'elle ne soit posée.
⚠️ **Logos de tiers = question juridique et risque de marque.** Repli sans risque et cohérent avec la charte : **wordmarks en monospace**, dans les tokens du site, sans logo. Ne lister que des outils réellement connectés à ce jour, plus une mention « et vos outils métier, via leur API ». Ce repli est aussi le choix technique le plus propre : du texte et un tracé SVG, aucun fichier image à charger, aucun bitmap à décliner en deux thèmes.
*Acceptation* : aucun logo tiers sans validation écrite ; aucune liste inventée ; pas de débordement horizontal aux 4 largeurs de contrôle.

**C6 — Schéma d'intégration v2** · P2 · M — *remplace ~40 mots*
`SousLeCapot.astro`
Les 3 boîtes actuelles deviennent un vrai schéma d'architecture : sens des flux, frontière UE matérialisée, **porte de validation humaine** sur les flux sortants (aujourd'hui reléguée dans une note en bas du schéma alors que c'est l'argument central).
*Acceptation* : reste dans `.section-invert` ; seul endroit du site où le jargon est autorisé — ne pas le laisser déborder ailleurs ; équivalent textuel structuré (`ol` masquée ou `desc` SVG).

**C7 — Micro-schéma par exemple** · P2 · M — *remplace ~150 mots*
`src/content.config.ts`, `src/content/exemples/*.md`, `Exemples.astro`
Ajouter au frontmatter un triplet `source → traitement → sortie` (ex. `E-mail reçu` → `Lecture + catalogue` → `Devis à relire`). Chaque carte affiche ce micro-flux en R1 et **une seule** ligne de texte, au lieu des couples Avant/Après actuels. Section la plus verbeuse après le cas client et la FAQ.
*Acceptation* : ajouter un exemple reste **un seul fichier Markdown** (règle du projet) ; schéma dérivé du frontmatter, jamais écrit à la main dans le composant ; section ≤ 150 mots (contre 282).

**C8 — Schéma « qui décide quoi »** · P2 · M — *remplace ~80 mots et absorbe la redondance B8*
`Confiance.astro`
Deux colonnes : ce que l'automatisation fait seule (lire, chercher, chiffrer, préparer) / ce qui attend votre accord (envoyer, écrire, engager). Une porte entre les deux. C'est le lieu canonique de la promesse de validation humaine, aujourd'hui répétée 6 fois.
*Acceptation* : les 4 cartes à icône passent à 2 au maximum ; la promesse disparaît des 4 autres emplacements (B8).

**C9 — Divulgation progressive** · P2 · S — *retire du texte sans le supprimer*
`Accordion.astro` (existe déjà, zéro JS)
Replier le détail secondaire : grille de technos de « Sous le capot », détail des livrables de la méthode, précisions de la section Confiance.
*Acceptation* : `<details>` natif, contenu présent dans le DOM (SEO et recherche navigateur préservés) ; jamais utilisé pour cacher une information nécessaire à la décision (prix, engagement, données).

**C10 — Resserrer l'architecture de la page** · P3 · L — *à ne faire qu'après C1–C8*
`src/pages/index.astro`
Onze sections → huit, et le cas client remonte. Ordre cible : Hero + preuve → Problème (journée type + calculateur) → Méthode (frise) → **Cas client** → Offre → Exemples → Confiance (+ Sous le capot replié) → FAQ → CTA.
*Acceptation* : profondeur de défilement mesurée (D1) avant/après ; un seul `h1` ; alternance de fonds et bordures conforme à `DESIGN.md` ; aucune section orpheline dans la navigation.

**C11 — Remplacer le terminal du hero par la démo métier** · P2 · M — *recommandation activée par la décision de cible*
La cible est désormais la PME de 1 à 50 salariés (B1) : le lecteur type est un dirigeant qui fait lui-même ses devis. **Un terminal noir ne lui parle pas** — il évoque le prestataire informatique dont il se méfie, exactement ce que le positionnement cherche à éviter. La démo dictée → devis (`DicteeChiffrageDemo`, aujourd'hui en 7e position) montre en revanche son métier.
Proposition : **elle monte dans le hero, le terminal descend dans « Sous le capot »**, où il est chez lui et où le jargon est autorisé. À confirmer avant de coder : c'est le visuel signature du site, et le terminal bénéficie d'une exception `prefers-reduced-motion` documentée qui ne se transporte pas telle quelle.
*Acceptation* : décision tracée dans `DESIGN.md` ; si changement, mesurer à nouveau le LCP (le terminal est au-dessus de la ligne de flottaison, tout remplacement rejoue l'arbitrage `client:idle` documenté).

### Bloc D — Mesure

**D1 — Mesure d'audience propriétaire** · P1 · M
`server/index.mjs`, script inline dans `Base.astro`
Aucun KPI du guide n'est calculable aujourd'hui. Compte tenu de la contrainte « aucune requête tierce » (CSP `script-src 'self'`), la seule voie est **une mesure de première partie** : compteur côté Fastify (le HTML est en `no-cache`, toutes les vues passent par le serveur) + une balise same-origin pour la profondeur de défilement et les clics de CTA.
Sans cookie, sans identifiant persistant, sans stockage d'IP : reste alors hors du champ du consentement, et cohérent avec la politique de confidentialité existante — **à faire confirmer**.
*Acceptation* : 4 indicateurs disponibles (vues, profondeur de défilement, clics CTA, envois de formulaire) ; aucune requête sortante ; aucune donnée personnelle journalisée (la règle actuelle « aucune ligne par requête, ni IP ni URL » reste vraie pour les logs applicatifs) ; `/confidentialite` mise à jour dans le même lot ; empreintes CSP toujours calculées automatiquement.

**D2 — Définition du tunnel et cibles** · P2 · S
Formaliser : vue → 50 % de défilement → clic CTA → formulaire ouvert → formulaire envoyé → lead qualifié. Cibles du guide : 5 à 10 % de conversion — à recalibrer sur le volume réel, qui sera faible (site vitrine de studio).
*Acceptation* : tableau de suivi mensuel dans `RUNBOOK.md`, alimenté par D1.

**D3 — Expérimentation** · P3 · S
Le vrai A/B testing est hors de portée (site statique, un seul artefact). Alternative honnête : **variantes séquentielles par version déployée** (2 à 4 semaines par variante), sur les deux zones que le guide désigne comme prioritaires (accroche du hero, libellé du CTA). Le volume de trafic rendra probablement le résultat non significatif : le documenter comme aide à la décision, pas comme preuve.

### Bloc E — Technique

**E1 — Tenir le budget JS élargi sans perdre le temps de chargement** · P1 · S
Plafond porté à **150 ko gzip** sur l'accueil, ~74 ko consommés (runtime React 67 ko + îlots ~7 ko). Le risque de cette décision est connu : un plafond plus haut se remplit tout seul. Garde-fous à appliquer :
- toute bibliothèque candidate pèse **< 10 ko gzip**, sans dépendance transitive, et sa taille réelle est vérifiée **avant** installation (`npx bundlejs` ou build comparatif), pas d'après sa page d'accueil ;
- à fonctionnalité égale : composant Astro statique > JS natif en ligne > îlot React > nouvelle dépendance ;
- aucune bibliothèque d'animation, de graphiques ou d'icônes : les schémas de la v2 sont du SVG en ligne et du CSS (§4) ;
- **le plafond n'est pas une cible.** Un dépassement de 120 ko sans gain de LCP mesuré fait refuser le changement.
Si un jour plusieurs îlots lourds deviennent nécessaires, évaluer Preact (`@astrojs/preact`, ~4 ko contre 67) — décision structurelle, à instruire séparément, jamais glissée dans un lot de contenu.
*Acceptation* : JS gzip de l'accueil **et** LCP mesurés avant/après chaque lot et consignés dans `DESIGN.md` ; aucune dépendance ajoutée sans sa taille mesurée notée dans la PR.

**E2 — Pipeline d'images, réduit au strict nécessaire** · P2 · S
Décision : **les visuels sont des schémas SVG, pas des images.** Le site n'a aucun bitmap aujourd'hui et n'en aura que deux : le portrait de `/a-propos` (A2) et l'image de partage Open Graph (A3). Les deux passent par `astro:assets`, en AVIF/WebP, dimensions déclarées, jamais `lazy` au-dessus de la ligne de flottaison.
Aucun autre item du backlog ne doit introduire de fichier image : si une proposition en réclame une, c'est qu'elle sort des trois registres du §4 et elle est à refuser.
*Acceptation* : `public/` et `src/assets/` ne contiennent que le portrait, l'image OG et le favicon ; les SVG de schémas sont **en ligne dans les composants** (thémables via `currentColor`), pas des fichiers `.svg` importés.

**E3 — Schéma de contenu étendu** · P2 · S
`src/content.config.ts` : champs de C7, et champ `verbatim` optionnel pour A6. Toute évolution de schéma doit préserver la règle « ajouter un élément = un seul fichier Markdown ».

**E4 — Garde-fous de non-régression** · P1 · S
Après chaque lot : Lighthouse mobile ≥ 100/100/100/100, CLS 0, axe 0 violation sur 6 pages × 2 thèmes, `document.documentElement.scrollWidth` vérifié à 360/640/1024/1280 px (piège 12), build + `npm start` + parcours des pages avant PR (piège 19).

---

## 6. Prompt système sosese (dérivé du guide, calibré sur le projet)

À utiliser pour toute génération de texte de la v2. Il remplace le prompt générique du guide : celui-ci autorise des promesses que sosese ne peut pas tenir (« audit gratuit », gains chiffrés moyens).

```text
RÔLE
Copywriter B2B senior, spécialisé conversion, écrivant pour sosese — studio d'automatisation et d'IA
sur-mesure pour PME. Promesse centrale : "Vos tâches répétitives, automatisées. Sans changer vos outils."

CIBLE
PME de 1 à 50 salariés, en priorité. Dirigeant, gérant ou responsable des opérations qui fait lui-même
une partie du travail administratif. Aucun service informatique interne. Méfiant vis-à-vis des
prestataires techniques, saturé de logiciels, sans temps à consacrer à un apprentissage.
Les structures plus grandes ne sont pas exclues, mais on ne leur écrit pas : pas de "conduite du
changement", pas de "gouvernance", pas de "service IT", pas de comité de pilotage.

CE QUE SOSESE VEND
Un atelier sur site (2 jours), une feuille de route chiffrée (1 semaine), puis la construction
d'automatisations branchées sur les logiciels déjà en place (4 semaines). Le code, les accès et la
documentation sont remis au client.

RÈGLES D'ÉCRITURE
1. Vouvoiement, voix active, phrases de moins de 15 mots, paragraphes de 3 lignes maximum.
2. Vocabulaire du métier du client : devis, facture, relance, chantier, SAV, planning. Jamais API,
   LLM, RAG, workflow, pipeline — sauf dans la section "Sous le capot", seule zone de jargon autorisée.
3. Un argument = un endroit. Ne jamais reformuler ailleurs une promesse déjà faite.
4. Chaque affirmation chiffrée est soit un résultat mesuré du cas client réel, soit explicitement
   présentée comme un ordre de grandeur illustratif. Aucun chiffre moyen inventé, aucun pourcentage
   de conversion, aucun témoignage fabriqué.
5. Si un texte peut être remplacé par un schéma, proposer le schéma et écrire la légende à la place
   du paragraphe.

INTERDITS
"Révolution IA", "disruptif", "plateforme tout-en-un", "solution clé en main", "boostez",
"transformation digitale", emojis, superlatifs, urgence artificielle, "gratuit" appliqué à l'atelier
(seul le premier échange est gratuit).

CADRES PAR SECTION
Hero : BAB. Problème : PAS, avec un chiffre que le lecteur reconnaît comme le sien.
Offre et exemples : FAB, l'Advantage explique pourquoi ça tient (catalogue réel, règles réelles).
Fermeture : 4 Ps, avec une preuve reprise du cas client, jamais réécrite.
CTA : 1re personne ("Demander mon diagnostic") + sous-texte de réassurance factuel.

SORTIE
Pour chaque bloc : section | cadre appliqué | texte | nombre de mots | ce que ce texte remplace ou
supprime ailleurs sur le site.
```

Paramètres : température 0.3–0.5, deux passes (rédaction puis resserrage), longueur bornée par bloc.

---

## 7. Ressources à fournir par l'humain

Classées par rapport valeur / coût d'obtention. Les items 1 à 4 débloquent à eux seuls la moitié du backlog.

| # | Ressource | Débloque | Coût | Remarque |
|---|---|---|---|---|
| 1 | Données légales complètes (raison sociale, forme, siège, SIRET, RCS, TVA, directeur de publication, hébergeur) | A1 | 15 min | Obligation légale, actuellement non tenue en production |
| 2 | Photo + nom + rôle + bio | A2 | 1 h | La photo peut être sobre ; l'absence totale de visage est plus coûteuse qu'une photo imparfaite |
| 3 | Verbatim écrit + accord du client L'Atelier des Sols & Fils | A6, B5 | 1 appel | Le levier le plus fort du guide, entièrement absent du site |
| 4 | Politique de prix | B6 | décision | Le persona est tranché (PME 1–50) ; le prix reste la dernière décision bloquante pour la réécriture |
| 5 | Liste réelle des logiciels intégrés à ce jour | C5 | 15 min | Sans logo, en wordmarks mono, pour éviter la question des marques |
| 6 | 2 à 3 résultats mesurés supplémentaires (autres missions) | B4 | variable | Un seul cas client rend la preuve fragile ; deux la rendent crédible |
| 7 | Validation juridique de l'usage des logos tiers | C5 (variante logos) | à évaluer | Optionnel : le repli wordmark évite entièrement la question |
| 8 | Confirmation du cadre RGPD pour la mesure de première partie | D1 | à évaluer | Mesure sans cookie ni IP ; à faire confirmer avant mise en ligne |
| 9 | Délai de réponse réellement tenable | B2, B9 | décision | Nécessaire avant d'écrire « réponse sous X » |
| 10 | Captures anonymisées des automatisations livrées | C7 (variante mockups) | accord client | À défaut, les mockups restent des scénarios inventés, légendés comme tels |
| 11 | Design de l'image de partage (1200×630) | A3 | 1 h | Peut être généré depuis les tokens du site, sans prestataire |

**Explicitement non recommandé** : illustrateur externe, banque d'images, vidéo de démonstration produite. Le système de schémas décrit au §4 coûte moins cher, reste cohérent avec `DESIGN.md`, se met à jour avec le contenu et ne pèse rien en performance. Une illustration achetée violerait par ailleurs deux anti-patterns déjà posés dans le projet.

---

## 8. Arbitrages à trancher avant de coder

| # | Question | Options | Recommandation |
|---|---|---|---|
| 1 | ~~Persona~~ | — | ✅ **Tranché le 2026-09-16 : PME de 1 à 50 salariés**, sans fermer la porte aux structures plus grandes. Reporté dans `DESIGN.md`, appliqué en B1 |
| 2 | Prix affiché | montant ferme / fourchette / format seul | **fourchette pour l'atelier**, à défaut le format (forfait par étape, sans abonnement) |
| 3 | Visuel du hero | terminal / démo dictée → devis | l'arbitrage 1 étant tranché à 1–50 salariés, la recommandation s'applique : **basculer** sur la démo métier (C11). Dernière confirmation avant de coder |
| 4 | Logos d'outils tiers | logos / wordmarks mono | **wordmarks**, sans risque de marque et cohérent avec la charte |
| 5 | Mesure d'audience | aucune / première partie / outil externe | **première partie**, seul choix compatible avec la CSP et la promesse « aucune requête tierce » |
| 6 | Calculateur | îlot React / JS natif / pas de calculateur | **JS natif inline** : deux curseurs et une multiplication, React n'apporterait rien même avec le budget élargi |
| 7 | Ampleur de la v2 | retouches successives / refonte de la page d'accueil | **successives** : le site est en production, à 100/100, et la règle du projet est « une évolution à la fois » |
| 8 | Cohérence de l'offre avec le bas de la fourchette | atelier de 2 jours maintenu / format allégé pour les structures de moins de 10 personnes | à instruire en même temps que B6 : une PME de 5 personnes n'immobilise pas 2 jours d'équipe de la même façon qu'une de 45 |
| 9 | ~~Images ou schémas~~ | — | ✅ **Tranché le 2026-09-16 : schémas SVG**, aucun bitmap hors portrait et image OG |
| 10 | ~~Budget JS~~ | — | ✅ **Tranché le 2026-09-16 : 150 ko gzip**, objectif de chargement inchangé, bibliothèques < 10 ko uniquement |

---

## 9. Contraintes non négociables (à recopier dans tout prompt de la v2)

- Aucune couleur, rayon ou espacement en dur : tokens de `tokens.css` uniquement. Une seule couleur d'accent.
- Tout est statique sauf les îlots listés dans `DESIGN.md`, tous en `client:idle`. Ne pas repasser un îlot en `client:load` sans remesurer le LCP.
- Cible éditoriale : **PME de 1 à 50 salariés**, sans fermer la porte aux structures plus grandes. Vocabulaire du dirigeant qui fait lui-même, jamais celui d'un service informatique.
- Budget : ≤ **150 ko** de JS gzip sur l'accueil (~74 ko consommés), **à objectif de chargement inchangé** : LCP < 1,8 s, CLS 0, Lighthouse 100. Bibliothèques < 10 ko gzip, sans dépendance transitive, taille vérifiée avant installation. Aucune requête tierce, aucune police ou script externe (la CSP les bloquerait).
- Visuels : **schémas SVG en ligne** (ou mockups construits avec les tokens). Aucun bitmap, aucune banque d'images. Deux exceptions sur tout le site : portrait de `/a-propos` et image de partage Open Graph, via `astro:assets`.
- Toute animation respecte `prefers-reduced-motion`. **Seule exception existante : le terminal du hero. Ne pas l'étendre.**
- Chaque visuel : état final rendu en SSR, dimensions fixes, CLS 0, équivalent textuel.
- Jamais de chiffre inventé, de faux témoignage, de faux logo client. Les exemples sont illustratifs et le disent. Le cas client réel est la seule exception, couverte par un accord écrit.
- Aucune donnée issue d'un outil connecté (CRM Extrabat…) ne devient du contenu public : ni pièce commerciale, ni montant, ni coordonnée de client final (piège 17).
- `null` dans `src/config/site.ts` = « à compléter », jamais une valeur inventée.
- Anti-patterns : dégradés multicolores, imagerie IA (cerveaux, robots, réseaux de neurones), emojis, plus de 2 niveaux de titre par section, WebGL, `backdrop-filter` sur mobile, `transition-all`.
- Développement local uniquement. Aucun accès au VPS. Déploiement humain. Pousser, ouvrir une PR ou créer un tag : accord explicite dans la session.
- Tout nouveau composant, toute décision, tout piège : ajouté à `DESIGN.md` dans le même tour.

---

## 10. Séquencement proposé

Une évolution à la fois, une branche par item ou par petit groupe cohérent, un tag par mise en production.

| Version | Contenu | Pourquoi ce regroupement |
|---|---|---|
| **v0.6 — Crédibilité** | A1, A3, A4, A5 | Sans dépendance, sans décision commerciale, corrige un défaut légal et le partage de liens. À faire tout de suite. |
| **v0.7 — Preuve** | A2, A6, B5, B7 | Donne un visage et une voix au site. Dépend des ressources 1 à 3. |
| **v0.8 — Socle visuel** | C0, C1, C2, B8 | Le socle de schémas, ses deux premières applications, et la déduplication. **C'est le lot qui fait baisser le volume de texte.** |
| **v0.9 — Conversion** | B1, B2, B3, B4, B6, C5, D1 | Réécriture du haut de page et alignement sur la cible 1–50 ; n'attend plus que la décision de prix (B6). La mesure (D1) part dans le même lot, pour constater l'effet. |
| **v1.0 — Show don't tell** | C3, C4, C6, C7, C8, C9, C11 | Le reste du système visuel, calculateur inclus. |
| **v1.1 — Architecture** | C10, D2, D3 | Resserrage de la page et boucle de mesure, une fois les briques stabilisées. |

Effort indicatif : v0.6 et v0.7 sont courts ; v0.8 et v1.0 portent l'essentiel de la charge.

---

## 11. Ce qu'il ne faut pas casser

Le site est à 100/100/100/100 sur Lighthouse mobile, 0 violation axe sur 6 pages dans les deux thèmes, CLS 0, aucune requête tierce, LCP 1,2–1,4 s en production. Ces chiffres sont un **actif commercial** pour un studio qui vend de la rigueur technique : ils sont vérifiables par n'importe quel prospect en dix secondes. Aucun item de ce backlog ne les justifie.

Le texte existant est de bonne qualité : phrases courtes, aucun jargon hors zone, honnêteté sur les chiffres, ton juste. **La v2 doit en supprimer, pas le réécrire.**
