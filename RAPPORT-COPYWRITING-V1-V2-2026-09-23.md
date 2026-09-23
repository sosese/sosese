# sosese.tech : analyse critique de la V1 et de la V2

**Date :** 23 septembre 2026
**Périmètre :** [sosese.tech](https://sosese.tech) (V1, tag v0.8 en production) et [sosese.tech/v2](https://sosese.tech/v2) (préversion, `noindex`, branche `codex/site-v2`). Les deux versions ont été lues page par page par requêtes HTTP publiques, avec captures ordinateur (1440 px) et mobile (390 px).
**Livrable :** ce rapport. Aucun fichier du site n'a été modifié, rien n'a été déployé et aucun formulaire n'a été envoyé.

---

## Comment lire ce document

- **Partie 1** : analyse de la V1, découpée en cinq spécialités (stratégie, marketing et copywriting, commercial, technique, technologique), plus la lisibilité.
- **Partie 2** : analyse de la V2, avec la même grille et des pages supplémentaires (Accompagnement, Réalisation, Éditeurs).
- **Partie 3** : comparaison point par point, arbitrage, pistes d'amélioration, sites d'inspiration, plan d'action et **brief transférable à un LLM** (§3.8).
- **Annexe** : sources externes, mesures brutes.

Chaque point porte un identifiant stable (`V1-M-W3` = V1, marketing, faiblesse n° 3 ; `F` = force). Le plan d'action et le brief y renvoient.

**Niveaux de preuve utilisés :**
- **Observé** : visible sur le site en ligne le 23/09/2026.
- **Source** : lu dans le dépôt local.
- **Externe** : appuyé sur une référence citée (numérotée `[S#]`, voir l'annexe A).
- **Jugement** : interprétation d'expert, à valider auprès de vrais visiteurs.

Aucun pourcentage de gain de conversion n'est promis. Les notes sur 5 de la partie 3 sont des jugements d'expert, pas des mesures.

---

## 0. Cadrage et synthèse

### 0.1 Cadrage retenu

| Élément | Valeur | Origine |
|---|---|---|
| Cible prioritaire | Indépendants, TPE et PME de 0 à 50 salariés | Audit du 21/09, confirmé |
| Zone | Metz et environ 80 km autour | Audit du 21/09, confirmé |
| Rôle du site | Vitrine de crédibilité qui génère des contacts | Audit du 21/09, confirmé |
| **Canal principal** | **Réseau et bouche-à-oreille** | Réponse du 23/09 |
| Cible secondaire | Éditeurs de logiciels métier | Audit du 21/09, confirmé |
| Maturité | Un client livré (L'Atelier des Sols & Fils / Extrabat), entreprise pas encore constituée | Confirmé |
| **Prix** | **Une fourchette est affichable** (montant à fournir) | Réponse du 23/09 |
| **Statut de la V2** | **Pas encore arbitré : V1, V2, ou version hybride** | Réponse du 23/09 |
| Juridique | Hors du plan d'action, à ta demande | Confirmé |

**Conséquence majeure du canal :** un visiteur qui arrive par recommandation ne découvre pas sosese. Il **vérifie** ce qu'on lui en a dit. Selon Hinge, le site web est la première source consultée pour évaluer un prestataire recommandé : 80 % des acheteurs le citent. Plus de la moitié (51,6 %) disent avoir déjà écarté un prestataire recommandé sans lui parler [S7]. Le site n'a donc pas à séduire un inconnu. Il doit **passer un contrôle** avec cinq questions :

1. Qui est derrière ?
2. A-t-il déjà fait quelque chose de comparable ?
3. Combien ça coûte, à peu près ?
4. Qu'est-ce que je risque ?
5. Que se passe-t-il si j'écris ?

Cette grille « contrôle de recommandation » sert de fil rouge au rapport.

### 0.2 Verdict en une page

**V1 : un site vivant, démonstratif et chaleureux, qui en dit trop et promet trop large.**
- **Points forts :** la V1 montre le produit (démos animées, « qui décide quoi »), donne des durées concrètes (atelier 2 jours, construction 4 semaines) et contient des formulations mémorables.
- **Points faibles :** elle vise « PME » avec une étiquette « IA » devenue banale, répète quatre promesses cinq ou six fois, emploie des absolus invérifiables (« il ne reste rien », « ne quittent pas l'Europe »), n'incarne personne et affiche un bloc « à compléter » en production.

**V2 : un site juste, honnête et bien ordonné, qui a perdu sa voix et se couvre trop.**
- **Points forts :** la preuve arrive en deuxième position, la cible et la zone sont nommées, un humain est identifié, le cas client a sa page, le texte est réduit de 64 %.
- **Points faibles :** le titre est interchangeable avec celui de dix concurrents. Le texte accumule environ quatorze avertissements (« ne constituent pas une promesse », « pistes à étudier », « à définir ensemble ») qui fragilisent la seule preuve disponible. L'offre n'a plus ni durée ni prix, et la personne derrière le projet n'a ni photo ni voix propre (« un projet porté par »).

**Arbitrage recommandé : partir de la V2 comme socle (architecture, honnêteté, incarnation) et y réinjecter l'énergie et la concrétude de la V1 (démonstration, durées, formulations frappantes).** Cela donne une **V3 = V2 + 12 emprunts ciblés à la V1 + 4 décisions commerciales**. Le détail est au §3.3.

**Les trois changements qui ont le plus de levier, dans l'ordre :**
1. **Un titre qui ne pourrait être signé par personne d'autre**, fondé sur l'attribut réellement unique : la demande dictée sur le terrain qui arrive toute prête dans le logiciel métier, déjà en service chez un client, à moins de 80 km. Voir §3.4.1.
2. **Une offre d'entrée nommée, avec une fourchette de prix et une durée** : premier échange offert, puis diagnostic à prix fixe, puis première automatisation dans une fourchette. Voir §3.4.3.
3. **Remplacer les avertissements par des précisions.** Par exemple, remplacer « le protocole de chronométrage n'est pas documenté ici » par « mesuré par Jason sur N devis en [mois] », et ajouter la citation de Jason et une photo de Joris. Voir §3.4.2.

---

# PARTIE 1 — Analyse de la V1 (sosese.tech)

## 1.1 Fiche d'identité

| Mesure | Valeur (observé) |
|---|---|
| Pages | Accueil, À propos, Contact, Mentions légales, Confidentialité |
| Sections de l'accueil | 11 : Hero → Engagements → Constat → Méthode → Offre → Cas client → Sous le capot → Confiance → FAQ (9) → CTA final |
| Mots visibles sur l'accueil | ≈ 1 770 (libellés des démos compris, FAQ repliée) |
| Texte alternatif des démos (lecteurs d'écran) | ≈ 1 200 mots supplémentaires |
| Poids HTML de l'accueil | 118 ko (20,6 ko gzip) |
| H1 | « Vos tâches répétitives, automatisées. Sans changer vos outils. » |
| Surtitre du hero | « IA SUR-MESURE POUR PME » |
| CTA | « Parlons-en » partout, sans texte d'accompagnement |
| Humain identifié | Aucun |
| Balises Open Graph | Aucune (un lien partagé s'affiche sans titre ni image) |

## 1.2 Test des 10 secondes

Selon Nielsen Norman Group, un visiteur décide en 10 à 20 secondes s'il reste, et une proposition de valeur claire est ce qui le retient [S1].

**Ce qu'un dirigeant messin comprend en 10 secondes (observé, écran 1440 × 900) :** « Quelqu'un fait de l'IA pour les PME, ça automatise les tâches répétitives et je garde mes logiciels. » La démo à droite montre des post-it qui deviennent un devis et un rendez-vous : c'est parlant.

**Ce qu'il ne comprend pas :**
- qui : aucun nom, aucun lieu ;
- pour qui exactement : « PME » est large, et un artisan de 3 personnes ne se dit pas « PME » ;
- combien ;
- pourquoi sosese plutôt que les dizaines d'offres « IA pour PME » qu'il a déjà vues passer ;
- où : rien ne dit « Metz ».

## 1.3 Stratégie et positionnement

**V1-S-F1 — L'objection principale est traitée dès le titre.** « Sans changer vos outils » répond à la peur n° 1 d'une petite structure : migrer, former et perdre du temps. C'est un bon choix de « valeur », au sens d'April Dunford [S8]. *À conserver.*

**V1-S-F2 — Le problème est posé avant la technologie.** La section Constat (« Le temps que personne n'a décidé de perdre ») applique la logique PAS (problème, agitation, solution) et s'adresse à un lecteur « conscient du problème » au sens de Schwartz [S9]. C'est le bon niveau pour une TPE qui subit la ressaisie sans chercher activement de solution d'IA.

**V1-S-W1 — La catégorie « IA sur-mesure pour PME » est saturée et en décalage avec la cible.**
- **Saturation (externe).** En 2026, « agence IA TPE/PME » est une catégorie encombrée : Tensoria, Anacod, Arborys IA, Hutch Agency, Zéro Tâche… proposent tous, mot pour mot, « automatiser devis, relances, planning ». Dunford rappelle que la catégorie choisie fixe les concurrents auxquels on est comparé [S8]. Ici, sosese se range dans le rayon le plus encombré, sans signe distinctif.
- **Décalage.** « PME » exclut psychologiquement les indépendants et les TPE, alors que la cible confirmée est 0-50 salariés. La page À propos annonce même « de 15 à 150 personnes » (observé), en contradiction directe avec cette cible.
- **Perception (jugement, appuyé sur France Num [S14]).** L'usage de l'IA dans les TPE-PME a doublé en un an (13 % → 26 %), et surtout pour générer du contenu. Les trois quarts des TPE-PME n'utilisent donc encore aucune solution d'IA, et celles qui l'utilisent y voient surtout un générateur de contenu, pas un moyen de supprimer la ressaisie. Mettre « IA » en étiquette de tête, c'est vendre le moyen plutôt que le résultat, à un public qui ne l'associe pas encore à ce résultat.

**V1-S-W2 — L'attribut réellement unique est enfoui en 6e position.** Ce qui distingue sosese est le cas de L'Atelier des Sols & Fils : un devis dicté sur chantier, créé dans Extrabat à partir du vrai catalogue, déjà en service. Aucun concurrent observé ne montre une intégration **en service dans le logiciel métier d'un client local nommé**. Or ce cas arrive après Constat, Méthode et Offre, donc après environ 800 mots d'affirmations. Pour un visiteur recommandé, c'est la première chose à voir.

**V1-S-W3 — Aucune alternative concurrente n'est traitée.** Le site oppose sosese au travail manuel uniquement. Le prospect réel hésite plutôt entre :
- attendre que l'éditeur ajoute la fonction ;
- son informaticien ou son neveu qui « fait du Make » ;
- un abonnement IA générique ;
- une agence IA plus grosse ;
- ne rien faire.

Dunford place l'identification des alternatives en **premier** dans la construction d'un positionnement [S8]. Arborys IA le fait explicitement (« vs conseil / vs intégrateurs / vs freelances »).

**V1-S-W4 — La proximité n'existe pas.** Pas de Metz, pas de Moselle, pas de rayon d'intervention. Pour un prestataire local qui vit du réseau, c'est pourtant un avantage que les agences nationales n'ont pas. Le seul signal géographique est… Pessac (Gironde), dans la démo du cas client (voir V1-M-W7).

**V1-S-W5 — Aucune limite de périmètre.** Rien ne dit ce que sosese ne fait pas, pour qui ce n'est pas fait, ni quel outil ne peut pas être connecté (hors une phrase dans la FAQ). Le sur-mesure sans limites ressemble à « on fait tout ». David C. Baker montre que plus une structure est petite, plus un positionnement étroit lui est vital face à des concurrents mieux dotés [S11].

## 1.4 Marketing et copywriting

**V1-M-F1 — Titre clair, court, avec un contraste.** Huit mots, un bénéfice, une objection levée. Il passe le test de Harry Dry « peut-on le visualiser ? » [S10] de façon moyenne : « tâches répétitives » reste abstrait, mais « sans changer vos outils » est concret.

**V1-M-F2 — Des formulations mémorables, écrites dans la langue du client.**
- « Le temps que personne n'a décidé de perdre »
- « La même information, tapée trois fois »
- « Ça repart avec elle le vendredi soir »
- FAQ : « **Et si elle invente un prix ?** » : c'est la voix du client, l'objection exacte d'un dirigeant qui a lu des articles sur les « hallucinations ».
- CTA final : « Qu'est-ce qui vous prend le plus de temps ? » : une question ouverte, facile, centrée sur le lecteur.

Ce sont les meilleures lignes des deux versions. *À sauver absolument.*

**V1-M-F3 — La démonstration plutôt que la description.** Le hero (le vrac qui devient des actions), la rotation d'écrans (8 scénarios) et l'enchaînement fiche → devis → intervention → analyse montrent le résultat au lieu de l'annoncer. Le tableau « Qui décide quoi » (« Elle avance seule » / « Elle s'arrête net ») est un modèle de clarté sur le contrôle humain.

**V1-M-F4 — Une méthode chiffrée en temps client.** « Votre temps : une demi-journée / 1 heure / 1 heure par semaine » répond à la question implicite « combien de mon temps ça va me coûter ? ». C'est rare et très vendeur auprès d'un dirigeant débordé.

**V1-M-W1 — Un titre interchangeable.** Faisons le test « est-ce que seul sosese peut le dire ? » (règle d'unicité de Harry Dry [S10]) :

| Site | Titre |
|---|---|
| sosese V1 | Vos tâches répétitives, automatisées. Sans changer vos outils. |
| Anacod | Automatisez votre activité — vos relances partent seules, vos devis se synchronisent |
| Hutch Agency | Automatisation IA pour les PME et TPE |

→ Un visiteur ne retient pas lequel est lequel.

**V1-M-W2 — Quatre promesses répétées de quatre à six fois.** C'est déjà mesuré dans `REVUE-V2.md` §1.4 :
- validation humaine ;
- code qui vous appartient ;
- sans changer d'outils ;
- feuille de route chiffrée.

Chaque répétition est bien écrite, mais l'ensemble produit l'impression d'un site « bavard ». Le vrai problème n'est pas la longueur des phrases (9,6 mots en moyenne, c'est très bien) mais la redondance entre sections.

**V1-M-W3 — « Elle » : un pronom sans visage.** La solution est désignée par « elle » (« Elle prend les devants », « Elle garde vos règles », « Elle lit ce qu'il faut. Elle n'en garde rien. »). Le procédé personnifie l'outil, mais :
- le lecteur cherche l'antécédent (« elle » qui ? l'IA ? la solution ? l'assistante ?) ;
- le procédé donne un visage à l'outil alors que le prestataire, lui, n'en a pas. Le dirigeant achète une relation avec une personne, pas avec un « elle ».

**V1-M-W4 — Une preuve sociale au pluriel pour un seul client.** Le titre « Ils nous ont fait confiance » et l'onglet « Clients » annoncent un pluriel ; la section montre un seul client. Le visiteur attentif perçoit l'écart, et ce type d'écart entame la confiance plus qu'il n'en crée (NN/g : la crédibilité repose sur un contenu exact et à jour [S4]).

**V1-M-W5 — Des absolus que le site ne peut pas prouver.**
- « La tâche finie, il ne reste rien. »
- « Vos données ne quittent pas l'Europe. »
- « Rien de mémorisé. »

Or la pile technique affichée plus bas mentionne « RAG sur vos documents », « base vectorielle » et « PostgreSQL », donc de la mémorisation par construction. Un informaticien qui lit les deux sections voit la contradiction. *Déjà signalé en P0 par l'audit du 21/09.*

**V1-M-W6 — Un faux terminal qui ressemble à une vraie mission.** `atelier --client "PME industrie"` → « 14 processus cartographiés… 38 min économisées par devis ». C'est présenté comme « exemple de mission », sans mention « fictif ». Le chiffre de 38 min est de plus la différence exacte 40 − 2 du cas réel, appliquée à une « PME industrie » qui n'existe pas. Le procédé plaît aux profils techniques mais brouille la frontière entre preuve et illustration.

**V1-M-W7 — Des détails de démo qui contredisent l'ancrage.** La démo du cas client parle de « famille Martin, à **Pessac** » : c'est la banlieue de Bordeaux. Pour un prospect de Moselle, un détail local (fictif mais plausible, par exemple une commune de l'agglomération messine) renforcerait l'identification à peu de frais. Ce détail est aussi présent en V2.

**V1-M-W8 — CTA « Parlons-en » sans réducteur de friction.** Le bouton ne dit pas :
- ce qui se passe ensuite ;
- si c'est gratuit ;
- combien de temps ça prend ;
- sous quel délai la réponse arrive.

La section « Ce qui se passe ensuite » existe, mais seulement sur `/contact`.

**V1-M-W9 — Des chiffres ambigus dans le cas client.** « 3 rapports d'analyse annuels » : trois rapports par an ? trois rapports sur un an ? en six semaines ? Le lecteur ne sait pas. « +50 devis créés » est bien, mais sans comparaison (sur combien de devis au total ?).

## 1.5 Commercial et conversion

**V1-C-F1 — Un parcours en étapes avec décision à chaque étape.** « Trois étapes, et vous décidez à la fin de chacune » réduit le risque perçu. Brennan Dunn montre que le découpage en une petite prestation d'entrée (le « roadmapping »), puis un projet, est l'un des leviers les plus efficaces pour un prestataire solo [S12]. La V1 a cette structure (Atelier → Feuille de route → Construction), mais sans la nommer ni la chiffrer.

**V1-C-F2 — Des durées précises.** « Atelier sous 15 jours », « 2 jours », « 1 semaine », « 4 semaines ». Un dirigeant peut se projeter dans un calendrier.

**V1-C-F3 — Les objections sont traitées dans la FAQ.** Coût, délai, logiciels, données, mémoire, échec, suite, compétences, prix inventé : c'est complet.

**V1-C-W1 — « Combien ça coûte ? → Cela dépend du périmètre. »** C'est la réponse que NN/g identifie comme la plus coûteuse en B2B : les utilisateurs abandonnent et vont chez un concurrent qui affiche un ordre de grandeur [S2]. NN/g recommande, pour du sur-mesure, de **montrer des prix pour des scénarios représentatifs** [S3]. Hutch Agency affiche « dès 1 000 € », Arborys un audit à 240 € HT : le concurrent le plus proche donne donc une ancre de prix, sosese non.

**V1-C-W2 — Le formulaire demande de se classer avant d'expliquer son besoin.**
- **Obligatoires :** nom, société, email, secteur (liste de 7), consentement.
- **Facultatifs :** téléphone, irritants (8 cases) et message.

Le secteur est obligatoire mais le besoin est facultatif : c'est l'inverse de ce qui sert la qualification. Baymard montre que chaque champ visible pèse sur l'abandon, et que la plupart des formulaires en ont deux fois trop [S13]. Enfin, « Société » obligatoire exclut l'indépendant en cours de création.

**V1-C-W3 — Aucune porte d'entrée intermédiaire.** Entre « lire le site » et « écrire un message », il n'y a rien :
- pas de rendez-vous de 15 minutes ;
- pas de téléphone ;
- pas de « je vous appelle ».

Pour un artisan qui lit le site le soir sur son téléphone, écrire un message est plus coûteux qu'appeler.

**V1-C-W4 — Aucun élément ne sert la recommandation.** Le canal est le bouche-à-oreille, mais :
- aucune balise Open Graph : un lien envoyé par WhatsApp ou LinkedIn arrive nu ;
- aucune page de cas autonome à transférer ;
- aucune formulation à reprendre (« c'est le gars qui a fait le devis dicté chez Sols & Fils »).

## 1.6 Lisibilité et expérience

**V1-L-F1 — Une identité visuelle sobre et cohérente.** Palette chaude, typographie nette, beaucoup de blanc, thème sombre soigné, aucune image générée par IA, aucune photo d'illustration. C'est crédible.

**V1-L-F2 — Des phrases courtes, un vocabulaire du quotidien.** 9,6 mots par phrase en moyenne (mesure de `REVUE-V2.md`), et le jargon est confiné à « Sous le capot ».

**V1-L-W1 — Onze sections, quatre démos animées, huit scénarios en rotation.** La page fait environ 11 000 px de haut sur ordinateur (observé). Le visiteur rencontre :
- une animation au hero ;
- 8 scénarios dans la rotation d'écrans ;
- 4 étapes animées dans le cas client ;
- un terminal animé.

Chaque démo est bonne séparément, mais leur addition crée une page « showroom » où l'on ne sait plus quoi regarder. NN/g rappelle qu'une fois les 30 premières secondes passées, l'attention se gagne par la pertinence, pas par la quantité [S1].

**V1-L-W2 — Sur mobile, le bouton flottant masque la démo du hero** (observé, 390 px). Le bouton « Parlons-en » recouvre le coin inférieur droit de la démo dès le premier écran.

**V1-L-W3 — Le bandeau d'engagements est en police machine à écrire, en minuscules et coché.** « ✓ on est chez vous sous 15 jours ✓ chiffré sur votre situation réelle… » : le style « terminal » donne un aspect technique à des engagements humains, et quatre coches à la suite se lisent comme une liste de fonctionnalités.

## 1.7 Technique

**V1-T-F1 — Des fondations excellentes.** Site statique Astro, JS limité, Lighthouse 100 documenté, CLS 0. Les en-têtes de sécurité sont complets (observé) : CSP stricte à empreintes, HSTS, COOP/CORP, `nosniff`, `referrer-policy: no-referrer`. Aucune requête vers un tiers. Pour un prestataire qui demande l'accès aux données de ses clients, c'est un argument (voir §3.4.6).

**V1-T-W1 — Référencement de base incomplet (observé).**
- `/robots.txt` et `/sitemap.xml` renvoient 404.
- Aucune balise `og:*` ou `twitter:*`.
- Pas d'`og:image` (voir V1-C-W4).
- JSON-LD `FAQPage` seulement, sans `Organization`, `LocalBusiness` ni `Service`.
- Le `<title>` (« IA sur-mesure pour PME, branchée sur vos outils ») ne contient ni lieu ni métier.

**V1-T-W2 — Un bloc « à compléter » en production.** « à compléter : second visuel de "Sous le capot" » est visible sur l'accueil (observé). Sur le site d'un prestataire qui vend sa capacité à livrer, c'est le pire signal possible. *Déjà P0 dans l'audit du 21/09 et toujours présent.*

**V1-T-W3 — Mentions légales : 10 champs « à compléter » (observé).** Hors du plan à ta demande, mais à connaître : la ligne directrice Stanford n° 2 sur la crédibilité web est de « montrer qu'il y a une vraie organisation derrière le site » [S6]. Un prospect prudent qui clique sur « Mentions légales » voit l'inverse. C'est le blocage n° 1 avant tout effort d'acquisition.

**V1-T-W4 — Des textes alternatifs de démo trop longs.** Les `figcaption` masquées décrivent le style graphique (« dessinée comme une bulle de bande dessinée », « une bande de lecture traverse l'ensemble ») sur environ 1 200 mots. Un lecteur d'écran a besoin de l'information (« une demande devient un devis de 1 240 € à valider »), pas de la mise en scène.

**V1-T-W5 — HTML lourd pour une vitrine.** 118 ko de HTML (20,6 ko gzip), à cause des démos en SVG en ligne. Ça reste performant, mais c'est 3,3 fois la V2 pour un gain de persuasion discutable (V1-L-W1).

## 1.8 Technologique (crédibilité de l'IA et de l'intégration)

**V1-TE-F1 — Le contrôle humain est décrit comme un mécanisme, pas comme une valeur.** « Qui décide quoi » liste précisément ce que l'outil fait seul (lire, chercher, calculer sur vos tarifs, préparer) et ce qui exige un « oui » (envoyer, créer, modifier, engager un prix). C'est exactement ce qu'un dirigeant ou un informaticien veut savoir. *Meilleur bloc technologique des deux versions.*

**V1-TE-F2 — « Elle ne calcule jamais un prix elle-même : elle lit vos tarifs. »** C'est la bonne réponse à la crainte n° 1 envers l'IA générative (l'invention de chiffres), formulée en termes métier.

**V1-TE-W1 — Une pile technique affichée qui promet plus que ce qui est prouvé.** « Modèles open-weight auto-hébergés », « RAG », « base vectorielle », « tests de non-régression », « alertes sur erreur », « secrets chiffrés » : présenté comme la pile standard, tout cela devient un engagement implicite. Pour un premier client livré, chaque élément doit être vrai **aujourd'hui** ou décrit comme une option.

**V1-TE-W2 — Le « Sous le capot » est adressé au mauvais lecteur.** « Pour qui s'occupe de votre informatique » : dans une entreprise de 8 personnes, c'est le dirigeant lui-même ou un prestataire externe. La section parle « SI existant / ERP / CRM / webhooks », un vocabulaire qui n'aide ni l'un ni l'autre à décider. Le prestataire informatique a besoin de **faits vérifiables** : quel fournisseur de modèle, quelle région, quelle rétention, où sont les journaux, qui détient les clés. Une liste de technologies ne répond à aucune de ces questions.

## 1.9 Synthèse V1

| Spécialité | Force principale | Faiblesse principale |
|---|---|---|
| Stratégie | Objection « sans changer d'outils » au cœur | Catégorie « IA pour PME » saturée, cible et zone absentes |
| Marketing | Formulations mémorables, démos parlantes | Titre interchangeable, redondance, « elle » sans visage |
| Commercial | Étapes et durées concrètes, temps client explicité | Aucun prix, formulaire mal priorisé, rien pour la recommandation |
| Lisibilité | Phrases courtes, design sobre | 11 sections et 4 démos : effet showroom |
| Technique | Performance et sécurité exemplaires | SEO de base absent, « à compléter » visible |
| Technologique | « Qui décide quoi » exemplaire | Absolus invérifiables, pile technique surpromise |

---

# PARTIE 2 — Analyse de la V2 (sosese.tech/v2)

## 2.1 Fiche d'identité

| Mesure | Valeur (observé) |
|---|---|
| Pages | Accueil, Accompagnement, Réalisation (Atelier des Sols & Fils), Éditeurs, À propos, Contact, Mentions légales, Confidentialité |
| Sections de l'accueil | 7 : Hero → Réalisation → Besoins → Méthode → Interlocuteur → Questions (3) → CTA final |
| Mots visibles sur l'accueil | ≈ 640 (**−64 %** par rapport à la V1) |
| Poids HTML de l'accueil | 36 ko (8,9 ko gzip) |
| H1 | « Moins de ressaisie. Plus de temps pour votre métier. » |
| Surtitre du hero | « INDÉPENDANTS, TPE ET PME · METZ ET ALENTOURS » |
| CTA | « Parlons de votre besoin », avec texte d'accompagnement en fin de page |
| Humain identifié | **Joris Chamvoux**, nommé, avec lien LinkedIn, sans photo |
| Open Graph | Oui, sauf `og:image` |
| Indexation | `noindex` (normal pour une préversion) |
| Formulaire | Désactivé, contact par `mailto:` |

## 2.2 Test des 10 secondes

**Ce qu'un dirigeant messin comprend (observé) :**
- « C'est pour moi » : indépendants, TPE, PME, Metz ;
- « ça réduit la ressaisie » ;
- « devis, fiches clients » ;
- « ils sont sur place dans un rayon de 80 km » ;
- « ils ont une réalisation ».

C'est nettement mieux que la V1 sur le **qui** et le **où**.

**Ce qu'il ne comprend toujours pas :**
- pourquoi sosese plutôt qu'un autre (le titre pourrait être celui de Hutch ou d'Anacod) ;
- combien ;
- comment se passe concrètement la première étape, et en combien de temps.

## 2.3 Stratégie et positionnement

**V2-S-F1 — Cible et zone nommées d'emblée.** « Indépendants, TPE et PME · Metz et alentours », plus « Sur place à Metz et dans un rayon d'environ 80 km » sous les CTA. Le visiteur recommandé se sait au bon endroit, et le lien avec la cible confirmée est rétabli.

**V2-S-F2 — La preuve en deuxième position.** Le cas L'Atelier des Sols & Fils arrive juste après le hero, avec la comparaison 40 min → 2 min en barres. C'est l'application directe de la recommandation « montrer avant d'affirmer ». Pour un visiteur venu vérifier une recommandation, c'est exactement le bon ordre.

**V2-S-F3 — Une catégorie plus juste : « automatisations… avec de l'IA quand elle est utile ».** La V2 sort du rayon « agence IA » et vend un résultat (moins de ressaisie). C'est plus crédible et moins exposé à la fatigue face à l'IA.

**V2-S-F4 — Une porte d'entrée séparée pour les éditeurs.** La page `/editeurs` existe et parle leur langue (API, permissions, reprise sur erreur, MCP). C'est cohérent avec l'objectif secondaire.

**V2-S-W1 — Toujours pas d'attribut unique dans le message principal.** La V2 a corrigé le « qui » et le « où », mais pas le « pourquoi nous ». « Moins de ressaisie. Plus de temps pour votre métier. » décrit la catégorie entière. L'attribut distinctif (dicté sur le terrain, prêt dans votre logiciel métier, en service chez un voisin) n'apparaît qu'en H2, sous une formulation indirecte (« Le devis commence sur le chantier »). Dunford : la valeur unique doit être **évidente** pour la cible dans le contexte choisi [S8].

**V2-S-W2 — Une prudence si forte qu'elle affaiblit le propos.** C'est le défaut le plus important de la V2. L'audit du 21/09 demandait de **ne pas promettre ce qui n'est pas prouvé**. La V2 l'a traduit par **ajouter des avertissements partout**. Relevé (observé) :

| Page | Formulation |
|---|---|
| Accueil | « Durées rapportées pour ce cas client. Elles ne constituent pas une promesse de résultat pour un autre projet. » |
| Accueil | « Chaque exemple est soumis à la faisabilité dans vos logiciels. Le cas Extrabat est une réalisation ; les autres sont des pistes à étudier. » |
| Accueil | « Illustration du fonctionnement · données fictives » (+ équivalent en texte masqué) |
| Réalisation | « **Le nombre de mesures et le protocole de chronométrage ne sont pas documentés ici.** Ces résultats ne constituent ni une moyenne garantie, ni une prévision pour un autre projet. » |
| Réalisation | « Les "+" indiquent des planchers. » |
| Réalisation | « La mention d'Extrabat… n'implique pas de partenariat avec son éditeur. » |
| Réalisation | « Les noms, montants et contenus affichés sont fictifs » |
| Réalisation | « Un point de départ, pas une recette universelle. » |
| Accompagnement | « …peuvent rendre certaines idées impossibles ou disproportionnées » |
| Accompagnement | « Elles dépendent du projet. » / « Schéma de principe. Les validations sont définies pour chaque projet. » |
| Éditeurs | « Le modèle de partenariat, les engagements de support et les conditions de diffusion sont à définir ensemble. » |
| Éditeurs | « …ne constituent pas une garantie applicable à toute intégration. » |

Environ **quatorze réserves** pour environ 3 000 mots sur l'ensemble des pages. Trois effets (jugement) :
1. **La seule preuve est sabotée par son propre auteur.** « Le protocole de chronométrage n'est pas documenté » invite le lecteur à douter d'un chiffre qu'il aurait cru sans cette phrase.
2. **Le ton projette un manque d'assurance.** Un dirigeant de TPE qui achète du sur-mesure achète d'abord la confiance que le prestataire a en lui-même. NN/g cite la « divulgation franche » comme facteur de confiance [S4], mais il s'agit de dire clairement les faits (prix, conditions), pas de multiplier les réserves.
3. **Le texte ressemble à une notice juridique.** Certaines mentions sont utiles (le non-partenariat avec Extrabat, « données fictives »). Les autres doivent être remplacées par des **précisions positives** (voir §3.4.2).

**V2-S-W3 — « Un projet porté par Joris Chamvoux » : le mot « projet » dit « pas encore une entreprise ».** Le lecteur entend : initiative personnelle, peut-être temporaire. C'est honnête sur le statut juridique en cours, mais la formule met l'incertitude au premier plan. Formulation plus juste : « sosese, c'est Joris Chamvoux. Je… ».

**V2-S-W4 — Les éditeurs ont 25 % de la navigation principale.** « Éditeurs » est l'un des quatre liens du menu. Pour la cible prioritaire (un artisan messin), c'est un lien qui ne le concerne pas et qui brouille « à qui parle ce site ? ». La page Éditeurs est aussi **la plus longue du site** (≈ 870 mots, plus un schéma MCP en 13 temps) alors qu'elle vise l'audience secondaire.

## 2.4 Marketing et copywriting

**V2-M-F1 — Un surtitre et un sous-titre précis.** « Devis, fiches clients, recherche d'informations » nomme des objets concrets (principe Pennylane cité dans l'audit du 21/09). « avec de l'IA quand elle est utile » est une formulation honnête et différenciante face aux « agences IA ».

**V2-M-F2 — Quelques lignes excellentes.**
- « **Préparer une action n'est pas l'exécuter.** » C'est la meilleure formulation des deux versions sur le contrôle humain : sept mots, visualisable, vraie.
- « **Vérifier l'utilité avant de construire.** » Un bon H2 de méthode, qui dit une posture.
- « Le devis commence sur le chantier. » C'est concret.
- « N'envoyez pas de données clients confidentielles. » : une microcopie qui montre le sérieux sans l'affirmer.

**V2-M-F3 — La page Réalisation est bien construite.** Contexte → projet (client, métier, logiciel) → résultats → fonctionnement → transposition → CTA. C'est la structure recommandée pour une étude de cas B2B : persona, problème, solution, résultats chiffrés, impact. Il ne manque que la citation d'un interlocuteur nommé.

**V2-M-W1 — Un H1 générique.** « Moins de ressaisie. Plus de temps pour votre métier. » échoue aux trois tests de Harry Dry [S10] :
- **Visualiser ?** Moyen : « ressaisie » est concret, « plus de temps pour votre métier » est une abstraction universelle.
- **Falsifier ?** Non : rien de vérifiable.
- **Unique ?** Non : Hutch écrit « Le dirigeant d'une PME ou TPE ne devrait pas passer ses journées sur la facturation, les relances et l'administratif », et Obat « qui vous fait gagner du temps et de l'argent ».

Et « Plus de temps pour votre métier » est **la promesse du logiciel de gestion lui-même** (Obat, Extrabat) : on se range à côté de l'outil du client au lieu de se positionner comme ce qui le rend meilleur.

**V2-M-W2 — Un abus de phrases nominales qui remplacent l'action.** Relevé :
- « Un périmètre vérifiable. »
- « Une solution à prendre en main. »
- « Du terrain à la solution. »
- « Partir d'une tâche qui revient. »
- « Un projet à taille humaine. »
- « À chaque étape, une décision claire. »
- « Des données dispersées dans vos outils peuvent devenir une réponse exploitable. »

Ce sont des étiquettes, pas des images. Le lecteur ne voit ni qui fait quoi, ni ce qu'il reçoit. Comparaison avec la V1 : « La même information, tapée trois fois » montre une scène ; « Arrêter de saisir deux fois » (V2) dit la même chose mais sans la scène.

**V2-M-W3 — « Nous » ou « je » : une voix incohérente.** Le site dit « Nous commençons par une tâche », « nous proposons », mais aussi « sosese est un projet porté par Joris Chamvoux » et « Consulter **mon** parcours sur LinkedIn ». La page Contact reprend « **On** vous répond franchement » (reste de la V1). Le lecteur ne sait pas s'il parle à une personne ou à une équipe. Pour une activité solo, **le « je » est un atout** (proximité, responsabilité, voix humaine type Basecamp). Le « nous » donne une impression d'agence sans en avoir les preuves.

**V2-M-W4 — La voix du client a disparu.** Aucune citation de Jason ni de L'Atelier des Sols & Fils. Les meilleures objections formulées par le client de la V1 (« Et si elle invente un prix ? ») ont été remplacées par des questions plus neutres (« L'IA agit-elle toute seule ? »). Le guide de copywriting du dépôt et toutes les références convergent sur ce point : la voix du client est le levier le plus fort.

**V2-M-W5 — Le problème a disparu.** La section Constat de la V1 (la même info tapée trois fois, l'info introuvable, la personne absente) a été supprimée. La V2 va directement de la promesse à la preuve, puis à l'offre. Pour un visiteur recommandé, c'est acceptable. Mais pour un dirigeant « conscient du problème » (Schwartz [S9]) qui ne s'est jamais dit qu'on pouvait automatiser un devis, le déclic « c'est exactement ma journée » manque.

**V2-M-W6 — Des redondances entre pages.** Les trois cartes « Arrêter de saisir deux fois / Préparer vos devis plus vite / Retrouver une information utile » sont reproduites **mot pour mot** sur l'accueil et sur `/accompagnement`. Le CTA final « Quelle tâche aimeriez-vous simplifier ? » est identique sur toutes les pages.

**V2-M-W7 — Une microcopie du CTA centrée sur sosese.** « Un premier échange pour **vérifier l'intérêt du projet** » : l'intérêt de qui ? Le lecteur entend « pour que sosese vérifie si je vaux la peine ». À réécrire côté client : « 30 minutes, offertes, pour savoir si votre tâche vaut la peine d'être automatisée. »

## 2.5 Commercial et conversion

**V2-C-F1 — La page Accompagnement parle budget et suivi.** « La proposition précise les livrables, les exclusions, le calendrier envisagé et le coût de réalisation. Les abonnements ou frais d'usage nécessaires sont identifiés séparément. » Pour un dirigeant, c'est rassurant : pas de frais cachés, les coûts récurrents sont annoncés.

**V2-C-F2 — Un humain joignable.** Nom, LinkedIn et zone. Un visiteur recommandé peut vérifier la personne en un clic. C'est l'élément qui manquait le plus en V1.

**V2-C-F3 — « Pour préparer l'échange : le nom de vos outils, un exemple de tâche répétée et la fréquence » :** cette ligne abaisse la barrière d'entrée tout en qualifiant la demande.

**V2-C-W1 — L'offre n'a plus de forme.** La V1 avait trois étapes nommées et chiffrées en jours (Atelier 2 j → Feuille de route 1 sem → Construction 4 sem). La V2 a quatre étapes génériques (Choisir → Vérifier → Tester → Mettre en service), **sans aucune durée ni aucun prix**. Le visiteur ne sait pas ce qu'il achète en premier, ni si c'est payant, ni en combien de temps. C'est une régression commerciale nette.

**V2-C-W2 — Toujours aucun prix.** « Le prix dépend du périmètre, des outils à connecter et du suivi attendu. » C'est la même impasse qu'en V1 (voir V1-C-W1 et [S2][S3]). Tu as confirmé qu'une fourchette est affichable : c'est le changement le plus rentable à faire.

**V2-C-W3 — Contact par `mailto:` seulement.** Sur un ordinateur sans client mail configuré (le cas fréquent des utilisateurs de webmail), le bouton n'ouvre rien ou ouvre une application vide. C'est acceptable en préversion, mais **bloquant pour une bascule en production**. Le formulaire V1 (avec son endpoint Fastify) doit revenir, simplifié (voir §3.4.4).

**V2-C-W4 — Pas de téléphone, pas de prise de rendez-vous.** C'est la même remarque qu'en V1 (V1-C-W3), mais plus sensible ici puisque le formulaire a disparu.

**V2-C-W5 — La page Éditeurs ne formule pas de demande claire.** « Partons d'un usage de vos clients. Présentez votre logiciel, un usage envisagé et les accès disponibles. » Un éditeur ne sait pas ce que sosese lui propose concrètement : un connecteur déjà prêt pour ses clients ? du conseil ? une prestation de développement ? un partenariat commercial ? H1 vague : « Relier votre logiciel aux nouveaux usages de vos clients. »

## 2.6 Lisibilité et expérience

**V2-L-F1 — Une page d'accueil deux fois et demie plus courte, avec une hiérarchie nette.** Sept sections, un seul visuel animé, des cartes aérées. La pleine page tient en environ 5 000 px, contre 11 000 en V1 (observé). On lit la page au lieu de la parcourir.

**V2-L-F2 — Sur mobile, le hero est propre.** Surtitre, titre, sous-titre, CTA principal, lien secondaire et zone s'empilent sans recouvrement (observé, 390 px). Pas de bouton flottant qui masque le contenu.

**V2-L-F3 — Les données fictives sont signalées.** « Illustration du fonctionnement · données fictives » sous le visuel : c'est le bon niveau de transparence, discret et à sa place.

**V2-L-W1 — Une page plus monotone.** Moins de formes, moins de démos : la page est plus lisible, mais aussi moins mémorable. Les sections Besoins, Méthode et Interlocuteur ont la même structure (surtitre, H2, paragraphe gris, trois colonnes). Seul le bloc de preuve apporte un contraste visuel.

**V2-L-W2 — La section « Interlocuteur » est un paragraphe sans visage.** Sur une page épurée, un portrait de Joris serait l'élément visuel le plus fort et le plus rassurant. NN/g : les photos de vraies personnes renforcent la confiance, les photos de banque d'images la détruisent [S5].

**V2-L-W3 — Le schéma MCP de la page Éditeurs est lourd sur mobile.** Treize temps, trois conteneurs, défilement horizontal. Ce schéma impressionne un CTO, mais il est illisible sur téléphone et n'a pas sa place dans le premier contact.

## 2.7 Technique

**V2-T-F1 — Toutes les forces techniques de la V1 sont conservées, avec un HTML trois fois plus léger.** Mêmes en-têtes de sécurité, `noindex` doublé dans le HTML et dans l'en-tête HTTP (préversion bien isolée), Open Graph ajouté, `<title>` localisés (« Automatisation pour TPE et PME autour de Metz », « Devis dictés sur chantier dans Extrabat : le cas Atelier des Sols & Fils »). **Ces titres sont nettement meilleurs pour le SEO local.**

**V2-T-F2 — Une architecture propre de cohabitation.** V1 figée dans `legacy-v1`, V2 sous `/v2`, un conteneur, sans DNS supplémentaire (source : `DESIGN.md` de la branche). Des tests `contact.test.mjs` et `motion.test.mjs` ont été ajoutés.

**V2-T-W1 — À traiter avant bascule (observé) :**
- pas d'`og:image` : c'est **le défaut le plus coûteux pour un canal de recommandation**, car un lien partagé sur WhatsApp ou LinkedIn arrive sans visuel ;
- aucun JSON-LD (la V1 avait au moins `FAQPage`) : prévoir `Organization`/`LocalBusiness` avec `areaServed`, `Person` pour Joris, `Service` ;
- `robots.txt` et `sitemap.xml` : toujours 404 ;
- formulaire désactivé (V2-C-W3) ;
- redirections : les ancres V1 (`/#methode`, `/#offre`, `/#cas-client`) et l'URL `/v2` doivent être redirigées ou remplacées lors de la bascule ;
- mentions légales : mêmes 10 champs « à compléter » (hors plan, voir V1-T-W3).

**V2-T-W2 — Petite incohérence de titre.** La page `/v2/contact` a pour H1 « Parlons de votre besoin », mais pour `<title>` « Parlons de vos tâches répétitives » (reste de la V1).

## 2.8 Technologique

**V2-TE-F1 — Les absolus sont retirés.** Plus de « il ne reste rien » ni de « ne quittent pas l'Europe ». Le texte dit maintenant : « Les données nécessaires, les services utilisés et les droits accordés sont explicités dans le périmètre. » Ce n'est plus une garantie universelle mais un engagement de méthode. C'est juste.

**V2-TE-F2 — La gestion des erreurs est mentionnée.** « Une automatisation doit aussi prévoir ce qui se passe lorsqu'une information manque ou qu'un logiciel ne répond pas. » Pour un prospect technique, cette phrase signale plus de maturité que toute la pile technique listée en V1.

**V2-TE-F3 — Une vraie démonstration de compétence sur la page Éditeurs.** Le schéma MCP (compétence chargée côté client, jeton jamais exposé au modèle, adaptateur « un outil = plusieurs routes », normalisation) montre une compréhension réelle de l'architecture d'intégration d'agents en 2026. Pour un éditeur, c'est crédible.

**V2-TE-W1 — Plus aucun repère technique sur le parcours principal.** La V1 en disait trop (V1-TE-W1). La V2 n'en dit plus rien hors page Éditeurs. Le prestataire informatique d'un artisan, ou le dirigeant un peu technophile, ne trouve aucune fiche factuelle : fournisseur de modèle, région d'hébergement, durée de conservation des journaux, propriété des clés d'API, révocation des accès. C'est pourtant la question que pose le dirigeant **après** le premier rendez-vous (« mon informaticien veut savoir… »).

**V2-TE-W2 — Le tableau « Qui décide quoi » de la V1 est réduit à un schéma à trois étapes.** « Le devis est préparé → Vous vérifiez → L'action est exécutée » est juste mais moins riche que la liste V1 « Elle avance seule / Elle s'arrête net », qui répondait précisément à « qu'est-ce qu'elle peut faire sans moi ? ».

## 2.9 Pages secondaires en bref

| Page | Point fort | Point faible | Piste |
|---|---|---|---|
| **À propos** | Nom, lien LinkedIn, zone, public cible explicite (« jusqu'à environ 50 salariés ») | Pas de photo ; « projet porté par » ; aucun élément de parcours (métier d'origine, années, pourquoi sosese) ; trois « repères » abstraits | Page en « je », photo, 3 lignes de parcours vérifiable, pourquoi ce projet, lien vers le cas |
| **Accompagnement** | Budget et suivi abordés ; schéma de validation ; « N'envoyez pas de données confidentielles » | Aucune durée, aucun prix, aucun nom d'offre ; cartes dupliquées de l'accueil | Offre d'entrée nommée, fourchette, calendrier type |
| **Réalisation** | Structure de cas exemplaire ; titre de page optimisé ; lien vers le site du client | Réserves qui sabotent les chiffres ; pas de citation ; « Pessac » ; « 3 rapports d'analyse annuels » ambigu | Protocole de mesure écrit en positif, citation de Jason, détail local, date de mise en service |
| **Éditeurs** | Compétence technique démontrée ; questions pertinentes (API, auth, doublons, versions) | Demande floue ; page la plus longue du site pour l'audience secondaire ; schéma lourd sur mobile | H1 explicite + 3 formes de collaboration possibles ; schéma replié ; sortir du menu principal |
| **Contact** | « Ce qui se passe ensuite » en trois étapes ; zone d'intervention affichée | `mailto:` seul ; « On » vs « nous » ; `<title>` incohérent | Formulaire court (voir §3.4.4), délai de réponse annoncé, téléphone |

## 2.10 Synthèse V2

| Spécialité | Force principale | Faiblesse principale |
|---|---|---|
| Stratégie | Cible, zone et preuve au bon endroit | Pas d'attribut unique dans le message ; excès de réserves |
| Marketing | Précision, honnêteté, « Préparer une action n'est pas l'exécuter » | H1 générique, phrases nominales, voix incohérente, plus de voix du client |
| Commercial | Budget et suivi abordés, humain identifié | Offre sans forme, sans durée ni prix ; `mailto:` seul |
| Lisibilité | −64 % de texte, hiérarchie claire, mobile propre | Monotonie, section interlocuteur sans visage |
| Technique | Plus léger, titres SEO localisés, OG présent | Pas d'`og:image`, pas de JSON-LD, formulaire à restaurer |
| Technologique | Absolus retirés, gestion d'erreur évoquée, schéma MCP crédible | Aucune fiche factuelle pour le prestataire informatique sur le parcours principal |

---

# PARTIE 3 — Comparaison, arbitrage et plan d'action

## 3.1 Comparaison point par point

Notes sur 5 : **jugement d'expert**, pour hiérarchiser, pas pour mesurer.

| # | Critère | V1 | V2 | Avantage | Justification |
|---|---|:-:|:-:|:-:|---|
| 1 | Clarté de la proposition en 10 s | 3 | 4 | **V2** | La V2 ajoute qui et où ; aucune ne dit « pourquoi nous » |
| 2 | Singularité du titre | 2 | 2 | = | Les deux titres sont interchangeables avec ceux des concurrents |
| 3 | Adéquation à la cible 0-50 salariés | 2 | 4 | **V2** | « PME » et « 15 à 150 » (V1) contre « Indépendants, TPE et PME » (V2) |
| 4 | Ancrage local | 0 | 4 | **V2** | Absent en V1 ; surtitre, sous-CTA, pied de page et `<title>` en V2 |
| 5 | Catégorie de marché | 2 | 3 | **V2** | « IA sur-mesure » (saturée) contre « automatisations, avec de l'IA quand utile » |
| 6 | Position de la preuve | 2 | 5 | **V2** | 6e section contre 2e section |
| 7 | Qualité de la preuve | 3 | 3 | = | La V2 structure mieux mais affaiblit les chiffres par ses réserves ; aucune citation dans les deux |
| 8 | Honnêteté des affirmations | 2 | 4 | **V2** | Absolus invérifiables (V1) contre engagements de méthode (V2) ; la V2 en fait trop dans l'autre sens |
| 9 | Assurance du ton | 4 | 2 | **V1** | La V1 affirme ; la V2 se couvre (~14 réserves) |
| 10 | Formulations mémorables | 4 | 3 | **V1** | « Et si elle invente un prix ? », « La même information, tapée trois fois » contre « Préparer une action n'est pas l'exécuter » |
| 11 | Concision et redondance | 2 | 4 | **V2** | 1 770 contre 640 mots ; mais la V2 duplique ses cartes entre pages |
| 12 | Section problème (PAS) | 4 | 1 | **V1** | Supprimée en V2 |
| 13 | Démonstration visuelle | 4 | 3 | **V1** | La V1 montre plus ; la V2 garde le hero et la démo sur la page Réalisation |
| 14 | Incarnation (qui est derrière) | 0 | 3 | **V2** | Nom et LinkedIn, mais pas de photo et « projet porté par » |
| 15 | Cohérence de la voix | 3 | 2 | **V1** | « on » cohérent en V1 ; « nous / je / on » mélangés en V2 |
| 16 | Forme de l'offre (étapes, durées) | 4 | 2 | **V1** | Atelier 2 j / feuille de route 1 sem / construction 4 sem contre étapes sans durée |
| 17 | Signal de prix | 1 | 1 | = | « Ça dépend » dans les deux |
| 18 | Coûts récurrents et suivi | 2 | 4 | **V2** | Abonnements et frais d'usage annoncés séparément en V2 |
| 19 | Friction de contact | 3 | 2 | **V1** | Le formulaire V1 est perfectible mais fonctionne ; la V2 n'a que `mailto:` |
| 20 | Réassurance sous le CTA | 1 | 3 | **V2** | Absente en V1 ; présente en V2 mais centrée sur sosese |
| 21 | Contrôle humain expliqué | 5 | 4 | **V1** | Liste « avance seule / s'arrête net » (V1) plus complète que le schéma à 3 étapes |
| 22 | Crédibilité technique pour un informaticien | 2 | 3 | **V2** | La pile V1 contredit ses promesses ; la page Éditeurs V2 est crédible mais hors parcours |
| 23 | Parcours éditeurs | 0 | 3 | **V2** | Inexistant en V1 ; présent mais flou et surdimensionné en V2 |
| 24 | Partage et recommandation (OG, page de cas) | 0 | 3 | **V2** | La V2 a OG et une page de cas, mais pas d'image OG |
| 25 | SEO local (titres, contenu) | 1 | 3 | **V2** | Titres localisés en V2 ; `noindex`, pas de JSON-LD ni de sitemap |
| 26 | Lisibilité mobile | 3 | 4 | **V2** | Bouton flottant qui masque la démo (V1) ; hero propre (V2) |
| 27 | Performance et poids | 4 | 5 | **V2** | 20,6 contre 8,9 ko gzip |
| 28 | Signes d'inachèvement visibles | 1 | 3 | **V2** | « à compléter » sur l'accueil V1 ; formulaire désactivé et mentions légales en V2 |
| | **Total indicatif (/140)** | **64** | **87** | **V2** | |

**Lecture :** la V2 gagne 17 critères, la V1 en gagne 8, avec 3 égalités. **Mais les critères gagnés par la V1 sont ceux qui font signer** : assurance, offre concrète, problème ressenti, démonstration, contrôle humain détaillé, formulaire. La V2 a corrigé la **justesse** du site, mais la **force de persuasion** de la V1 n'a pas été transférée.

## 3.2 Ce que révèle la comparaison

1. **La V2 corrige le « qui / où / quoi ». Aucune des deux ne dit « pourquoi toi ».** Le chantier prioritaire n'est plus la structure mais le **positionnement exprimé** (titre, surtitre, première phrase).
2. **La V2 est passée d'un excès à l'excès inverse.** De l'affirmation invérifiable à la réserve systématique. La bonne position est entre les deux : **affirmer uniquement ce qui est vrai, mais l'affirmer franchement, avec la source.**
3. **La V2 a jeté des éléments de la V1 qui marchaient.** Durées, temps client, section problème, « Et si elle invente un prix ? », la liste « Qui décide quoi ». Ces éléments n'étaient pas la cause de la surcharge (c'était la redondance et le nombre de démos).
4. **Aucune des deux ne vend une première étape achetable.** C'est le trou commercial commun, et le seul qui dépend de toi plutôt que de la rédaction.

## 3.3 Arbitrage : partir de la V2, réinjecter la V1

**Recommandation : la V2 devient le socle d'une V3.** Pas l'inverse, parce que la V2 a résolu les problèmes structurels : ordre des sections, cible, zone, incarnation, page de cas, honnêteté, poids. Les problèmes de la V2 sont **éditoriaux et commerciaux**, donc beaucoup moins coûteux à corriger que ceux de la V1.

### Les 12 emprunts à la V1

| # | Élément V1 | Où le réinjecter en V3 | Condition |
|---|---|---|---|
| E1 | Section Constat (3 scènes : tapée trois fois / introuvable / personne absente) | Accueil, entre la preuve et les besoins, **condensée** (3 lignes, pas 3 cartes) | Garder les titres-scènes, supprimer les étiquettes « perte de temps / risque d'erreur » |
| E2 | « Le temps que personne n'a décidé de perdre » | H2 de cette section | — |
| E3 | Durées de la méthode (2 j / 1 sem / 3-6 sem) | Accueil (Méthode) et Accompagnement | Durées réellement tenables, validées par toi |
| E4 | « Votre temps : une demi-journée / 1 h / 1 h par semaine » | Idem | Idem |
| E5 | FAQ « Et si elle invente un prix ? » (reformulée « Et si l'IA invente un prix ? ») | FAQ de l'accueil (remplace ou complète « L'IA agit-elle toute seule ? ») | Réponse V1 conservée, elle est exacte |
| E6 | Liste « avance seule / s'arrête net » | Accompagnement, section « Garder la main », à la place ou en complément du schéma à 3 étapes | Vérifier que chaque ligne est vraie pour le cas livré |
| E7 | Démo « Enchaînement client » (fiche → devis → intervention → analyse) | Page Réalisation (déjà présente) | Remplacer « Pessac » par une commune fictive de Moselle |
| E8 | CTA final « Qu'est-ce qui vous prend le plus de temps ? » | Titre du CTA final (plus direct que « Quelle tâche aimeriez-vous simplifier ? ») | — |
| E9 | « Dites-le nous. On vous répond franchement : ce qui mérite d'être automatisé chez vous, et ce qui n'en vaut pas la peine. » | Sous-titre du CTA final, en « je » | Passer en « je » |
| E10 | « Si un outil ne permet aucune connexion, on vous le dit dès l'atelier, avant tout engagement. » | FAQ « Faut-il changer de logiciel ? » | Remplace la réponse V2, plus impersonnelle |
| E11 | Formulaire fonctionnel avec endpoint Fastify | `/contact` | Simplifié (voir §3.4.4) |
| E12 | « Elle ne calcule jamais un prix elle-même : elle lit vos tarifs » | Bloc de preuve ou FAQ | Remplacer « elle » par « l'outil » ou « l'assistant » |

### Ce qu'on ne reprend pas de la V1

- surtitre « IA sur-mesure pour PME » ;
- « Ils nous ont fait confiance » et l'onglet « Clients » ;
- absolus sur les données ;
- terminal fictif « PME industrie » ;
- pile technique affichée en liste ;
- rotation à 8 scénarios sur l'accueil (éventuellement sur une page « Exemples », en option) ;
- bandeau d'engagements en police de terminal ;
- pronom « elle » pour la solution.

## 3.4 Pistes d'amélioration consolidées

### 3.4.1 Positionnement : trouver la phrase que personne d'autre ne peut signer

**Méthode Dunford appliquée à sosese [S8] :**

| Composante | Proposition (à valider) |
|---|---|
| **Alternatives réelles** | Ressaisir le soir au bureau ; attendre que l'éditeur du logiciel ajoute la fonction ; un abonnement IA générique (ChatGPT) qui ne touche pas au logiciel ; une agence IA nationale ; le neveu ou le prestataire informatique qui « fait du Make » |
| **Attributs uniques** | (1) Une intégration **en service** dans le logiciel métier d'un client (Extrabat) ; (2) une saisie **dictée sur le terrain** qui arrive prête à valider ; (3) le prix vient toujours du catalogue du client, jamais de l'IA ; (4) une personne identifiable, sur place à moins de 80 km ; (5) pas de nouveau logiciel à adopter |
| **Valeur** | Le devis, la fiche client et le rendez-vous sont faits **au moment où l'information est fraîche**, sur place, au lieu de s'empiler pour le soir |
| **Clients qui y tiennent le plus** | Entreprises de terrain de 1 à 30 personnes (second œuvre, rénovation, chauffage, menuiserie, paysage, piscine, dépannage) qui ont un logiciel de gestion et où le dirigeant ou le commercial chiffre lui-même |
| **Catégorie** | Pas « agence IA ». Plutôt : **« assistant de saisie pour les entreprises de terrain, branché sur votre logiciel de gestion »** |

**Remarque stratégique (jugement, appuyé sur Baker [S11]) :** Extrabat revendique plus de 41 000 utilisateurs dans le bâtiment, le chauffage, la piscine, le paysage et la menuiserie. Il propose une place de marché d'intégrations (observé sur extrabat.com). C'est un **segment d'entrée naturel** : une intégration déjà en service, une cible nombreuse, une communauté d'utilisateurs, et un pont direct vers l'objectif « éditeurs ». Sans fermer la porte aux autres logiciels, **le premier message pourrait parler aux entreprises de terrain**, et les pages secondaires parler des autres cas.

**Trois propositions de hero à tester (5 dirigeants de ton réseau, test des 5 secondes : « de quoi parle ce site, pour qui, que feriez-vous ensuite ? ») :**

> **Option A — Terrain (recommandée)**
> *Surtitre :* Entreprises de terrain · Metz et 80 km autour
> # Le devis dicté sur le chantier. Prêt dans votre logiciel avant de remonter dans le camion.
> Je relie vos notes vocales, vos appels et vos demandes à votre logiciel de gestion pour préparer devis, fiches clients et rendez-vous. Rien ne part sans votre validation.
> **[Décrire ma tâche →]** · Voir le cas L'Atelier des Sols & Fils
> *30 min offertes, sur place ou en visio · réponse sous [48 h]*

> **Option B — Voix du client, plus large**
> *Surtitre :* Indépendants, TPE et PME · Metz et 80 km autour
> # Vos logiciels ne se parlent pas. Je les relie.
> Ce que vous tapez deux fois (devis, fiches clients, rendez-vous) est préparé à partir de vos notes et de vos outils actuels. Vous validez, c'est enregistré.
> **[Décrire ma tâche →]** · Voir une réalisation

> **Option C — Garder la V2, en plus concrète**
> # Moins de ressaisie. Le devis part du chantier, pas du bureau.
> (sous-titre V2 conservé, passé en « je »)

**Pourquoi A :** elle passe les trois tests de Harry Dry [S10].
- **Visualisable :** le chantier, le camion.
- **Falsifiable :** le devis est prêt ou il ne l'est pas.
- **Unique :** c'est ce que le cas prouve.

Elle parle aussi le vocabulaire d'Obat et d'Extrabat (« chantier », « intervention »). **Limite :** elle peut faire fuir un cabinet comptable ou un commerce. À trancher selon les 5 tests et les demandes reçues.

*« Avant de remonter dans le camion » est une image à valider avec Jason : si le devis se fait effectivement sur place, c'est vrai ; sinon, écrire « avant de quitter le chantier ».*

### 3.4.2 Preuve : transformer les réserves en précisions

**Règle d'écriture :** une réserve n'est utile que si elle protège le lecteur d'une vraie erreur de lecture. Sinon, la remplacer par l'information qui la rend inutile.

| Réserve actuelle (V2) | Réécriture proposée | Donnée à obtenir |
|---|---|---|
| « Le nombre de mesures et le protocole de chronométrage ne sont pas documentés ici. Ces résultats ne constituent ni une moyenne garantie, ni une prévision… » | « Mesuré par Jason sur [N] devis de [type] entre [mois] et [mois]. Votre gain dépendra de vos devis : on l'estime ensemble au diagnostic. » | N, période, type de devis, qui a mesuré |
| « Durées rapportées pour ce cas client. Elles ne constituent pas une promesse… » | « Chez L'Atelier des Sols & Fils, depuis [mois 2026]. » | Date de mise en service |
| « Chaque exemple est soumis à la faisabilité… les autres sont des pistes à étudier. » | Marquer visuellement « **Déjà en service** » sur la carte Devis et « **À étudier chez vous** » sur les deux autres, et supprimer la phrase | — |
| « Un point de départ, pas une recette universelle. » | « Votre logiciel n'est pas Extrabat ? Je vérifie en 30 minutes s'il peut être relié. » | Liste des logiciels déjà examinés (si existante) |
| « Les "+" indiquent des planchers. » | « Plus de 50 devis, 30 rendez-vous et 40 fiches clients en six semaines. » | — |
| « 3 rapports d'analyse annuels » | Préciser : « 3 analyses de l'activité sur l'année écoulée » (si c'est bien le sens) | Sens exact |

**À ajouter absolument :**
- **Une citation de Jason** (15 à 30 mots, prénom, rôle, entreprise, accord écrit archivé hors dépôt). Exemple de question pour l'obtenir : « Qu'est-ce qui a changé dans ta semaine depuis que tu dictes tes devis ? » Ne pas rédiger la citation à sa place.
- **Le rôle exact de Jason** : commercial ou dirigeant ? L'audit du 21/09 relevait une contradiction dans le dépôt.
- **La date de mise en service.**

### 3.4.3 Offre : une première étape achetable, avec une fourchette

Le modèle éprouvé pour un prestataire solo : une petite prestation d'entrée à prix fixe, qui qualifie le client, produit de la valeur en elle-même et prépare le projet [S12]. Arborys l'applique avec un audit à 240 € HT, Hutch avec « dès 1 000 € ». NN/g : montrer des prix pour des scénarios représentatifs [S3].

**Proposition de structure (tous les montants sont à fournir par toi) :**

| Étape | Nom proposé | Contenu | Durée | Prix |
|---|---|---|---|---|
| 0 | **Premier échange** | 30 min, sur place (Metz + 80 km) ou en visio : votre tâche, vos outils, un premier avis franc | Sous [N] jours | Offert |
| 1 | **Diagnostic terrain** | ½ journée avec vous et la personne qui fait la tâche + restitution écrite : 3 tâches classées, compatibilité de vos logiciels, fourchette par tâche | 1 semaine | [Prix fixe] *(option : déduit si le projet suit)* |
| 2 | **Première automatisation** | Une tâche, testée sur vos cas réels, mise en service, documentée | 3 à 6 semaines | **Entre [X] et [Y] € HT** + frais d'usage estimés à [Z] €/mois |
| 3 | **Suivi** (optionnel) | Surveillance, corrections, petites évolutions | Mensuel | [À définir] ou « sur devis » |

**Scénario représentatif à afficher** (principe NN/g [S3]) :
> *Exemple : devis préparés à partir d'une note dictée, dans votre logiciel de gestion : de [X] à [Y] € HT, selon les accès de votre logiciel et le nombre d'articles.*

Si un montant n'est pas encore stabilisé, **afficher le format** (forfait par étape, pas de régie, pas d'engagement de durée), ce qui rassure déjà beaucoup. Ne jamais afficher de montant inventé : c'est une règle dure du projet (`null` = « à compléter »).

### 3.4.4 Contact : moins de champs, plus de canaux

**Formulaire V3 proposé :**

| Champ | Statut | Raison |
|---|---|---|
| Prénom et nom | Obligatoire | — |
| Email **ou** téléphone | Un des deux obligatoire | L'artisan préfère souvent être rappelé |
| « Quelle tâche vous prend le plus de temps ? » | **Obligatoire**, zone de texte, avec exemple en aide | C'est l'information qui qualifie |
| Logiciel utilisé | Facultatif, texte libre | Remplace la liste « secteur » |
| Entreprise | Facultatif | Un indépendant en création n'a pas de société |
| « Comment avez-vous connu sosese ? » | Facultatif | **Seule mesure du canal réseau** |
| Consentement | Obligatoire | — |

Baymard : la plupart des formulaires ont deux fois trop de champs visibles [S13]. Les règles sont à modifier dans `shared/contact.json` uniquement (client et serveur).

**Autres canaux à ajouter :**
- téléphone (si tu acceptes d'en afficher un) ;
- lien de prise de rendez-vous de 30 min, auto-hébergé ou via un outil compatible avec la CSP, **à décider** : pas de requête tierce aujourd'hui ;
- délai de réponse annoncé, s'il est tenable.

### 3.4.5 Incarnation : une personne, une voix

- **Voix : « je »** sur tout le site, sauf si des partenaires réels interviennent. C'est une décision à prendre (D2 au §3.7).
- **Photo de Joris** : réelle, naturelle, idéalement sur un chantier ou avec un client. Jamais générée par IA (règle `DESIGN.md`). Sur l'accueil (section Interlocuteur) et sur la page À propos.
- **À propos en quatre paragraphes courts** :
  1. qui je suis et d'où je viens (parcours vérifiable, cohérent avec LinkedIn) ;
  2. pourquoi sosese (le déclic : la ressaisie observée sur le terrain) ;
  3. ce que j'ai livré (lien vers le cas) ;
  4. comment je travaille et où (Metz + 80 km).
- Remplacer « un projet porté par » par « sosese, c'est Joris Chamvoux ».
- La page contient des éléments factuels à fournir (parcours, années d'expérience) : **ne rien inventer**, laisser des emplacements marqués.

### 3.4.6 Confiance technique : une fiche pour le prestataire informatique

Une page courte `/donnees` (ou une section d'Accompagnement) avec **uniquement des faits vérifiés pour le cas livré**, en langage clair :

| Question | Réponse (à remplir avec des faits réels) |
|---|---|
| Quel fournisseur de modèle d'IA, dans quelle région ? | [à compléter] |
| Les données servent-elles à entraîner un modèle ? | [selon les conditions contractuelles du fournisseur] |
| Que conserve la solution, et combien de temps ? | [journaux : durée ; règles métier : oui ; documents : ?] |
| Qui détient les clés d'API et les comptes ? | [au nom du client ?] |
| Comment révoquer l'accès ? | [procédure] |
| Que se passe-t-il si le logiciel ne répond pas ? | [comportement] |
| Où est hébergé ce site ? | Les en-têtes de sécurité et l'absence de traceurs peuvent être cités comme preuve de rigueur |

Ajouter la liste « avance seule / s'arrête net » (E6). Mentionner les obligations de transparence de l'AI Act applicables aux systèmes qui interagissent avec des personnes (article 50, dont l'application est prévue à partir d'août 2026 ; calendrier et champ exacts à vérifier) **seulement après vérification par un juriste**. Ça peut devenir un argument de sérieux auprès des TPE.

### 3.4.7 Recommandation : outiller le bouche-à-oreille

Le canal principal est le réseau. Le site doit donc être **facile à transmettre** :
- **Image Open Graph** (1200 × 630, dérivée des tokens) pour l'accueil **et une image dédiée pour la page Réalisation** : c'est le lien qui sera le plus partagé ;
- une **page Réalisation autonome et partageable**, avec un titre explicite (c'est déjà le cas) ;
- une **phrase de recommandation** facile à répéter, reprise sur le site : « Le devis dicté sur le chantier, prêt dans le logiciel » ;
- à terme, un **PDF d'une page** du cas client (même contenu), à laisser après un rendez-vous ;
- un profil **Google Business Profile** (Metz) : Google classe les résultats locaux selon la pertinence, la distance et la notoriété [S15]. Un prospect recommandé tape souvent « sosese Metz ».

### 3.4.8 Éditeurs : clarifier la demande et réduire le poids

- Retirer « Éditeurs » du menu principal. Le garder dans le pied de page, dans la section Interlocuteur (déjà présent) et sur la page Réalisation (« Vous éditez un logiciel métier ? »).
- H1 explicite, par exemple : « Vos utilisateurs dictent déjà leurs devis. Je peux le faire dans votre logiciel. » *(uniquement si c'est ton offre réelle)*.
- Énoncer les **formes de collaboration possibles** : prototype d'intégration financé par l'éditeur, connecteur référencé sur la place de marché de l'éditeur, retour d'expérience terrain. Seulement celles que tu es prêt à proposer.
- Replier le schéma MCP par défaut (déjà en `details`), et garder un résumé de 3 lignes au-dessus.

### 3.4.9 Réécritures ligne à ligne (V2 → V3)

| Emplacement | V2 | V3 proposée |
|---|---|---|
| Sous le CTA final | « Un premier échange pour vérifier l'intérêt du projet. » | « 30 minutes offertes pour savoir si votre tâche vaut la peine d'être automatisée. » |
| H2 Besoins | « Partir d'une tâche qui revient. » | « Trois tâches par où commencer. » |
| Carte 3 | « Des données dispersées dans vos outils peuvent devenir une réponse exploitable… » | « "On a vu M. Michel quand, la dernière fois ?" La réponse, sans ouvrir trois logiciels. » (scénario V1) |
| H2 Méthode | « Vérifier l'utilité avant de construire. » | *(conserver)* |
| Étapes | « Votre travail, vos outils / Un périmètre vérifiable / Une solution à prendre en main » | « 30 min pour en parler → ½ journée sur le terrain → 3 à 6 semaines pour la mettre en service » (avec « Votre temps ») |
| H2 Interlocuteur | « Du terrain à la solution. » | « Qui va venir chez vous. » + photo |
| Texte Interlocuteur | « sosese est un projet porté par Joris Chamvoux, autour de Metz. » | « Je suis Joris Chamvoux. Je viens [parcours]. J'ai conçu l'assistant de devis de L'Atelier des Sols & Fils, et je travaille autour de Metz. » |
| FAQ | « L'IA agit-elle toute seule ? » | « Et si l'IA invente un prix ? » (réponse V1) + garder « Elle agit toute seule ? » en 2e |
| FAQ coût | « Le prix dépend du périmètre… » | « Un diagnostic coûte [X] €. Une première automatisation, entre [X] et [Y] € HT, plus [Z] €/mois de frais d'usage. Le montant exact est dans la proposition, avant de commencer. » |
| Contact H1 / `<title>` | « Parlons de votre besoin » / « Parlons de vos tâches répétitives » | Aligner les deux : « Qu'est-ce qui vous prend le plus de temps ? » |

## 3.5 Sites d'inspiration

Ces références ont été consultées le 23/09/2026. Ce sont des **mécanismes** à reprendre, pas des modèles à copier. L'audit du 21/09 (§10) propose déjà Pennylane, Lucca, Basecamp, n8n, Dust et Thoughtworks : ces choix restent valables. Ci-dessous, des références **complémentaires**, choisies parce qu'elles sont des concurrents directs ou l'écosystème de la cible.

| Site | Ce qu'il fait bien | À reprendre pour sosese | À ne pas copier |
|---|---|---|---|
| **[Arborys IA](https://www.arborys-ia.com/fr/agence-ia-pme)** (agence IA TPE/PME) | Prestation d'entrée à **prix affiché** (audit 240 € HT, restitution sous 48-72 h) ; **deux portes d'entrée** (audit ou appel de 15 min avec le fondateur) ; se positionne explicitement **contre** les alternatives (conseil, intégrateurs, freelances) | Offre d'entrée nommée et chiffrée ; tableau « sosese plutôt que… » | L'étalage d'outils (n8n, Airtable, Make) ; la cible 1-250 |
| **[Hutch Agency](https://hutchagency.fr/automatisation-pour/pme-tpe/)** (automatisation PME, Pays de la Loire) | Prix d'appel (« dès 1 000 € ») ; **villes nommées** (Angers, Nantes, Cholet…) ; outils du client nommés (Pennylane, Sellsy) | Villes de Moselle et du Grand Est nommées (Metz, Thionville, Nancy selon le rayon) ; logiciels compatibles nommés quand c'est vérifié | Les promesses « 10 h/semaine » et « ROI en 30 jours » sans preuve publique |
| **[Tensoria](https://tensoria.fr/ia-btp)** (IA pour le BTP) | Page **verticale BTP**, témoignages par métier (dirigeant plombier-chauffagiste, conducteur de travaux) ; « quantités, prix et conformités restent contrôlés » | La verticalisation d'une page ; des témoignages rattachés à un métier | « 20+ missions » : ne pas afficher de volume qu'on n'a pas |
| **[Anacod](https://anacod.fr/)** (automatisation artisans et TPE) | **Contre-exemple utile** : « +65 % de productivité moyenne », « 100 % de satisfaction » et logos Qonto, OVHcloud, Vercel sur un site de petite structure | L'honnêteté de sosese est un **avantage concurrentiel** face à ce type d'affichage : ne pas la diluer dans des réserves, la **revendiquer** (« un client, des chiffres mesurés, pas de moyenne inventée ») | Tout le registre des chiffres invérifiables |
| **[Obat](https://www.obat.fr/)** (logiciel bâtiment) | Vocabulaire artisan (« rentabilité de chantier », « coûts réels ») ; témoignages signés par entreprise et métier (« MDLEC — Électricien ») ; avis Google affichés | Signer chaque preuve par **entreprise + métier** ; parler « chantier », « intervention » ; à terme, des avis Google | « N°1 », « tout-en-un » : c'est un éditeur, pas un prestataire |
| **[Extrabat](https://www.extrabat.com/)** (logiciel de la cible) | Liste de métiers ciblés ; **place de marché d'intégrations** (Ringover, OoDrive, SimplyMeet…) | Reprendre les **métiers** comme segments ; étudier les conditions d'entrée sur la place de marché (piste éditeur, **à vérifier**, ne pas annoncer de partenariat) | — |
| **[Basecamp](https://basecamp.com/)** *(déjà cité le 21/09)* | Une voix à la première personne, signée, directe | Page À propos et section Interlocuteur en « je » | Le ton provocateur |
| **[Marketing Examples](https://marketingexamples.com/)** (Harry Dry) | Ressource, pas modèle : des centaines d'exemples avant/après de titres concrets | Faire passer chaque titre V3 par les 3 tests (visualiser, falsifier, unique) | — |

**Priorité d'inspiration pour la V3 :** Arborys pour **l'offre**, Hutch pour **le local et le prix**, Tensoria et Obat pour **le vocabulaire métier et les témoignages**, Basecamp pour **la voix**. Anacod sert de rappel de ce qu'il ne faut pas devenir.

## 3.6 Le guide de copywriting du dépôt : à utiliser avec prudence

`guide_copywriting_prompts_llm.md` sert de référence aux sessions LLM. Il contient des **statistiques non sourcées** présentées comme des faits :
- « taux de conversion médian de 3,8 % » ;
- « +22 % de conversions avec PAS sur 12 000 pages » ;
- « titres de moins de 11 mots : +17 % sur mobile » ;
- « 45 à 90 minutes par jour économisées » ;
- « audit gratuit de 30 minutes ».

Risques :
1. Un LLM peut reprendre ces chiffres **dans le texte du site** comme s'ils étaient prouvés.
2. Des règles comme « <11 mots » sont traitées comme des lois alors qu'elles sont indicatives.
3. « 45 à 90 minutes par jour » est une promesse de gain que sosese ne peut pas garantir.

**Recommandation :** ajouter en tête de ce guide un avertissement « statistiques non vérifiées, ne jamais les citer sur le site ». Les cadres (PAS, BAB, FAB, 4P, niveaux de conscience) restent utiles. *(Ce rapport ne modifie pas le fichier : c'est le ticket `DOC-01`.)*

## 3.7 Plan d'action

### Décisions humaines préalables (bloquantes, 🔒)

| ID | Décision | Options | Recommandation |
|---|---|---|---|
| **D1** | Positionnement du hero | A (terrain) / B (voix du client, large) / C (V2 plus concrète) | Tester A et B auprès de 5 dirigeants du réseau (test des 5 secondes), puis trancher |
| **D2** | Voix | « je » / « nous » | « je », tant qu'aucun partenaire réel n'intervient |
| **D3** | Prix | Montant du diagnostic, fourchette de la première automatisation, frais d'usage types | Fournir au moins la fourchette ; sinon, afficher le format |
| **D4** | Offre d'entrée | Diagnostic payant / gratuit / déduit du projet | Payant et déduit si le projet suit |
| **D5** | Données du cas | N devis mesurés, période, date de mise en service, rôle de Jason, citation signée, sens de « 3 rapports » | À demander à L'Atelier des Sols & Fils |
| **D6** | Canaux de contact | Téléphone affiché ? prise de rendez-vous ? délai de réponse tenable ? | Téléphone + délai annoncé au minimum |
| **D7** | Éditeurs | Quelles formes de collaboration proposes-tu réellement ? | À lister avant de réécrire la page |
| **D8** | Photo | Portrait réel disponible ? | Oui, à faire sur le terrain |
| **D9** | Faits techniques | Fournisseur de modèle, région, rétention, propriété des clés pour le cas livré | Remplir la fiche §3.4.6 |

### Lots de travail

Ordre recommandé. **Une évolution à la fois, validation humaine entre chaque lot** (règle `CLAUDE.md`).

**Lot 0 — Correctifs immédiats de la V1 en production** (indépendants de l'arbitrage, petits)

| ID | Ticket | Fichiers | Critère d'acceptation |
|---|---|---|---|
| V1-FIX-01 | Retirer le bloc « à compléter : second visuel de "Sous le capot" » de l'accueil | `src/components/sections/SousLeCapot.astro` | Plus aucun `ACompleter` rendu sur `/` |
| V1-FIX-02 | « Ils nous ont fait confiance » → « Une première réalisation » ; onglet « Clients » → « Réalisation » | `Clients.astro`, `src/config/site.ts` | Plus de pluriel non justifié |
| V1-FIX-03 | « de 15 à 150 personnes » → formulation cible 0-50 | `src/pages/a-propos.astro` | Cohérent avec le cadrage |

*À ne faire que si la bascule V3 prend plus de deux semaines.*

**Lot 1 — Socle V3 : bascule technique de la V2** (sans nouveau texte)

| ID | Ticket | Critère d'acceptation |
|---|---|---|
| V3-T-01 | Restaurer le formulaire sur la V2, avec les champs du §3.4.4 | Règles dans `shared/contact.json` uniquement ; tests `contact.test.mjs` verts ; envoi testé via Mailpit (`compose.dev.yml`) |
| V3-T-02 | Image Open Graph accueil + page Réalisation (1200 × 630, < 150 ko, dérivée des tokens) | `og:image` présent sur toutes les pages ; aperçu vérifié avec un outil de prévisualisation de liens |
| V3-T-03 | `robots.txt` + `sitemap.xml` | 200 en local ; pages indexables listées ; `/404` exclue |
| V3-T-04 | JSON-LD `Organization`/`LocalBusiness` (`areaServed` Metz + 80 km), `Person`, `Service`, `FAQPage` | Valide au Rich Results Test ; aucun champ inventé, les champs `null` sont omis |
| V3-T-05 | Plan de bascule : `/v2/*` → `/*`, redirections des ancres et URLs V1, retrait du `noindex` | Documenté dans `RUNBOOK.md` ; **exécuté par l'humain** |
| V3-T-06 | Harmoniser `<title>` et H1 de `/contact` | — |

**Lot 2 — Positionnement et hero** (🔒 D1, D2)

| ID | Ticket | Critère d'acceptation |
|---|---|---|
| V3-M-01 | Hero selon D1 (titre, surtitre, sous-titre, CTA, microcopie) | Titre ≤ 14 mots, qui passe les 3 tests de Harry Dry ; zone présente ; microcopie centrée sur le lecteur |
| V3-M-02 | Passage en voix « je » (ou « nous ») sur tout le site | `grep` de « nous / on / je » : une seule voix, hors citations |
| V3-M-03 | Section Constat condensée (E1, E2) | ≤ 60 mots ; 3 scènes visualisables |
| V3-M-04 | Retirer « Éditeurs » du menu principal | Présent dans le pied de page, la section Interlocuteur et la page Réalisation |

**Lot 3 — Preuve** (🔒 D5, D8)

| ID | Ticket | Critère d'acceptation |
|---|---|---|
| V3-P-01 | Remplacer les réserves par des précisions (tableau §3.4.2) | ≤ 3 réserves sur tout le site : non-partenariat Extrabat, données fictives, « votre gain dépendra de vos devis » |
| V3-P-02 | Citation de Jason sur l'accueil et la page Réalisation | Accord écrit archivé hors dépôt ; citation mot pour mot ; prénom, rôle, entreprise |
| V3-P-03 | Démo : « Pessac » → commune fictive de Moselle ; « 3 rapports d'analyse annuels » clarifié | — |
| V3-P-04 | Photo et page À propos réécrite (§3.4.5) | Photo via `astro:assets`, dimensions déclarées ; aucun fait inventé |
| V3-P-05 | Marquer « Déjà en service » / « À étudier chez vous » sur les cartes Besoins | Suppression de la phrase de réserve correspondante |

**Lot 4 — Offre et prix** (🔒 D3, D4, D6)

| ID | Ticket | Critère d'acceptation |
|---|---|---|
| V3-C-01 | Méthode avec durées et « Votre temps » (E3, E4) sur l'accueil et Accompagnement | Durées validées par l'humain |
| V3-C-02 | Offre d'entrée nommée, tableau §3.4.3 sur Accompagnement | Montants fournis par l'humain, sinon `null` → « à compléter » en local uniquement, **jamais publié** |
| V3-C-03 | FAQ coût réécrite + scénario représentatif | Au moins un ordre de grandeur ou le format d'engagement |
| V3-C-04 | FAQ : « Et si l'IA invente un prix ? » (E5), « Faut-il changer de logiciel ? » (E10), + 2 nouvelles : « Et si vous arrêtez votre activité ? », « Qui détient les accès ? » | Réponses ≤ 2 paragraphes, vraies |
| V3-C-05 | Téléphone et/ou rendez-vous, délai de réponse | Selon D6 |

**Lot 5 — Confiance technique et éditeurs** (🔒 D7, D9)

| ID | Ticket | Critère d'acceptation |
|---|---|---|
| V3-TE-01 | Fiche données et sécurité (§3.4.6) + liste « avance seule / s'arrête net » (E6) | Uniquement des faits vérifiés pour le cas livré |
| V3-TE-02 | Page Éditeurs réécrite (§3.4.8) | H1 explicite ; formes de collaboration listées ; ≤ 500 mots hors schéma replié |

**Lot 6 — Mesure et itération**

| ID | Ticket | Critère d'acceptation |
|---|---|---|
| V3-K-01 | Champ « Comment avez-vous connu sosese ? » (inclus dans V3-T-01) | — |
| V3-K-02 | Tableau de suivi manuel des contacts (hors site) : date, canal, tâche, logiciel, suite donnée | À tenir par l'humain |
| V3-K-03 | *(Optionnel)* mesure d'audience sans cookie, auto-hébergée, compatible avec la CSP `connect-src 'self'` | Aucune requête tierce ; bandeau non nécessaire ; mention dans Confidentialité |
| V3-K-04 | Bilan après 10 contacts : quel hero ou message a déclenché, quelles objections reviennent | Ajuster la FAQ |
| DOC-01 | Avertissement en tête de `guide_copywriting_prompts_llm.md` (§3.6) | — |

**Hors plan (à ta demande) :** mentions légales et constitution de l'entreprise. **À signaler :** tant que les 10 champs « à compléter » sont publics, toute action d'acquisition au-delà du réseau proche est freinée (Stanford [S6]).

## 3.8 Brief transférable à un LLM

> Copier le bloc ci-dessous tel quel en début de session. Il suppose l'accès au dépôt `/home/joris/dev/sosese`.

````markdown
# Mission : construire la V3 du site sosese.tech, lot par lot

## Contexte
sosese est une activité solo portée par Joris Chamvoux, autour de Metz (rayon ~80 km).
Elle conçoit des automatisations sur mesure (avec de l'IA quand elle est utile) branchées
sur les logiciels existants des petites entreprises. Un client livré : L'Atelier des Sols & Fils
(pose de sols) : devis, fiches clients et rendez-vous dictés sur le terrain et créés dans
Extrabat après validation. Chiffres autorisés : devis 40 min → 2 min ; fiche client
5 min → 30 s ; +50 devis, +30 rendez-vous, +40 fiches en six semaines.

- Cible prioritaire : indépendants, TPE, PME de 0 à 50 salariés, Metz + ~80 km.
- Cible secondaire : éditeurs de logiciels métier.
- Canal principal : réseau et bouche-à-oreille. Le site sert surtout à *confirmer une
  recommandation* : qui, preuve, prix approximatif, risque, prochaine étape.
- La V1 est en production (tag v0.8). La V2 est une préversion sous /v2 (branche
  `codex/site-v2`). Décision : **la V2 est le socle de la V3**, enrichie d'emprunts à la V1.

## Documents à lire avant toute modification (dans cet ordre)
1. `CLAUDE.md` (règles non négociables)
2. `DESIGN.md` (tokens, composants, décisions, pièges ; section « V2 locale »)
3. `RAPPORT-COPYWRITING-V1-V2-2026-09-23.md` : §3.3 (emprunts E1-E12), §3.4 (pistes),
   §3.7 (lots et tickets)
4. `RAPPORT-AUDIT-STRATEGIQUE-2026-09-21.md` §9 (règles d'écriture)
5. `guide_copywriting_prompts_llm.md` : cadres utiles, mais **ne jamais citer ses statistiques**

## Règles dures
- Ne jamais inventer : prix, durée, délai, chiffre, citation, fait biographique, partenariat.
  Valeur manquante = `null` dans `src/config/site.ts` → « à compléter » (jamais publié).
- Ne jamais utiliser de données réelles issues d'un outil connecté (CRM Extrabat, etc.)
  dans le contenu public. Les démos restent fictives et signalées comme telles.
- Aucune couleur, rayon, espacement en dur : tokens de `src/styles/tokens.css`.
- Aucune image générée par IA ; seule image bitmap autorisée : portrait réel + images OG.
- Pas de push, de PR, de tag ni de déploiement sans accord explicite dans la session.
  Pas de `ssh`/`scp`/`rsync`. Ne jamais lire ni modifier `.env`.
- Une évolution (un lot) à la fois ; commit avant chaque changement structurel ;
  attendre la validation humaine avant le lot suivant.
- Tout composant, décision ou piège nouveau est ajouté à `DESIGN.md` dans le même tour.

## Règles d'écriture
- Voix : « je » (décision D2, à confirmer), vouvoiement du lecteur.
- Chaque titre passe 3 tests : visualisable ? falsifiable ? seul sosese peut-il le dire ?
- Une réserve n'est écrite que si elle évite une vraie erreur de lecture. Sinon, remplacer
  par la précision qui la rend inutile (source, date, nombre). Maximum 3 réserves sur le site.
- Préférer une scène (« La même information, tapée trois fois ») à une étiquette
  (« Un périmètre vérifiable »).
- Mots bannis en titre : solution innovante, révolution, plateforme, transformer votre
  quotidien, expert(s), sur-mesure seul, IA seul en étiquette de catégorie.
- Chaque promesse n'est développée qu'une fois sur l'accueil (validation humaine,
  propriété, sans changer d'outils, étapes chiffrées).
- Jargon technique uniquement sur la page Éditeurs et la fiche Données.

## Ordre d'exécution
Lot 1 (socle technique) → Lot 2 (hero, voix) → Lot 3 (preuve) → Lot 4 (offre, prix)
→ Lot 5 (confiance technique, éditeurs) → Lot 6 (mesure).
Les tickets et critères d'acceptation sont au §3.7 du rapport. Un ticket marqué 🔒 attend
une décision humaine (D1 à D9) : poser la question, ne pas supposer.

## Définition de « fini » pour chaque lot
- `npm run build` passe ; tests `npm test` verts
- vérifié en thème clair ET sombre, à 360 / 640 / 1024 / 1280 px, sans débordement
- un seul h1, hiérarchie de titres sans saut, focus visible au clavier
- animations sous `prefers-reduced-motion`
- aucune valeur en dur hors `tokens.css`
- critères d'acceptation du ticket tous vrais
- `DESIGN.md` mis à jour ; résumé des changements + ce qui reste 🔒
````

## 3.9 Comment valider sans chiffres d'audience

Le trafic est faible et vient du réseau : un test A/B n'a pas de sens. Méthodes proportionnées :

1. **Test des 5 secondes** avec 5 dirigeants de ton réseau (en personne, sur ton téléphone). Montrer le hero, retirer, puis demander : « C'est quoi ? Pour qui ? Vous feriez quoi ensuite ? ». Comparer V2 et options A/B du §3.4.1. Avec cinq personnes, les incompréhensions majeures ressortent généralement ; ce n'est pas une mesure statistique.
2. **Test de recommandation** : envoyer le lien de la page Réalisation à 3 contacts, comme si c'était une recommandation. Leur demander ce qu'ils retiennent et ce qui leur manque pour appeler.
3. **Journal des contacts** (V3-K-02) : canal, tâche citée, logiciel, suite donnée. Après 10 contacts, regarder quelles objections reviennent et quels mots les prospects emploient. Réinjecter ces mots dans le site (la voix du client).
4. **Question systématique au premier rendez-vous** : « Qu'est-ce qui vous a décidé à m'écrire ? » et « Qu'est-ce qui a failli vous en empêcher ? ».

---

## Annexe A — Sources externes

| # | Source | Utilisée pour |
|---|---|---|
| S1 | Nielsen Norman Group, *How Long Do Users Stay on Web Pages?* — https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/ | Test des 10 secondes, proposition de valeur |
| S2 | Nielsen Norman Group, *Pricing information gives B2B sites a competitive advantage* — https://www.nngroup.com/articles/show-price/ | Signal de prix |
| S3 | Nielsen Norman Group, *Show Prices for Common Scenarios* — https://www.nngroup.com/articles/show-prices-for-common-scenarios/ | Scénario représentatif chiffré |
| S4 | Nielsen Norman Group, *Trust or Bust: Communicating Trustworthiness in Web Design* — https://www.nngroup.com/articles/communicating-trustworthiness/ | Crédibilité, divulgation franche |
| S5 | Nielsen Norman Group, *About Us* (rapport et articles) — https://www.nngroup.com/articles/about-us-summaries/ ; https://www.nngroup.com/reports/about-us-presenting-company-information/ | Incarnation, photos réelles |
| S6 | Stanford Persuasive Technology Lab (B.J. Fogg), *Stanford Guidelines for Web Credibility* — https://credibility.stanford.edu/guidelines/index.html | « Montrer qu'il y a une vraie organisation » |
| S7 | Hinge Research Institute, *Referral Marketing for Professional Services Firms* — https://hingemarketing.com/library/article/referral-marketing-for-professional-services-firms | Rôle du site dans une recommandation |
| S8 | April Dunford, *A Quickstart Guide to Positioning* / *Obviously Awesome* — https://www.aprildunford.com/post/a-quickstart-guide-to-positioning | Méthode de positionnement en 5 composantes |
| S9 | Eugene Schwartz, *Breakthrough Advertising*, niveaux de conscience — https://breakthroughadvertisingbook.com/the-five-states-of-awareness-the-key-to-marketing-that-actually-works/ | Niveau de conscience de la cible |
| S10 | Harry Dry, *Marketing Examples*, trois règles du copywriting — https://marketingexamples.com/ ; synthèse : https://www.storyrules.com/lessons-from-copywriting-with-harry-dry/ | Tests visualiser / falsifier / unique |
| S11 | David C. Baker, *The Business of Expertise* — https://www.expertise.is/ | Spécialisation des petites structures |
| S12 | Brennan Dunn, *Roadmapping* (Double Your Freelancing) — https://doubleyourfreelancing.com/3-reasons-roadmapping/ | Prestation d'entrée payante |
| S13 | Baymard Institute, *Checkout Optimization: Minimize Form Fields* — https://baymard.com/blog/checkout-flow-average-form-fields | Nombre de champs du formulaire |
| S14 | France Num / DGE, *Baromètre France Num 2025* — https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/comprendre-le-numerique/barometre-france-num-2025-le | Adoption de l'IA dans les TPE-PME (26 % en 2025, 13 % en 2024) |
| S15 | Google, *Tips to improve your local ranking on Google* — https://support.google.com/business/answer/7091 | SEO local, Google Business Profile |

**Sites observés (benchmark, 23/09/2026) :** [Arborys IA](https://www.arborys-ia.com/fr/agence-ia-pme), [Hutch Agency](https://hutchagency.fr/automatisation-pour/pme-tpe/), [Tensoria](https://tensoria.fr/ia-btp), [Anacod](https://anacod.fr/), [Obat](https://www.obat.fr/), [Extrabat](https://www.extrabat.com/).

**Limites :**
- Les chiffres Hinge et Baymard proviennent de synthèses publiées par ces organismes ; leurs échantillons (services professionnels nord-américains, e-commerce) ne sont pas ceux des TPE mosellanes. Ils indiquent une tendance, pas un taux applicable.
- Le contenu des sites concurrents a été relevé par lecture automatisée ; il peut évoluer.

## Annexe B — Mesures brutes (23/09/2026)

| Mesure | V1 `/` | V2 `/v2` |
|---|---|---|
| HTTP | 200 | 200 |
| HTML brut / gzip | 118 465 o / 20 618 o | 35 678 o / 8 918 o |
| Mots visibles (hors `sr-only`, FAQ repliée comptée) | ≈ 1 770 | ≈ 640 |
| Sections `<section>` principales | 11 | 7 |
| H1 | 1 | 1 |
| H2 / H3 | 9 / 14 | 6 / 7 |
| `og:*` | 0 | 6 (sans `og:image`) |
| JSON-LD | `FAQPage` (9 Q/R) | aucun |
| `robots` | — | `noindex` (meta + `x-robots-tag: noindex, nofollow`) |
| `/robots.txt`, `/sitemap.xml` | 404, 404 | — |
| Mentions légales : champs « à compléter » | 10 | 10 |
| Formulaire de contact | Actif (5 champs obligatoires) | Désactivé (`mailto:`) |
| Humain nommé | Non | Oui (sans photo) |

**Méthode :**
- Pages récupérées par `curl`, texte extrait par un script Python (ne compte pas les éléments `sr-only`, `aria-hidden`, `script`, `style`).
- Captures Chrome headless à 1440 × 900, 390 × 844 et en pleine page.
- Aucun Lighthouse, axe ni test de lecteur d'écran relancé : les valeurs de performance citées viennent de `REVUE-V2.md` et `DESIGN.md`.
