# Audit critique de sosese : positionnement, discours, conversion et crédibilité

**Date : 21 septembre 2026.**  
**Périmètre :** dossier local `/home/joris/dev/sosese` et site public [sosese.tech](https://sosese.tech/).  
**Livrable :** analyse et plan de chantier. Aucune modification du site, aucun déploiement et aucun envoi de formulaire réalisés dans cet audit.

**Cadrage confirmé par le porteur du projet :** site vitrine avec génération de leads ; cible prioritaire d’entreprises de 0 à 50 salariés dans un rayon d’environ **80 km autour de Metz**, avec ouverture à d’autres opportunités ; objectif secondaire de dialogue avec des éditeurs logiciels pour proposer des intégrations fondées sur l’expérience terrain ; un premier client livré et premières discussions commerciales en cours. L’entreprise n’est pas encore constituée. **La structure juridique et le chantier légal sont volontairement exclus du plan d’action**, à la demande du porteur.

> **Diagnostic central : sosese explique assez bien le bénéfice de l’automatisation, mais ne donne pas encore assez de raisons précises de choisir ce prestataire, de lui confier ses données et d’acheter sa première intervention.** Le prochain progrès décisif viendra de la précision commerciale et de la preuve, davantage que d’une nouvelle couche de design ou d’animation.

## Sommaire

1. [Synthèse et décisions prioritaires](#1-synthèse-et-décisions-prioritaires)
2. [Méthode, périmètre et limites](#2-méthode-périmètre-et-limites)
3. [Stratégie et positionnement](#3-stratégie-et-positionnement)
4. [Marketing et copywriting](#4-marketing-et-copywriting)
5. [Commercial et conversion](#5-commercial-et-conversion)
6. [Lisibilité, expérience et architecture](#6-lisibilité-expérience-et-architecture)
7. [Technique du site](#7-technique-du-site)
8. [Technologie et crédibilité des solutions IA](#8-technologie-et-crédibilité-des-solutions-ia)
9. [Proposition de nouveau discours](#9-proposition-de-nouveau-discours)
10. [Sites et ressources d’inspiration](#10-sites-et-ressources-dinspiration)
11. [Validation et mesure](#11-validation-et-mesure)
12. [Plan d’action et tickets](#12-plan-daction-et-tickets)
13. [Brief transférable à un LLM](#13-brief-transférable-à-un-llm)
14. [Informations à obtenir du dirigeant](#14-informations-à-obtenir-du-dirigeant)
15. [Références externes](#15-références-externes)

## 1. Synthèse et décisions prioritaires

### 1.1 Ce qui fonctionne déjà

Le site ne ressemble pas à une brochure remplie de promesses sur « la révolution IA ». Il parle de ressaisie, devis, tarifs, relances, dossiers et planning. Le titre principal donne un bénéfice immédiatement compréhensible et traite une objection réelle : devoir remplacer les logiciels existants. Le cas de L’Atelier des Sols & Fils apporte un début de preuve particulièrement utile, parce qu’il associe un nom, un métier, un logiciel et des temps avant/après.

La sobriété visuelle, la cohérence de la palette, la navigation courte et la structure statique du site constituent une bonne base. Le contrôle humain et la possibilité de reprendre les développements sont aussi de bons sujets de réassurance. Le formulaire possède déjà des états d’erreur et de succès, une validation côté serveur et une adresse de contact alternative.

**Il serait contre-productif de repartir de zéro.** Il faut préserver ces fondations et rendre le site plus précis, plus incarné et plus vérifiable.

### 1.2 Ce qui empêche le site d’être réellement convaincant

| Priorité | Constat | Pourquoi c’est important | Direction recommandée |
|---|---|---|---|
| P0 | « La tâche finie, il ne reste rien » et « vos données ne quittent pas l’Europe » sont présentés comme des garanties générales | Le dépôt du site ne prouve ni les configurations des fournisseurs IA, ni les durées de journaux, ni les transferts ; la pile évoque aussi du RAG et une base vectorielle | Établir un registre des promesses et remplacer les absolus non documentés par des engagements délimités |
| P0 | Une zone « à compléter : second visuel de “Sous le capot” » est visible en production | Elle signale une livraison inachevée sur le site d’un prestataire qui vend précisément sa capacité à livrer | Retirer le bloc facultatif ou le remplacer par une information utile et vérifiée |
| P1 | La cible publiée « 15 à 150 personnes » contredit la cible confirmée de 0 à 50 salariés dans la région | Les indépendants et petites équipes peuvent s’exclure ; la proximité n’est pas exprimée | Aligner le site sur les petites entreprises locales, avec qualification par processus et volume |
| P1 | Aucun parcours n’adresse explicitement les éditeurs logiciels | Un éditeur doit déduire seul ce que l’expérience terrain peut apporter à son produit | Créer une entrée secondaire « Vous éditez un logiciel ? » et une page d’intégration B2B |
| P1 | L’offre décrit les capacités d’une « solution », pas clairement une prestation achetable | On ne sait pas assez ce que comprend la première mission, combien elle peut coûter, ni comment se décide la suite | Décrire diagnostic, pilote et suivi comme un parcours commercial avec sorties, exclusions et conditions |
| P1 | Le cas client arrive après problèmes, méthode et offre | Le visiteur doit accepter beaucoup de discours avant d’obtenir une preuve | Mettre un résumé du cas immédiatement après la promesse et créer un détail consultable |
| P1 | La page « À propos » présente une posture sans personne identifiable | Le sur-mesure se vend avec une relation de confiance ; l’anonymat perçu augmente le risque | Présenter le responsable de mission, son expérience vérifiable et l’organisation réelle |
| P1 | Le formulaire impose le secteur mais rend le problème facultatif | Il exige une classification tout en pouvant recevoir une demande sans contexte exploitable | Réduire les champs et demander d’abord le besoin avec une issue « je ne sais pas encore » |
| P2 | Les animations, démonstrations et explications s’accumulent | Le coût de lecture augmente, surtout sur mobile, sans gain de preuve équivalent | Garder une démonstration principale et proposer les détails à la demande |
| P2 | Aucune mesure d’audience n’est annoncée ; aucune donnée commerciale n’a été fournie | Impossible de distinguer un problème de trafic, de message, de formulaire ou de vente | Commencer par un suivi commercial manuel ; décider ensuite d’une mesure web proportionnée |

P0 signifie ici « à traiter avant d’augmenter l’acquisition ou de présenter le site comme terminé ». Les marqueurs légaux observés sont consignés comme contexte, mais leur correction est reportée à la session juridique demandée et ne bloque pas le chantier éditorial décrit ici.

### 1.3 Lecture selon les cinq spécialités

| Spécialité | Point fort principal | Faiblesse principale | Verdict |
|---|---|---|---|
| Stratégie | Bonne entrée par un problème opérationnel et l’existant logiciel | Segment et avantage concurrentiel insuffisamment choisis | Une direction pertinente, encore trop extensible |
| Marketing | Vocabulaire concret, bénéfice lisible | Différenciation et preuves tardives ; beaucoup de formulations interchangeables | Un discours accessible qui doit devenir plus spécifique |
| Commercial | Parcours en étapes, contrôle du client | Budget, périmètre, maintenance et prochain engagement flous | Le site rassure davantage sur l’intention que sur l’achat |
| Technique | Architecture légère, protections HTTP et serveur présentes | Garde-fous éditoriaux, résilience du contact et validation de publication incomplets | Bonne base à conserver, contrôles de livraison à renforcer |
| Technologique | Intégration, validation humaine, réversibilité mises en avant | Garanties trop larges et démonstration insuffisante des mécanismes | Promesse intéressante, niveau de preuve à relever |

Je n’attribue pas de note globale : sans entretiens, statistiques ni tests de compréhension, une note sur 100 donnerait une précision artificielle.

### 1.4 Les cinq décisions qui débloquent le chantier

1. **Qui veut-on convaincre en premier ?** Décision confirmée : dirigeants d’entreprises locales de 0 à 50 salariés. Reste à préciser les processus et métiers prioritaires ; les éditeurs constituent une audience secondaire distincte.
2. **Quel premier problème vend-on ?** Le cycle devis → client → intervention est le meilleur candidat documenté, mais cela reste une hypothèse stratégique à valider.
3. **Qu’achète le prospect au premier engagement ?** Un diagnostic autonome, un pilote limité, ou un accompagnement complet ?
4. **Quelles promesses peut-on prouver aujourd’hui ?** Personnes, délais, données, hébergement, propriété et résultats.
5. **Quel rôle joue le site ?** Décision confirmée : vitrine de crédibilité qui peut générer des leads. Donner priorité aux contacts locaux, recommandations et conversations commerciales ; le SEO est un complément progressif.

## 2. Méthode, périmètre et limites

### 2.1 Ce qui a été examiné

- Sources de l’accueil, pages À propos, Contact, Mentions légales et Confidentialité ; neuf entrées de FAQ.
- Configuration de marque et d’identité, composants de démonstration, tokens et styles principaux.
- Formulaire React, règles partagées et endpoint Fastify ; configuration Astro, Dockerfile et workflow de construction/publication d’image.
- Documentation de contexte, dont `CLAUDE.md`, début de `DESIGN.md` et guide de copywriting existant. Les anciens audits n’ont pas été traités comme des preuves du comportement actuel.
- Site public : contenu des cinq pages principales, rendu de l’accueil en thème sombre, vues ordinateur et mobile, positions des titres dans le DOM rendu, formulaire observé sans soumission.
- En-têtes HTTP publics et poids de transfert du HTML de l’accueil.
- Références externes primaires : auteurs en positionnement/copywriting, recherche UX, W3C, Google, CNIL, Service Public et OWASP. Sites d’inspiration consultés directement.

### 2.2 Statut des constats

Les formulations suivantes sont utilisées avec des niveaux de preuve différents :

- **Observé public** : contenu ou comportement effectivement visible sur le site lors de l’audit.
- **Observé source** : code ou configuration locale examinés ; ne prouve pas à lui seul le comportement de la version en production.
- **Interprétation** : effet plausible sur la compréhension, la confiance ou la conversion. À valider auprès de visiteurs.
- **Hypothèse** : choix proposé en l’absence d’informations commerciales.
- **À vérifier** : point nécessitant une information ou un test non disponible.

Les recommandations ne sont pas des résultats de tests A/B. Aucun pourcentage d’augmentation des conversions n’est annoncé.

### 2.3 Différences entre local et production

Au début de l’audit, Git indiquait déjà des modifications dans `Hero.astro`, `Engagements.astro` et `VracEnActions.astro`. Elles n’ont pas été réalisées dans cet audit.

| Élément | Site public observé | Source locale examinée | Conséquence |
|---|---|---|---|
| Introduction | « On construit l’outil… », avec « sans rien rapporter » | « On conçoit la solution… », sans cette dernière expression dans le hero | Ne pas attribuer à tort une ancienne formulation à la prochaine version |
| Engagement de démarrage | « on est chez vous sous 15 jours » | « atelier sous 15 jours » | La version locale réduit déjà une ambiguïté géographique |
| Bandeau | Quatre engagements visibles | Cinq éléments, dont « avis honnête sur votre situation » | Les critiques du bandeau portent sur les deux variantes, avec leurs différences |

Le rapport porte sur un état observé, pas sur un gel garanti du dépôt : d’autres travaux peuvent se poursuivre en parallèle. Le futur chantier doit commencer par relire les fichiers et les différences existantes.

### 2.4 Ce qui n’a pas été vérifié

- Aucun accès au VPS, à la messagerie, à un CRM, à Search Console ou aux systèmes du client cité.
- Aucun envoi d’email ou de formulaire public ; la délivrabilité effective reste inconnue.
- Aucun audit de sécurité exhaustif, scan de dépendances ou test d’intrusion.
- Aucun build lancé : il aurait modifié des artefacts locaux alors que la demande est de produire uniquement un rapport.
- Aucun résultat Lighthouse, axe ou Core Web Vitals terrain produit ; pas de score de performance inventé.
- Pas de campagne complète de tests clavier/lecteur d’écran, zoom, navigateur ou appareil physique. La vue mobile est une simulation de largeur, pas un téléphone réel.
- Le rendu clair n’a pas fait l’objet de la même inspection visuelle que le sombre ; les deux palettes ont été lues dans le code.
- Aucune vérification indépendante des chiffres du cas client. Le site les présente comme mesurés ; les commentaires du dépôt précisent qu’ils ont été fournis par le client.

Trois questions de cadrage ont été posées avant l’analyse, puis les réponses reçues ont été intégrées : cible locale de 0 à 50 salariés, vitrine et leads, éditeurs en second objectif, activité en lancement avec un premier client livré. Une réponse complémentaire précise un rayon d’environ 80 km autour de Metz. L’URL a été retrouvée dans `astro.config.mjs`, vérifiée publiquement puis confirmée par le porteur. La conservation de l’architecture actuelle est une recommandation de cet audit. Aucun territoire n’est déduit de la commune fictive utilisée dans la démonstration.

## 3. Stratégie et positionnement

### 3.1 Points forts

**S-F1 — L’existant logiciel est au centre de la proposition.** « Sans changer vos outils » traite une objection plus tangible que « adoptez l’IA ». Cela répond à la crainte de migration, de formation et de perturbation. À conserver comme bénéfice, avec une réserve claire sur la compatibilité technique.

**S-F2 — La mission commence par le problème.** À propos affirme qu’un tableur peut suffire. Cette posture peut distinguer un prestataire d’intégration d’un vendeur de technologie. Elle devient crédible si le diagnostic comporte effectivement une option « ne pas automatiser » et des exemples de refus motivés.

**S-F3 — Le cas Extrabat donne un terrain de spécialisation.** Un devis dicté sur chantier, des données prises dans le catalogue et une création dans un logiciel nommé constituent une expérience beaucoup plus distinctive que « nous faisons des agents IA ». C’est un actif de positionnement, pas seulement un témoignage à placer en bas de page.

**S-F4 — La réversibilité peut soutenir une vente de confiance.** Remettre code, accès et documentation réduit la crainte d’une dépendance durable. Mais la propriété des développements spécifiques, les licences tierces et les modalités de reprise doivent être distinguées.

### 3.2 Points faibles

**S-W1 — Le site vise un segment différent de celui choisi par son fondateur.** La page À propos annonce 15 à 150 personnes, alors que la priorité confirmée est 0 à 50 salariés dans la région. C’est une incohérence de fond : une entreprise sans salarié ou une équipe de cinq personnes peut se croire exclue. Employer « indépendants, TPE et petites PME » ou « petites entreprises » est plus naturel qu’afficher partout « 0 à 50 ». Cette plage reste elle-même large ; qualifier par volume, processus et équipement est plus utile qu’un effectif seul. Les secteurs du formulaire, jusqu’à la santé et aux RH, élargissent encore le message sans preuves correspondantes.

**S-W2 — Le cadre stratégique interne est lui-même divergent.** Le guide local de copywriting parle de TPE/PME de 1 à 50 salariés ; la page À propos publie 15 à 150. La réponse du porteur tranche en faveur de 0 à 50, avec proximité régionale. Un LLM doit recevoir cette priorité explicitement afin de ne pas réintroduire les anciens chiffres. L’ouverture à d’autres opportunités doit rester une capacité commerciale, pas transformer le hero en message destiné à tout le monde.

**S-W3 — La catégorie de l’offre reste ambiguë.** « Studio IA », « outil », « solution », « connecteur » et « automatisations » peuvent décrire le même travail, mais ne créent pas la même attente d’achat. Le prospect peut croire acheter un abonnement prêt à l’emploi, un développement sur mesure ou un audit de conseil. La catégorie recommandée est à tester : **prestataire d’intégration et d’automatisation des processus métier**, avec l’IA utilisée lorsque nécessaire.

**S-W4 — Les alternatives réellement envisagées ne sont pas traitées.** Le site se compare surtout au travail manuel. Or le prospect peut demander à son éditeur logiciel, utiliser une fonctionnalité native, solliciter son prestataire informatique ou bricoler un outil d’automatisation. L’approche d’April Dunford invite à partir des alternatives que le client considère réellement, puis à relier la différence à une valeur pour un segment précis. Ici, l’application consiste à expliquer dans quels cas le sur-mesure est justifié. [R1](https://www.aprildunford.com/), [R2](https://aprildunford.substack.com/p/a-buyer-centric-approach-to-competitive)

**S-W5 — Le site ne montre pas de limite de périmètre.** Sans critères de non-adéquation, le sur-mesure ressemble à une capacité illimitée. Le risque commercial est de générer des demandes éloignées des compétences ou de la rentabilité recherchée. Une rubrique « adapté si… » et « à vérifier avant de commencer… » rassure davantage qu’une promesse universelle.

### 3.3 Trois positionnements possibles

| Option | Proposition | Atouts | Limites | Comment décider |
|---|---|---|---|---|
| A — Généraliste PME | Automatiser les tâches répétitives dans les outils existants | Préserve un marché large ; compatible avec la promesse actuelle | Forte banalité ; portefeuille de preuves aujourd’hui étroit | À retenir si les demandes et références sont déjà diversifiées |
| B — Processus commercial et administratif des équipes de terrain | Transformer demandes, notes et visites en devis, fiches et interventions | Très cohérent avec la preuve disponible ; bénéfice concret | Peut sous-représenter d’autres capacités ; demande validation du marché | **Hypothèse de travail recommandée pour une première page ciblée** |
| C — Intégrations autour d’Extrabat | Automatisations connectées à Extrabat pour entreprises équipées | Reconnaissance immédiate d’un problème/outillage ; réutilisation possible | Dépendance à un éditeur, marché plus limité, conditions d’API à vérifier | Tester la demande et les droits d’intégration ; ne pas inventer de partenariat |

Ne pas changer toute la marque sur la seule base d’un cas. La recommandation est une **entrée principale pour les petites entreprises locales**, illustrée par le processus le mieux prouvé, puis une page de cas détaillée et une entrée secondaire pour les éditeurs. Si les entretiens démontrent une demande forte dans un métier, spécialiser progressivement les campagnes et pages d’usage sans fermer toutes les autres opportunités.

### 3.4 Cible provisoire et situation d’achat

**Cible confirmée :** dirigeants d’entreprises de 0 à 50 salariés de la région du porteur. **Sous-segment de départ proposé :** entreprises de terrain déjà équipées d’un logiciel de gestion, dont une part significative du travail consiste à transformer des informations dispersées en devis, fiches clients et interventions. Le métier « terrain » est une hypothèse fondée sur le premier cas, pas une restriction décidée par le porteur.

**Déclencheurs à rechercher :** backlog de devis, doubles saisies, retour tardif au bureau, croissance sans capacité administrative suffisante, relances oubliées, difficulté à transmettre l’information entre terrain et bureau.

**Conditions d’adéquation :** processus récurrent, référent disponible, données suffisamment structurées, droits d’accès légitimes, connexion techniquement possible, valeur attendue supérieure au coût total.

**Motifs de non-adéquation à assumer :** volume trop faible, règles métier non définies, logiciel déjà capable de résoudre le problème simplement, absence de responsable du processus, exigence d’autonomie totale sur des décisions qui nécessitent une vérification.

**Formulation interne de positionnement proposée, à valider :**

> Pour les entreprises dont les équipes ressaisissent au bureau ce qu’elles ont déjà collecté sur le terrain, sosese conçoit des automatisations reliées au logiciel de gestion existant. La première mission identifie un processus utile à automatiser, ses conditions de faisabilité et son coût ; la construction porte ensuite sur un périmètre choisi et vérifié avec les utilisateurs.

Cette formulation ne prétend pas à une exclusivité non démontrée. La différenciation devra être alimentée par l’expérience sectorielle, les connecteurs réellement maîtrisés, la qualité de livraison et les preuves d’usage.

### 3.5 Conséquences sur l’acquisition

1. Utiliser d’abord le site comme support de conversations ciblées et de recommandations : cas réel, interlocuteur identifié, première mission explicite.
2. Créer une seule page d’usage détaillée avant une série de pages sectorielles.
3. Collecter les alternatives et objections rencontrées en rendez-vous pour améliorer les pages.
4. Envisager des relais auprès d’intégrateurs ou réseaux métier uniquement après clarification des rôles ; aucun partenariat ne doit être suggéré sans accord réel.
5. Éviter un blog massif produit par LLM avant d’avoir des preuves, une cible et une offre claires. Le volume de contenu ne résoudra pas l’ambiguïté commerciale.

### 3.6 Audience secondaire : les éditeurs logiciels

**Le discours PME ne suffit pas pour un éditeur.** L’entreprise utilisatrice achète un résultat dans son quotidien. L’éditeur examine l’intérêt pour ses clients, la compatibilité avec son produit, le risque de maintenance et la nature d’une collaboration. Il faut deux parcours sous une même marque, avec un accueil prioritairement destiné aux clients finaux.

| Sujet | Petite entreprise locale | Éditeur logiciel |
|---|---|---|
| Problème | Ressaisies, devis retardés, tâches dispersées | Cas d’usage terrain difficiles à traduire en intégrations fiables |
| Preuve | Usage réel chez une entreprise comparable | Processus observé, intégration réalisée, limites et enseignements |
| Offre d’entrée proposée | Cadrer une tâche prioritaire | Explorer un cas d’intégration et sa faisabilité avec l’équipe produit/technique |
| Réassurance | Interlocuteur proche, adoption, coût, continuité | API, permissions, compatibilité, versions, responsabilité du support |
| CTA | Décrire mon besoin | Discuter d’une intégration |

**Page secondaire proposée : `/editeurs`**, accessible par un lien discret dans la navigation ou près du pied de page. Elle doit montrer : un problème observé sur le terrain ; le cas Extrabat attribué correctement ; le rôle exact de sosese ; les interfaces nécessaires ; une démarche de prototype cadré ; les responsabilités à discuter ; un contact dédié au contexte éditeur.

Ne pas suggérer un partenariat avec Extrabat ni une intégration officiellement approuvée si ce n’est pas le cas. Ne pas promettre un connecteur réutilisable, un produit en marque blanche ou un modèle économique de licence avant de vérifier les droits, la propriété des développements et les conditions d’API. L’objectif initial est une conversation qualifiée, pas un programme partenaires fictif.

**Angle proposé :** « Des usages observés chez vos clients, transformés en projets d’intégration concrets. » Il doit être accompagné du seul cas actuellement documenté, sans transformer une expérience en expertise multi-éditeurs déjà établie.

### 3.7 Proximité régionale et lancement de l’activité

La proximité peut être un vrai avantage pour observer le travail et faciliter la confiance, mais elle est presque absente du site : la zone est `null` dans la configuration. La zone confirmée est **Metz et un rayon d’environ 80 km**. La présenter simplement, sans en faire une limite absolue : « J’interviens en priorité autour de Metz, dans un rayon d’environ 80 km. Pour un projet plus éloigné, échangeons sur les modalités. » Adapter « je » à l’organisation réelle. Ne pas inventer de bureau, d’adresse commerciale ou de disponibilité permanente. Ne pas déduire de ce rayon une offre automatiquement transfrontalière.

Un premier client livré n’est pas une faiblesse à dissimuler. Une étude de cas approfondie et une personne identifiable peuvent être plus crédibles qu’un discours d’agence installée. Préférer « Une première réalisation en service » ou un titre centré sur le cas à un pluriel de références non étayé. Employer « je » si l’activité est réellement portée seul, ou expliquer ce que recouvre « nous » ; ne pas simuler une équipe.

Sur les petites structures, vérifier la viabilité d’un atelier lourd : une entreprise sans salarié peut ne pas avoir besoin de deux jours d’analyse. Proposer un premier échange de qualification, puis dimensionner le diagnostic. Un diagnostic standardisé plus court est une piste de modèle commercial à étudier, pas une offre existante à annoncer automatiquement.

## 4. Marketing et copywriting

### 4.1 Points forts

**M-F1 — Le titre principal est lisible et orienté bénéfice.** Il dit ce qui change dans le quotidien et ce qui reste familier. Il demande peu de connaissances techniques.

**M-F2 — Les situations de problème sont reconnaissables.** « La même information, tapée trois fois » se visualise immédiatement. C’est plus efficace pour la compréhension qu’un terme abstrait comme « optimisation des flux ».

**M-F3 — Le ton est cohérent.** « On vous le dit », « vous gardez la main », « vous décidez » donnent une posture de collaboration. Il n’est pas nécessaire de remplacer ce registre par une écriture corporate.

**M-F4 — Les bénéfices sont accompagnés de mécanismes.** Catalogue, tarifs, fiches, rendez-vous et accord humain expliquent une partie de la chaîne de valeur. Le cas concret montre comment le gain peut se produire.

**M-F5 — Les objections principales existent dans la FAQ.** Coût, délai, outils, données, erreur et maintenance sont abordés. La faiblesse tient surtout au degré de réponse, pas à l’absence des sujets.

### 4.2 Points faibles et mécanismes

**M-W1 — La promesse est claire mais interchangeable.** Beaucoup de prestataires peuvent dire qu’ils automatisent les tâches sans remplacer les outils. Ajouter seulement « sur mesure » n’établit pas de préférence. Il faut associer un problème précis, un type de client et une preuve située.

**M-W2 — Les titres décrivent parfois une intention plutôt qu’une information.** « Une solution construite pour vous, qui travaille comme vous » ne précise ni l’objet livré ni son usage. « Ils nous ont fait confiance » annonce une preuve mais ne donne pas le résultat. Une lecture des seuls titres devrait déjà expliquer l’offre. Les recherches de NN/g sur la lecture par balayage et les intertitres soutiennent cette direction ; elles ne permettent pas de prédire un gain commercial chiffré pour sosese. [R3](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/), [R4](https://www.nngroup.com/articles/layer-cake-pattern-scanning/)

**M-W3 — Le pronom « elle » devient un personnage plus qu’un système compréhensible.** Cette personnification facilite certaines phrases, mais elle masque ce qui est fait par une règle, une API, un modèle ou un humain. Réintroduire périodiquement « l’automatisation », « le brouillon » ou « le connecteur » aide à comprendre les responsabilités.

**M-W4 — Plusieurs formulations minimisent trop l’effort d’adoption.** « Sans formation particulière », « vos habitudes », « à votre place » peuvent laisser attendre une absence totale de changement. Pourtant, valider un brouillon, dicter correctement une demande et traiter un échec supposent des pratiques nouvelles. Promettre la continuité des logiciels est plus défendable que promettre l’absence d’apprentissage.

**M-W5 — Certaines phrases dévalorisent le travail administratif.** « Sans rien rapporter » et « ce qui prend du temps sans rien rapporter » peuvent heurter les personnes qui garantissent la qualité des devis, des factures ou des dossiers. La tâche administrative peut avoir une valeur réelle ; la ressaisie inutile est le problème. Parler de « recopies » et de « vérifications répétitives » est plus juste.

**M-W6 — Les preuves et les illustrations se mélangent.** Le cas réel contient une démonstration avec des personnes, montants et dates inventés. Le code indique que le scénario est fictif, mais la mention visible a été retirée ; « Aperçu du principe » ne l’explicite pas entièrement. Dans la rotation d’écrans, l’avertissement « Exemples inventés » est dans une légende `sr-only`, donc disponible pour les technologies d’assistance mais non visible à tous. Il faut une indication visible sobre. Il ne s’agit pas de retirer le scénario, mais d’éviter qu’il soit lu comme une pièce du dossier client.

**M-W7 — Le terminal produit une fausse précision.** Il juxtapose « PME industrie », 14 processus, 6 candidats, 2 quick wins et 38 minutes économisées. Le composant est un exemple scénarisé. Son apparence de sortie technique peut lui donner une valeur de preuve qu’il n’a pas. Le gain de 38 minutes fait en outre écho au cas chantier, dans un contexte « industrie ». Supprimer le terminal serait défendable ; le conserver exige un étiquetage explicite et une utilité pédagogique réelle.

**M-W8 — Les répétitions saturent les arguments.** Le maintien des outils, le contrôle humain et la non-conservation reviennent dans plusieurs sections. Une répétition aux points de décision est utile ; une répétition qui n’ajoute ni mécanisme ni preuve allonge le parcours. La règle recommandée : une promesse dans le hero, sa preuve près du cas, ses conditions dans la FAQ ou la page dédiée.

**M-W9 — Le guide local contient des chiffres de persuasion non sourcés.** L’affirmation sur 12 000 pages et un gain moyen de 22 % pour PAS n’est accompagnée d’aucune référence vérifiable dans le document examiné. Les gains « 45 à 90 minutes par jour » sont également proposés comme bénéfices. Ils ne doivent pas servir de preuve ou être injectés dans la nouvelle version. PAS, BAB ou FAB peuvent aider à organiser un brouillon, mais ne remplacent ni recherche client ni données propres.

### 4.3 Revue précise des formulations

Les alternatives ci-dessous sont des propositions de rédaction, pas des engagements déjà validés. Les formulations relatives au fonctionnement, aux délais et aux livrables doivent être confrontées à la pratique réelle.

| Texte actuel / sujet | Critique | Proposition ou direction |
|---|---|---|
| « IA sur-mesure pour PME » | Catégorie large, résultat absent | « Automatisation de vos processus commerciaux » si ce périmètre est choisi ; conserver l’IA dans l’explication |
| « Vos tâches répétitives, automatisées » | Compréhensible mais générique | Conserver comme base, puis ajouter immédiatement devis, fiches ou relances selon la cible |
| « Sans changer vos outils » | Bon bénéfice, lu comme universel | « Dans vos logiciels actuels » + précision proche : compatibilité vérifiée pendant le cadrage |
| « On conçoit la solution… — branché sur… » dans le local | Accord grammatical incorrect avec « solution » | « Nous concevons une automatisation reliée aux logiciels que vous utilisez déjà. » |
| « ce qui remplit les journées… sans rien rapporter » | Dévalorise des tâches utiles | « les ressaisies et les recherches qui retardent vos dossiers » |
| « à votre place » | Autonomie trop large face aux validations promises | « qui prépare ces tâches pour vous » ou description précise des actions automatisées |
| « on est chez vous sous 15 jours » | Géographie et disponibilité non définies | Indiquer zone et conditions, ou retirer la garantie tant qu’elle n’est pas pilotée |
| « avis honnête sur votre situation » | Qualité auto-déclarée | Montrer que le diagnostic peut recommander de ne pas automatiser |
| « chiffré uniquement sur vos besoins » | Peu informatif : tout devis devrait l’être | « Périmètre et prix confirmés avant chaque phase », si vrai |
| « Le temps que personne n’a décidé de perdre » | Bonne tonalité, faible information seule | Conserver éventuellement en phrase secondaire ; titre plus concret sur les ressaisies |
| « Ça repart avec elle le vendredi soir » | Peut sembler accusateur envers le salarié | « Quand cette personne n’est pas disponible, l’équipe manque d’informations pour avancer. » |
| « On mesure le temps gagné » avant construction | Confond estimation et résultat observé | « On estime le gain possible, puis on le mesure sur le pilote. » |
| « Une solution… qui travaille comme vous » | Formule interchangeable et anthropomorphique | « Des demandes transformées en devis, fiches et actions dans vos logiciels » |
| « dans tous vos outils à la fois » | Universalité non prouvée | « dans les outils et les données retenus pour votre projet » |
| « Elle garde vos règles, pas vos données » | Les règles peuvent elles-mêmes contenir des données sensibles | Expliquer séparément configuration, documents, journaux et conservation |
| « Ils nous ont fait confiance » | Générique ; un seul cas exposé | « Un cas concret : les devis de L’Atelier des Sols & Fils » |
| « 40 min → 2 min » | Forte preuve annoncée, périmètre de mesure incomplet | Garder les valeurs, préciser source, échantillon et étape mesurée après collecte |
| « 3 rapports d’analyse annuels » après six semaines | Ambigu : trois rapports par an ou sur trois années ? | Préciser la période analysée, sans inventer la réponse |
| « Elle n’en garde rien » | Promesse absolue difficile à défendre | Donner les durées et les catégories effectivement conservées |
| « Nos données sortent-elles de l’entreprise ? » | Réponse actuelle parle UE sans répondre d’abord oui/non | « Selon la configuration, certaines données sont transmises à… », avec fournisseurs et lieux validés |
| « Et si ça ne marche pas ? » | La réponse décrit des réunions, pas la gestion d’un échec | Décrire critères de recette, correction, arrêt et facturation des phases réalisées |
| « sans formation particulière » | Promesse excessive d’adoption immédiate | « Nous montrons à vos équipes comment utiliser et vérifier le processus », si inclus |
| « Parlons-en » | Ton agréable, prochaine étape peu explicite | « Décrire mon besoin » pour un formulaire ; « Réserver un échange » seulement avec réservation réelle |
| « Merci, votre demande est bien partie » | Acceptation SMTP ≠ réception finale | Message compatible avec le niveau réellement garanti et procédure de secours explicite |

### 4.4 Recherche client avant réécriture définitive

La méthode de Copyhackers insiste sur la collecte des mots des clients avant la rédaction. L’application utile ici est une petite recherche qualitative : relever les formulations de clients et prospects, les objections et les alternatives, puis choisir les messages qui répondent à ces données. [R5](https://copyhackers.com/2022/06/copywriting-research/)

Conduire cinq à huit entretiens courts, sans les présenter comme un sondage représentatif. Demander :

1. « Racontez la dernière fois où un devis ou un dossier a pris du retard. »
2. « Qui a dû ressaisir quoi, dans quel outil ? »
3. « Qu’avez-vous essayé avant de chercher un prestataire ? »
4. « Qu’est-ce qui vous ferait refuser ce projet ? »
5. « Quel résultat rendrait une première mission utile ? »
6. « Qu’auriez-vous besoin de savoir avant de prendre rendez-vous ? »

Conserver les citations comme matériau privé de recherche ; obtenir une autorisation distincte avant de les publier comme témoignages.

## 5. Commercial et conversion

### 5.1 Points forts

**C-F1 — Une action principale cohérente.** « Parlons-en » renvoie au contact depuis plusieurs endroits. Le site évite un catalogue de CTA incompatibles.

**C-F2 — La méthode explicite le temps demandé au client.** Une demi-journée, une heure de discussion et des points hebdomadaires sont des informations utiles pour se projeter. À conserver après validation des durées.

**C-F3 — La progression par décision réduit le risque perçu.** « Vous décidez à la fin de chacune » est un bon principe de vente de projet. Il faut en préciser les conséquences contractuelles et financières.

**C-F4 — Le contact possède une alternative email et une explication de la suite.** Le visiteur peut choisir un canal simple et n’est pas laissé face à un bouton sans contexte.

### 5.2 Points faibles

**C-W1 — Le premier engagement n’est pas assez défini.** Le prospect comprend qu’un atelier existe, mais pas s’il achète deux jours sur place, une étude, un document autonome ou un simple passage obligé avant développement. La FAQ précise qu’il est chiffré, donc il ne faut pas le présenter implicitement comme gratuit.

**C-W2 — Le budget reste une boîte noire.** « Cela dépend du périmètre » est vrai mais ne permet aucune autoqualification. NN/g a observé l’importance des informations tarifaires dans les décisions B2B ; cette recherche, ancienne, justifie de traiter le sujet, pas d’imposer un tarif public universel. Pour sosese, publier au minimum les facteurs de coût, ce qui est facturé séparément et les coûts récurrents possibles. Une fourchette n’est utile que si elle correspond à des prestations réellement vendables. [R6](https://www.nngroup.com/articles/b2b-usability/)

**C-W3 — Le site vend du gain de temps sans construire le raisonnement économique.** Le coût initial, la maintenance, les consommations et le temps de validation ne sont pas mis en face. Un temps libéré n’est pas automatiquement une économie de trésorerie ni une augmentation du chiffre d’affaires.

**C-W4 — La maintenance est présentée comme un choix de responsable, pas comme un service.** « On assure le suivi » laisse sans réponse : horaires, canal, délais d’intervention, changements d’API, mises à jour, sauvegardes, coût et limites. Le site n’a pas besoin d’un contrat complet, mais doit décrire le minimum de continuité proposé.

**C-W5 — L’objection d’échec n’est pas résolue.** Voir la solution avancer et pouvoir arrêter ne disent pas ce qu’il se passe si elle ne remplit pas les critères prévus. Définir la recette, les corrections incluses et les conditions de clôture serait beaucoup plus convaincant.

**C-W6 — Le contact qualifie mal la situation.** Quatre champs d’information sont obligatoires : nom, société, email, secteur, auxquels s’ajoute l’accord. Téléphone, irritants et message sont facultatifs. On peut donc recevoir une demande sans savoir quel problème traiter. À l’inverse, un visiteur doit choisir son secteur même si cette information n’est pas nécessaire au premier retour.

**C-W7 — Le délai de réponse n’est pas annoncé.** Un engagement réel, même modeste, serait utile. Ne pas ajouter « réponse sous 24 h » simplement parce que cela sonne bien. Confirmer la capacité opérationnelle et définir jours ouvrés, absences et suivi.

**C-W8 — Le prestataire est insuffisamment incarné.** Il manque le nom de la personne, son rôle, une expérience vérifiable et la manière dont elle travaille avec d’éventuels partenaires. Au stade d’un premier client livré, la personne est probablement un actif commercial plus fort qu’une posture abstraite de « studio ». Les recherches NN/g sur les pages de présentation soulignent l’utilité de comprendre l’organisation derrière le site. Ici, l’enjeu est renforcé par la nature personnalisée de la prestation. [R7](https://www.nngroup.com/articles/about-us-information-on-websites/)

### 5.3 Parcours commercial recommandé

| Phase proposée | Question du client | Ce qui doit être explicite | Sortie attendue |
|---|---|---|---|
| Prise de contact | Est-ce pertinent pour nous ? | Interlocuteur, mode d’échange, délai de retour réel, informations utiles | Décision de poursuivre ou non |
| Diagnostic | Que vaut-il la peine d’automatiser ? | Périmètre, prix ou mode de chiffrage, accès nécessaires, livrables, exclusions | Décision argumentée, y compris abandon |
| Pilote | Est-ce que cela fonctionne sur notre processus ? | Un processus, outils concernés, critères de réussite, durée conditionnelle, prix | Recette sur cas représentatifs |
| Mise en service et suivi | Qui intervient quand quelque chose change ? | Formation courte, documentation, surveillance, maintenance et coûts récurrents | Usage réel mesuré, responsabilités claires |

Cette structure n’impose pas quatre produits différents. Elle rend visible le parcours déjà suggéré par le site. Un diagnostic peut rester autonome ; le pilote ne doit pas engager automatiquement sur une suite.

### 5.4 Ce qu’une fiche d’offre devrait contenir

- Problème et profil adaptés.
- Entrées nécessaires : exemples de demandes, règles métier, liste de logiciels et référent.
- Travail inclus et livrables réellement remis.
- Ce qui n’est pas inclus : migration complète, refonte de gestion, disponibilité permanente, etc., selon l’offre réelle.
- Critères de réussite et méthode de mesure.
- Prix validé ou facteurs de chiffrage compréhensibles.
- Dépenses récurrentes : hébergement, API, licences, maintenance, si applicables.
- Décision possible à la fin de la mission.
- Propriété des développements et accès, sous réserve des licences tierces.

### 5.5 Exemple de raisonnement économique, uniquement pédagogique

**Les chiffres de ce paragraphe sont fictifs et ne doivent pas être publiés comme résultats sosese.**

Supposons 80 opérations mensuelles, 15 minutes nettes gagnées par opération et 75 % d’adoption effective. Cela représente `80 × 15 / 60 × 0,75 = 15 heures` mensuelles de capacité libérée. À 35 €/h de coût chargé de référence, la valorisation théorique est de 525 €/mois. Avec 150 €/mois de coûts récurrents, elle devient 375 €/mois. Un investissement initial de 3 000 € correspondrait alors à huit mois de retour théorique.

Ce calcul n’est valable que si le temps gagné inclut la vérification et les reprises, si les coûts sont complets et si la capacité libérée est utilement réaffectée. Il ne prouve pas une économie de salaire. Si le gain net est nul ou négatif, le projet doit être revu. Une hausse des ventes doit être mesurée séparément, pas ajoutée arbitrairement au calcul.

Ne pas extrapoler automatiquement les 40 → 2 minutes du cas client à tous les devis et à toutes les entreprises.

### 5.6 Formulaire recommandé

Version à tester :

- Email professionnel : nécessaire pour répondre, sans bloquer arbitrairement les adresses personnelles utilisées professionnellement.
- Nom ou prénom : utile pour l’échange.
- Entreprise : à conserver obligatoire seulement si son usage pour le traitement est justifié.
- « Quelle tâche souhaitez-vous simplifier ? » : réponse courte ou choix simple, avec « je souhaite d’abord en discuter ».
- Téléphone : facultatif.
- Secteur, budget et détails techniques : reportés au rendez-vous, sauf nécessité démontrée.

Le principe GOV.UK utile ici est de savoir pourquoi chaque information est demandée et ce qu’on en fera. Il ne justifie pas mécaniquement un formulaire d’une seule question ou une baisse mesurable des abandons. [R8](https://www.gov.uk/service-manual/design/form-structure)

**Hors périmètre de ce chantier :** conserver le mécanisme d’accord existant tant que la session juridique dédiée n’a pas tranché. Les changements de formulaire proposés ici concernent l’utilité et la lisibilité des champs ; ils ne doivent pas modifier silencieusement la base légale ou les textes juridiques. Référence conservée pour la future session : [CNIL](https://www.cnil.fr/fr/exemples-de-formulaire-de-collecte-de-donnees-caractere-personnel).

## 6. Lisibilité, expérience et architecture

### 6.1 Observations visuelles

**Points forts :** titres nettement différenciés, CTA ambre visible, palette cohérente, absence de carrousel publicitaire et de fenêtre intrusive, sections identifiables, texte principal dans une taille confortable sur les captures inspectées. Le rendu sombre possède une identité propre et ne nécessite pas une refonte esthétique générale.

**Limites :** les petits libellés en capitales et monospace multiplient les signaux techniques ; les écrans de démonstration demandent une lecture fine ; le premier écran mobile consacre beaucoup de place au titre et au paragraphe avant la preuve. Le bouton flottant recouvre une partie de l’illustration du hero sur la capture mobile observée. Ce recouvrement ne démontre pas à lui seul une non-conformité globale, mais c’est une gêne concrète à examiner sur les états animés.

### 6.2 La preuve arrive objectivement tard

Mesures approximatives prises sur le DOM public en thème sombre, avec les dimensions de viewport indiquées. Les coordonnées dépendent du rendu et ne sont pas des mesures de comportement des visiteurs.

| Repère | Ordinateur 1440 × 1000 | Mobile 390 × 844 |
|---|---:|---:|
| Titre « Le temps que personne… » | y ≈ 875 px | y ≈ 1 224 px |
| Titre de la méthode | y ≈ 1 556 px | y ≈ 2 625 px |
| Titre de l’offre | y ≈ 2 424 px | y ≈ 4 332 px |
| Titre de la section client | y ≈ 3 407 px | y ≈ 5 973 px |
| « Sous le capot » | y ≈ 4 932 px | y ≈ 9 414 px |
| Titre de la FAQ | y ≈ 7 109 px | y ≈ 13 328 px |
| CTA final | y ≈ 8 041 px | y ≈ 14 478 px |

La hauteur totale mobile relevée est d’environ **15 776 px**, soit près de 19 hauteurs de viewport. Le début de la section client se trouve à environ sept hauteurs de viewport depuis le haut. Cela ne signifie pas que personne ne le voit : la navigation comporte une ancre Clients. Cela signifie que le parcours linéaire retarde fortement la première preuve nommée.

Le problème n’est pas « une page longue est forcément mauvaise ». Une page longue peut convaincre si chaque section répond à une question utile. Ici, méthode, offre, quatre environnements de démonstration, cas détaillé, terminal et confiance produisent des redites et des changements d’audience.

### 6.3 Architecture de l’accueil recommandée

| Ordre | Bloc | Fonction | Contenu à conserver ou déplacer |
|---|---|---|---|
| 1 | Promesse + cible + action | Comprendre en quelques secondes | Hero plus court ; exemple concret ; CTA adapté à la destination |
| 2 | Preuve résumée | Donner une raison de croire | Nom du client, contexte, chiffres attribués, lien vers cas détaillé |
| 3 | Trois usages ou problèmes | Se reconnaître | Réutiliser les scènes les plus spécifiques, supprimer les doublons |
| 4 | Première mission / offre | Comprendre l’achat | Diagnostic, pilote, livrables, coûts et conditions |
| 5 | Déroulement court | Réduire l’incertitude | Trois étapes compactes ; détail ailleurs si utile |
| 6 | Responsable de mission + garanties | Réduire le risque fournisseur | Identité, expérience, maîtrise des accès, réversibilité documentée |
| 7 | FAQ commerciale courte | Lever les dernières objections | Prix, délai, compatibilité, données, suivi et échec |
| 8 | Contact | Donner une suite simple | Prochaine étape, interlocuteur et délai réel |

Le contenu informatique détaillé peut vivre dans une section repliable clairement nommée ou une page dédiée. Il ne doit pas interrompre le chemin principal du dirigeant.

### 6.4 Pages utiles, sans créer une usine éditoriale

- **Accueil** : orientation et conversion.
- **Cas client détaillé** : contexte, intervention, résultats, méthode de mesure, limites, démonstration explicitement illustrative.
- **Offre / première mission** : si le contenu dépasse ce que l’accueil peut présenter clairement.
- **À propos** : personne, expérience, manière de travailler, zone et organisation.
- **Contact** : parcours court et suite explicite.
- **Éditeurs** : page secondaire expliquant la proposition d’intégration et ouvrant une conversation distincte.
- **Données et intégration** : seulement si les objections et la complexité justifient une page dédiée ; distinguer cette page de la confidentialité du site vitrine.
- **Mentions et confidentialité** : conservées ; complétion traitée lors de la session juridique séparée.

Préserver les ancres déjà publiées, notamment `#cas-client`, ou assurer leur compatibilité. Ne pas générer dix pages pauvres pour dix secteurs.

### 6.5 Animations et accessibilité

Le code prévoit des commandes de pause et des transcriptions pour plusieurs démonstrations. C’est un vrai point fort. Le W3C demande un moyen de mettre en pause, arrêter ou masquer certaines animations automatiques de plus de cinq secondes présentées avec d’autres contenus. La présence d’un bouton est positive ; son fonctionnement et son accessibilité doivent être vérifiés, pas supposés. [R9](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide)

Points à traiter :

1. **Terminal et mouvement réduit.** Le composant ignore explicitement `prefers-reduced-motion`, par choix documenté. Recommander un état final statique pour ces utilisateurs ; ne pas qualifier automatiquement cette seule différence de violation de WCAG 2.2.2, car une pause existe.
2. **Méthode révélée progressivement.** Le script ajoute une classe cachée puis révèle les éléments avec des délais successifs. Le contenu utile ne devrait pas dépendre de plusieurs secondes d’attente. Tester défilement rapide, JavaScript partiel et observation de visibilité.
3. **Démonstrations non interactives.** Des boutons dessinés dans une maquette peuvent être pris pour des commandes utilisables. Étiqueter la démonstration et éviter une apparence de contrôle si aucune interaction n’est disponible.
4. **Texte alternatif très long.** La transcription du hero restitue même la mise en scène des post-it. Privilégier un résumé du sens et une description structurée du processus ; garder les détails visuels seulement s’ils sont utiles.
5. **Taille et contraste des détails.** Vérifier réellement textes de 12/14 px, bordures de champs, focus, états actifs et boutons de pause dans les deux thèmes. Les tokens seuls ne constituent pas un audit de contraste complet.
6. **CTA flottant.** Tester la zone qu’il recouvre et sa pertinence sur mentions/confidentialité ; il est déjà masqué sur Contact dans le code, bon choix à conserver.

Objectif de conception : le message doit rester compréhensible si toutes les animations sont à l’arrêt.

## 7. Technique du site

Cette partie concerne le site vitrine. Elle ne constitue pas un audit des automatisations vendues.

### 7.1 Points forts vérifiés dans le code ou publiquement

| Élément | Preuve | Intérêt |
|---|---|---|
| HTML statique Astro | `output: "static"` | Contenu principal disponible sans attendre une application complète |
| Îlots React limités | Formulaire, navigation, thème, terminal | Évite une application monolithique côté client |
| Polices locales | Fichiers WOFF2 dans `public/fonts` | Maîtrise des requêtes et absence de dépendance à un CDN de polices |
| Validation côté serveur | Schéma Zod dans `server/index.mjs` | Ne repose pas uniquement sur les contrôles du navigateur |
| Protection du formulaire | Limitation de débit, taille de corps, honeypot, durée minimale | Plusieurs mesures de limitation des abus sans CAPTCHA tiers |
| CSP et HSTS | En-têtes reçus sur l’accueil public | Protections effectivement présentes dans la réponse inspectée |
| Cache différencié | Code serveur : assets hachés longs, HTML revalidé | Bon principe de performance et de mise à jour |
| Exécution non-root | `USER node` dans Dockerfile | Réduction des privilèges du processus de service |
| Vérification CI de base | Démarrage Docker, routes, 404, utilisateur, santé | La construction n’est pas le seul contrôle prévu |
| Métadonnées fondamentales | Langue, titres, description, canonique | Base SEO et accessibilité présente |
| Formulaire accessible par conception | Labels, autocomplete, focus d’erreur, régions de statut | Bon socle à vérifier en usage réel |

La présence de protections ne prouve pas l’absence de vulnérabilités. Le paramètre de confiance du proxy et l’exposition réseau doivent correspondre à l’infrastructure réelle ; celle-ci n’a pas été inspectée.

### 7.2 Mesures HTTP réalisées

- L’accueil public répondait **HTTP 200**.
- La réponse HEAD annonçait **118 464 octets** pour le HTML non compressé.
- Une requête GET avec négociation de compression a transféré **18 656 octets** de corps.
- Une durée de **0,148 s** a été observée pour cette requête isolée depuis l’environnement de mesure.

Ces nombres concernent le document HTML, pas le poids total de la page ni sa vitesse sur un téléphone. La durée ne correspond pas au LCP et ne peut pas être utilisée comme promesse de performance. Il faut mesurer CSS, JavaScript, polices, rendu et interactions séparément.

Les cibles usuelles de Google sont LCP ≤ 2,5 s, INP ≤ 200 ms et CLS ≤ 0,1 au 75e percentile, avec distinction mobile/ordinateur. Ce sont des objectifs futurs, pas des scores obtenus ici. [R10](https://web.dev/articles/vitals)

### 7.3 Faiblesses techniques et améliorations

**T-W1 — La publication n’est pas protégée contre les contenus marketing incomplets.** `ACompleter` rend toujours un marqueur visible, notamment dans « Sous le capot ». Les blocs facultatifs doivent être masqués proprement ou supprimés. La présence de marqueurs sur les pages légales est connue et reportée à une autre session à la demande du porteur : elle ne doit ni être remplie par invention ni entraîner un blocage automatique du chantier présent. Les contrôles de publication devront distinguer ces périmètres.

**T-W2 — Le formulaire dépend de JavaScript malgré une apparence de formulaire HTML natif.** Le composant est hydraté en `client:idle`. Le HTML déclare `action` et `method="post"`, mais le serveur examiné attend du JSON et des champs calculés comme `dureeRemplissage`. Aucun parseur de formulaire URL-encoded n’est visible dans le serveur lu. Le parcours sans JS ou avant hydratation paraît donc fragile ; c’est une déduction du code, pas un échec provoqué en production. Prévoir un vrai chemin de repli ou rendre l’indisponibilité transitoire explicite tout en conservant l’email alternatif.

**T-W3 — Le système anti-spam peut afficher un faux succès à un humain.** Toute durée inférieure à 3 000 ms ou champ piège rempli renvoie `{ ok: true }` sans envoi. C’est volontaire contre les robots, mais un autofill très rapide ou une fausse détection peut faire perdre une demande. Aucun incident réel n’a été constaté. Tester les cas limites localement et revoir le critère de temps comme signal plutôt que preuve suffisante d’abus.

**T-W4 — Le succès client vérifie principalement le statut HTTP.** Le composant considère `response.ok` comme succès ; un futur retour 2xx avec `{ ok: false }` serait mal interprété. Le contrat actuel est simple, mais gagnerait à être explicite. Les erreurs 400, 429, 502 et 503 sont actuellement ramenées à un message générique. Fournir une attente adaptée en cas de limitation de débit et une issue claire en cas d’indisponibilité.

**T-W5 — L’endpoint de santé ne vérifie pas le parcours commercial.** `/api/health` renvoie `{ ok: true }` indépendamment de SMTP. Cela convient à une vérification de vie du processus, mais pas à une assurance que les demandes arrivent. La CI teste le conteneur sans SMTP. Séparer disponibilité HTTP, configuration email, envoi accepté et réception effective. Garder les diagnostics sensibles hors endpoint public.

**T-W6 — La livraison des messages n’est pas durablement sécurisée par ce dépôt.** Le serveur envoie directement par SMTP et ne stocke pas la demande. Ce choix minimise la conservation, mais il faut une stratégie claire pour les échecs et rebonds. Ne pas ajouter automatiquement une base de données ; décider entre maintien du modèle avec supervision, file sécurisée ou autre mécanisme, et mettre à jour les mentions si des données sont conservées.

**T-W7 — La couverture CI ne traite pas les principaux risques éditoriaux et de conversion.** Les contrôles présents sont utiles, mais ne vérifient pas marqueurs publics, formulaire et erreurs, navigation clavier, régression mobile ou cohérence des promesses. Ajouter quelques contrôles ciblés, pas une suite qui teste chaque phrase décorative.

**T-W8 — Les métadonnées de partage sont absentes du layout examiné.** Pas de balises Open Graph ou Twitter visibles dans `Base.astro`. Pour un site diffusé par recommandation, un aperçu propre du lien a une valeur pratique. Ajouter titre, description et visuel réel adaptés ; ne pas détourner un logo client pour représenter la marque.

**T-W9 — Aucun sitemap ou robots.txt n’a été trouvé dans les sources inspectées.** Cela ne bloque pas automatiquement l’indexation d’un petit site bien lié. Un sitemap des routes publiques devient utile avec les nouvelles pages ; un robots.txt n’est pas un outil de confidentialité. La présence éventuelle d’une configuration distincte sur le serveur public n’a pas été vérifiée.

**T-W10 — Le balisage FAQ ne doit pas être vendu comme un levier d’extraits enrichis.** Le code produit un `FAQPage`. Google indique que les résultats enrichis FAQ ne sont plus affichés depuis le 7 mai 2026. Garder une FAQ utile aux visiteurs ; ne pas prioriser ce schéma pour espérer ce rendu dans les résultats. Le retrait éventuel du balisage est secondaire face aux problèmes commerciaux. [R11](https://developers.google.com/search/updates)

### 7.4 Frontière avec la session juridique séparée

Les marqueurs légaux et les informations incomplètes ont été observés, mais ne font pas l’objet de prescriptions de mise en conformité dans ce rapport. Les pages légales, le statut de l’entreprise et la base légale du formulaire restent hors chantier.

En revanche, les **garanties commerciales et techniques concernant les solutions vendues** restent dans le périmètre de l’audit : le client doit comprendre ce que fait réellement l’intégration, même au stade du lancement. Corriger une promesse excessive sur la conservation ou l’autonomie ne suppose pas de résoudre ici toute la structure juridique de l’activité.

## 8. Technologie et crédibilité des solutions IA

### 8.1 Points forts

**G-F1 — Le contrôle des écritures est mis en scène.** Lire et préparer d’un côté, envoyer et créer de l’autre : cette séparation aide le décideur à comprendre le risque. Elle doit correspondre à une barrière technique réelle.

**G-F2 — Les tarifs sont rattachés à une source métier.** Expliquer que les montants viennent du logiciel de gestion est plus convaincant qu’une promesse vague d’IA fiable.

**G-F3 — L’intégration est présentée comme une couche ajoutée à l’existant.** C’est cohérent avec la promesse de continuité des outils et avec une offre de service.

**G-F4 — L’exploitation n’est pas totalement oubliée.** Files de tâches, reprises, alertes et journalisation apparaissent dans la pile. Ces sujets sont pertinents ; ils doivent être reliés à ce qui est réellement livré et à des résultats vérifiables.

### 8.2 Faiblesses majeures

**G-W1 — La promesse de non-conservation est trop absolue.** Une mémoire de conversation, un cache fournisseur, des journaux, des sauvegardes, un index documentaire et des règles métier sont des catégories différentes. Même une architecture conçue pour minimiser la conservation peut conserver certaines traces nécessaires. Le site les confond sous « rien ».

**G-W2 — RAG, base vectorielle et zéro conservation ne sont pas expliqués ensemble.** Il n’y a pas de contradiction nécessaire si l’index reste dans l’infrastructure du client ou si les architectures proposées sont alternatives. Mais le site ne le dit pas. Un responsable informatique peut donc lire deux promesses incompatibles. Il faut décrire la variante réelle et la frontière de conservation.

**G-W3 — Région UE ne signifie pas automatiquement absence de tout transfert.** Il faut examiner endpoints, sous-traitants, accès de support, métadonnées et contrats. Le dépôt vitrine ne permet pas de vérifier ces éléments. La CNIL recommande notamment de déterminer les données nécessaires et leurs durées de conservation ; une formule marketing globale ne remplace pas cette analyse. [R14](https://www.cnil.fr/en/node/880)

**G-W4 — Le mot « calculer » varie selon les sections.** Confiance indique que la solution peut « calculer un prix sur vos tarifs » ; la FAQ dit qu’elle « ne calcule jamais un prix elle-même ». Une explication cohérente serait : un composant déterministe applique les tarifs et règles, l’IA prépare ou extrait les informations, et le client valide. Cette architecture doit être confirmée avant publication.

**G-W5 — La validation humaine ne suffit pas à prouver la sécurité.** Qui a le droit de valider ? Valide-t-on un objet précis ou un « oui » hors contexte ? Que se passe-t-il en cas de doublon, de changement de montant ou de réessai ? Les risques d’instructions malveillantes dans les documents lus et d’actions excessives sont documentés par OWASP. Cela justifie de vérifier permissions minimales, limites d’actions et validations hors modèle ; cela ne prouve pas qu’une vulnérabilité existe dans la solution sosese. [R15](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/), [R16](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

**G-W6 — « Sans formation » et « aucune écriture sans accord » nécessitent une explication opérationnelle.** Le temps de validation et de correction fait partie du processus. Le bénéfice devrait être de réduire la préparation et les ressaisies, pas de laisser penser à un travail entièrement invisible.

**G-W7 — La pile technique ressemble à un inventaire de capacités.** Le commentaire source dit qu’elle est à valider. PostgreSQL, base vectorielle, OCR, modèles auto-hébergés et multiples protocoles ne prouvent pas qu’une même offre les comprend ou qu’ils ont été livrés. Présenter des options non confirmées comme stack réelle expose à des attentes erronées.

**G-W8 — La réversibilité est une promesse de service autant que de propriété.** Avoir le code ne garantit pas qu’un tiers sache l’exploiter. Il faut des dépendances identifiées, un déploiement reproductible, les procédures de sauvegarde/reprise, la configuration, une documentation et une passation. Les modèles ou logiciels tiers ne deviennent pas la propriété du client parce que le développement spécifique lui est remis.

### 8.3 Registre de promesses à créer avant la réécriture

| Promesse actuelle | Preuve à réunir | Position éditoriale tant que la preuve manque |
|---|---|---|
| « Rien n’est conservé » | Inventaire : documents, prompts, réponses, caches, logs, sauvegardes, index ; durées et suppression | Ne pas publier l’absolu ; parler des catégories et durées validées |
| « Rien ne sert à entraîner l’IA » | Conditions fournisseurs, contrat, configuration et périmètre | Ne publier que sur les services et usages effectivement couverts |
| « Les données ne quittent pas l’Europe » | Cartographie des flux et accès, sous-traitants, régions, garanties contractuelles | Remplacer par un engagement précis de choix et d’information, si réel |
| « Aucune écriture sans votre accord » | Contrôle hors LLM, identité du valideur, objet/version validés, journal d’action | Délimiter les actions soumises à accord ; vérifier chaque démonstration |
| « Aucun nouveau logiciel » | Canaux réellement utilisés, interfaces d’administration et contraintes d’accès | Promettre la conservation des outils principaux, pas une absence universelle d’interface |
| « Code et accès vous appartiennent » | Contrats, licences, titulaire des comptes, documentation de passation | Distinguer développements spécifiques et services tiers |
| « Livré en quatre semaines » | Historique de livraison, capacité, périmètre et prérequis | Présenter une estimation conditionnelle ou retirer le délai non garanti |
| « 40 minutes à 2 minutes » | Source, tâche mesurée, période, taille d’échantillon, temps de vérification | Attribuer au cas ; ne pas généraliser |

Chaque ligne doit avoir un propriétaire, une source, une date et un statut : `vérifié`, `à confirmer`, `illustratif` ou `à retirer`. Ce registre doit alimenter la rédaction et empêcher un LLM d’inventer des engagements.

### 8.4 Ce que le décideur technique attend réellement

Une page technique utile répondrait à huit questions, avec le niveau de détail adapté :

1. Quels logiciels et versions ont déjà été intégrés ?
2. Où passent les données, qui peut y accéder et combien de temps restent-elles ?
3. Quelles opérations sont automatiques, préparées ou validées ?
4. Comment les erreurs, doublons et interruptions sont-ils gérés ?
5. Comment les règles métier et tarifs sont-ils testés ?
6. Qui surveille et corrige après la livraison ?
7. Comment changer de fournisseur ou arrêter le service ?
8. Quels documents et accès sont remis ?

Une réponse concrète à ces questions vaut davantage qu’une liste de noms technologiques ou une fausse ligne de commande.

## 9. Proposition de nouveau discours

### 9.1 Une ligne éditoriale adaptée au stade réel

Le site doit donner l’image d’un prestataire accessible, compétent sur une première réalisation concrète et capable de cadrer soigneusement la suivante. Il n’a pas besoin de prétendre être une agence de grande taille ni d’affirmer une expertise universelle.

**Promesse principale :** moins de ressaisies et de préparation administrative, dans les logiciels déjà utilisés, avec un accompagnement de proximité.

**Preuve principale :** une intégration en service chez L’Atelier des Sols & Fils, fondée sur le catalogue et les données d’Extrabat, avec chiffres attribués au cas.

**Promesse secondaire aux éditeurs :** apporter une expérience d’usage réel et explorer les intégrations qui peuvent servir leurs clients.

**Différenciation à construire :** compréhension du terrain, qualité du cadrage, compatibilité avec les outils, vérifiabilité des résultats et qualité de la transmission. Les valeurs « honnêteté » et « simplicité » doivent se voir dans la démarche, pas être répétées comme des preuves.

### 9.2 Hero proposé — version principale

La version suivante est un brouillon de travail fondé sur le cadrage reçu. Elle ne contient pas de nouveau prix, délai ou résultat inventé.

> **Automatisation pour les petites entreprises autour de Metz**
>
> # Moins de ressaisies. Vos logiciels restent en place.
>
> Devis, fiches clients, relances : sosese conçoit des automatisations reliées à vos outils. Nous partons d’une tâche qui vous prend du temps et vérifions ce qu’il est pertinent d’automatiser.
>
> **Décrire mon besoin** · Voir un cas concret
>
> Intervention en priorité dans un rayon d’environ 80 km autour de Metz.

À compléter près de ce bloc : une phrase sur les actions soumises à validation, seulement après validation de la règle réelle. Le mot « IA » peut figurer dans une phrase de mécanisme ou un sous-titre : « Des automatisations avec de l’IA quand le traitement de vos demandes le nécessite. » Ne pas faire croire que toute automatisation exige un LLM.

**Pourquoi cette proposition est plus précise :** elle nomme la petite entreprise et la proximité, garde la continuité des logiciels, donne trois exemples et décrit ce que fait sosese. Le CTA secondaire conduit vers une réalisation, plus probante qu’une méthode encore abstraite.

**Limite :** « vos logiciels restent en place » doit être assorti, dans le bloc d’offre, d’une vérification de compatibilité. Le sous-titre ne doit pas annoncer des capacités de relance déjà livrées si elles sont seulement envisagées ; distinguer les usages proposés et le cas réalisé.

### 9.3 Variante orientée équipes de terrain

À tester pour des contacts dont le contexte correspond, sans en faire d’emblée la seule identité de sosese :

> **Pour les petites entreprises qui travaillent sur le terrain**
>
> # Préparez vos devis sans tout ressaisir au bureau.
>
> Nous relions vos demandes et vos notes à votre logiciel de gestion pour préparer les fiches clients, les devis et les interventions. Le périmètre et les validations sont définis avec vous.
>
> **Parler de mon processus** · Voir la réalisation chez L’Atelier des Sols & Fils

Cette variante est plus étroite et plus mémorable, mais peut réduire l’identification d’une entreprise de services sans terrain. Choisir selon les conversations et les leads, pas selon la préférence stylistique du rédacteur.

### 9.4 Bloc de preuve recommandé

> **Une intégration déjà utilisée sur le terrain**
>
> Chez L’Atelier des Sols & Fils, la solution consulte le catalogue et les tarifs dans Extrabat, puis prépare la création des devis, rendez-vous et fiches clients avec validation.
>
> **Temps de devis présenté dans le cas : 40 min avant, 2 min après.**
>
> Résultat propre à cette entreprise. Le détail du contexte et de la mesure figure dans le cas client.
>
> **Voir ce qui a été réalisé →**

Avant de publier la dernière phrase, enrichir réellement le cas avec le contexte et les informations de mesure disponibles. Si elles manquent, le dire dans le brouillon interne ; ne pas faire promettre au lien un détail absent. Conserver les valeurs autorisées et ne pas les convertir en garantie de gain pour les visiteurs.

### 9.5 Structure du cas détaillé

1. **L’entreprise et l’utilisateur** : activité, rôle réel de Jason, contexte opérationnel. Le code contient une différence entre un commentaire parlant de dirigeant et un texte le présentant comme commercial : faire confirmer le rôle avant réécriture.
2. **Avant** : qui saisissait quoi, depuis quelles informations et dans quel logiciel ?
3. **Intervention de sosese** : parties conçues, intégrations, règles et validations.
4. **Après** : parcours réellement utilisé, avec ses limites et exceptions.
5. **Résultats** : durées, volumes sur six semaines, source et date ; clarification des rapports « annuels ».
6. **Mesure** : nombre de cas, type de devis, chronométrage ou estimation, temps de correction inclus ou non.
7. **Démonstration illustrative** : exemple inventé explicitement étiqueté, séparé des résultats.
8. **Retour client** : citation seulement si réellement recueillie et autorisée.
9. **Pour qui ce cas est pertinent** : processus comparables, pas un bénéfice universel.
10. **Deux sorties possibles** : « J’ai un processus similaire » et, secondairement, « Je suis éditeur et souhaite parler intégration ».

Ne pas transformer « plus de 50 devis créés » en « 50 ventes gagnées ». Une création dans le logiciel ne prouve pas une signature commerciale. Ne pas déduire un gain cumulé de 50 × 38 minutes sans savoir si les 50 devis sont comparables aux opérations mesurées.

### 9.6 Bloc d’offre, sans inventer de tarifs

> **Commencer par une tâche bien choisie**
>
> Nous examinons votre manière de travailler, les outils concernés et les informations disponibles. Vous recevez un périmètre proposé, les conditions de faisabilité et un chiffrage avant la construction.
>
> Si le projet est pertinent, une première automatisation est testée avec vous sur des cas réels avant sa mise en service.

Ce texte suppose que ces livrables sont réellement proposés. Ajouter les informations validées sur le caractère payant du diagnostic, les dépenses récurrentes et la suite. Si l’offre n’est pas encore stabilisée, mieux vaut une explication courte de la manière de chiffrer qu’un faux catalogue de trois forfaits.

### 9.7 À propos : la personne avant les principes abstraits

Structure recommandée :

- Nom et rôle réels du porteur.
- Pourquoi il a créé cette activité, en lien avec un problème concret observé.
- Expérience vérifiable pertinente pour intégrer des logiciels et accompagner des utilisateurs.
- Première réalisation livrée, avec lien vers le cas.
- Zone d’intervention autour de Metz ; organisation réelle, seul ou avec partenaires.
- Manière de travailler : observation, cadrage, démonstration, transmission.

Exemple de trame, **non publiable sans informations complémentaires** :

> Je suis [nom validé], [rôle réel]. J’accompagne les petites entreprises autour de Metz pour réduire les ressaisies et relier leurs outils. Mon premier projet livré concerne [périmètre confirmé du cas]. Je commence par observer le travail réel et vérifier que l’automatisation apporte un bénéfice suffisant.

La photo n’est pas obligatoire pour réussir la page, mais un portrait réel de qualité peut faciliter l’identification. Ne pas générer un faux portrait de fondateur. Le texte doit rester utile même sans photo.

### 9.8 Parcours éditeurs : brouillon de page

> **Vous éditez un logiciel métier ?**
>
> # Explorons les intégrations utiles à vos utilisateurs.
>
> Le travail réalisé avec L’Atelier des Sols & Fils montre comment une demande terrain peut devenir une fiche client, un devis ou une intervention dans un logiciel existant. sosese souhaite échanger avec les éditeurs sur les usages à traiter et les conditions d’intégration.
>
> **Discuter d’un cas d’intégration**

Sections recommandées :

1. Le problème observé chez l’utilisateur, sans exagérer le nombre d’entretiens réalisés.
2. La réalisation existante, le rôle de sosese et les limites connues.
3. Les questions à explorer ensemble : cas d’usage, API, permissions, versions, expérience utilisateur, support.
4. Une démarche de cadrage puis prototype, à proposer selon le contexte.
5. Ce qui reste à convenir : propriété, distribution, maintenance et modèle commercial, sans annoncer un contrat type inexistant.

Le formulaire peut réutiliser le composant de contact avec une intention « éditeur » présélectionnée. Cette présélection doit être visible, modifiable et transmise correctement au traitement serveur. Ne pas créer un agenda ou une « demande de partenariat officiel » si ce n’est pas le processus réel.

### 9.9 Règles d’écriture pour la suite

| À privilégier | À éviter |
|---|---|
| Un usage, un acteur, un objet, une action | « Une solution innovante qui transforme votre quotidien » |
| « Dans ce cas client… » | Généraliser les résultats d’un seul client |
| Estimation avant pilote, mesure après usage | Appeler « mesuré » un gain prévisionnel |
| Logiciels conservés, compatibilité vérifiée | « Tous vos outils », sans limites |
| Délai conditionné au périmètre | Délai universel pour tout sur-mesure |
| Personne réelle et organisation expliquée | « Notre équipe d’experts » si elle n’existe pas |
| Informations sur maintenance et passation | « Vous êtes propriétaire » comme réponse unique au suivi |
| Localité réelle et rayon approximatif | Faux bureaux ou pages de villes quasi identiques |
| Preuve clairement séparée de l’illustration | Terminal fictif présenté comme mesure réelle |

## 10. Sites et ressources d’inspiration

Les sites suivants ont été consultés pendant l’audit. Ce sont des références de mécanismes de communication, pas des preuves de leur taux de conversion ni des modèles à copier intégralement. La plupart vendent des logiciels, alors que sosese vend un service sur mesure : leurs essais gratuits, tarifs et volumes de clients ne sont pas transposables.

### 10.1 Pennylane — précision de la catégorie et des usages

**Page :** [accueil Pennylane](https://www.pennylane.com/fr).

**Observé :** la proposition nomme des objets métier reconnaissables — finances, comptabilité, compte professionnel — puis organise des usages et présente des personnes associées à leurs entreprises. La catégorie de produit est explicite.

**À reprendre :** nommer les objets traités, montrer le résultat dans un contexte professionnel et identifier les personnes qui témoignent.

**Adaptation sosese :** un titre « Des demandes transformées en devis et fiches dans votre logiciel » et un cas attribué valent mieux qu’une « solution » décrite sans objet.

**À ne pas copier :** le positionnement tout-en-un, puisqu’une partie de la promesse sosese est de conserver l’existant ; les volumes et promesses de gains de l’éditeur ne sont pas des références pour vos propres résultats.

### 10.2 Lucca — segmentation par besoin et réalité du support

**Page :** [accueil Lucca](https://www.lucca.fr/).

**Observé :** les besoins et domaines sont organisés distinctement ; le site explique les services autour du logiciel et affiche des indicateurs de support.

**À reprendre :** rendre visibles les besoins traités et ce qui se passe après la vente.

**Adaptation sosese :** trois usages prioritaires et une présentation simple du suivi : ce qui est surveillé, comment demander de l’aide, ce qui est inclus ou chiffré séparément.

**À ne pas copier :** le catalogue étendu. Avec un premier client livré, une multitude de rubriques peut suggérer une profondeur de gamme inexistante. Ne pas publier de délai de support ou de satisfaction sans données propres.

### 10.3 Basecamp — voix humaine et incarnation

**Page :** [accueil Basecamp](https://basecamp.com/).

**Observé :** le site associe une catégorie explicite à un ton direct, une présentation du produit et un message signé par le cofondateur. Il décrit les difficultés quotidiennes de coordination.

**À reprendre :** assumer une voix identifiable et faire parler une personne réelle, avec une invitation claire.

**Adaptation sosese :** une page À propos signée par le porteur, expliquant le premier projet et sa façon de travailler, plutôt qu’une succession de principes génériques.

**À ne pas copier :** la posture de remplacement d’outils, les affirmations issues de décennies d’activité ou le modèle d’essai gratuit. Le contexte commercial et la maturité sont différents.

### 10.4 n8n — démontrer contrôle et exploitation

**Page :** [accueil n8n](https://n8n.io/).

**Observé :** le site articule intégration, inspection des décisions, évaluation, contrôle humain, cas d’usage et exploitation technique. Les études de cas sont accessibles depuis la page.

**À reprendre :** montrer comment on maîtrise et vérifie le fonctionnement, puis relier cela à un cas précis.

**Adaptation sosese :** remplacer le terminal décoratif par un schéma validé « demande → données utiles → brouillon → validation → écriture », avec les cas d’erreur expliqués sur la page technique ou éditeurs.

**À ne pas copier :** le langage de plateforme pour développeurs sur l’accueil destiné aux petites entreprises. S’inspirer de la structure ne constitue pas une recommandation de changer votre stack vers n8n.

### 10.5 Dust — distinguer usages, contexte et gouvernance

**Page :** [accueil Dust](https://dust.tt/).

**Observé :** les agents sont reliés aux systèmes de l’entreprise ; le site associe cas clients, contexte de travail, permissions et accès à des informations de confiance.

**À reprendre :** séparer les bénéfices utilisateurs des informations de gouvernance, tout en permettant de passer facilement de l’un à l’autre.

**Adaptation sosese :** l’accueil expose le gain pratique ; une page secondaire répond précisément aux questions de données, droits et contrôle.

**À ne pas copier :** le vocabulaire de collaboration multi-agents ni une promesse de plateforme globale. La précision des droits doit venir de votre fonctionnement réel, pas d’un texte emprunté.

### 10.6 Thoughtworks — raconter une prestation par ses réalisations

**Page :** [réalisations et clients Thoughtworks](https://www.thoughtworks.com/clients).

**Observé :** les projets sont présentés avec des entreprises identifiées, des contextes et des domaines d’intervention, puis des liens vers les récits détaillés.

**À reprendre :** organiser une preuve de service autour d’un client, d’un problème et d’une intervention identifiable.

**Adaptation sosese :** faire du cas Atelier des Sols & Fils une page complète et réutilisable dans une conversation commerciale ou avec un éditeur.

**À ne pas copier :** le ton grand compte et la couverture de nombreux secteurs. La crédibilité locale de sosese vient actuellement de la précision de son premier projet.

### 10.7 Priorité d’inspiration

Pour ce stade de projet, je retiendrais **Basecamp pour l’incarnation**, **Pennylane pour les objets métier**, et **Thoughtworks pour la structure du cas**. Utiliser **n8n et Dust pour le parcours éditeurs/technique**, et **Lucca pour clarifier le suivi**. Il ne faut pas mélanger leurs six styles graphiques.

Le design actuel peut accueillir ces améliorations sans changement de palette, de framework ou d’identité. L’inspiration utile est dans l’ordre des informations et la qualité de la preuve.

## 11. Validation et mesure

### 11.1 Ce que le site doit permettre de comprendre

En montrant l’accueil à une personne de la cible pendant dix secondes, puis en le masquant, demander :

1. Que fait sosese ?
2. Pour quel type d’entreprise ?
3. Quel problème peut-il traiter ?
4. Où intervient-il ?
5. Que feriez-vous ensuite si vous étiez intéressé ?

Puis laisser explorer le site et demander : « Qu’achèteriez-vous en premier ? », « Qu’est-ce qui vous donne confiance ? », « Qu’est-ce qui vous manque pour contacter ? »

**Critère de conception proposé :** au moins quatre participants sur cinq restituent correctement service, cible et prochaine étape, sans interpréter l’illustration comme un produit immédiatement disponible. C’est un seuil pratique de revue qualitative, pas une démonstration statistique.

Tester le parcours éditeur séparément avec deux ou trois interlocuteurs produit, partenariat ou technique si accessibles. Vérifier qu’ils comprennent le statut d’intégrateur, la réalisation existante et l’objet de la prise de contact. Ne pas confondre leur vocabulaire avec celui des dirigeants de petites entreprises.

### 11.2 Indicateurs commerciaux prioritaires

Au démarrage, un tableau de suivi manuel peut suffire. Il peut vivre dans l’outil déjà utilisé ; ce rapport ne demande pas d’en installer un nouveau.

| Indicateur | Définition | Utilité |
|---|---|---|
| Demandes entrantes | Nombre de demandes humaines, hors doublons et spam | Volume brut |
| Demandes qualifiées | Besoin pertinent, interlocuteur identifié, faisabilité à explorer | Qualité réelle de l’acquisition |
| Origine déclarée | Recommandation, contact direct, réseau, recherche, autre | Savoir quels canaux produisent les bons échanges |
| Audience | Petite entreprise / éditeur / autre | Ne pas mélanger deux cycles de vente |
| Échanges réalisés | Conversations effectivement tenues | Voir la progression après contact |
| Propositions envoyées | Diagnostic ou projet chiffré | Passage à l’engagement commercial |
| Missions acceptées | Accord sur une mission | Résultat commercial |
| Raisons de refus | Budget, priorité, confiance, compatibilité, autre | Apprendre quoi corriger |
| Délai de réponse | Entre réception et premier retour utile | Maîtriser l’expérience de contact |

Ne pas confondre clic sur CTA, formulaire accepté par SMTP et lead reçu/qualifié. Sans mesure de visites, on ne peut pas calculer un taux visite → lead ; on peut néanmoins suivre les demandes et leur progression.

### 11.3 Si une mesure web est décidée plus tard

Événements minimaux envisagés : affichage d’une page clé, clic de contact selon emplacement, accès au cas, orientation éditeur, début de formulaire et résultat technique. Aucun contenu de message ni donnée directement identifiante ne devrait être envoyé dans un événement de mesure.

Cette instrumentation changerait l’affirmation actuelle « aucune mesure d’audience ». **Elle reste conditionnée à la décision du porteur et à la session dédiée sur les données ; elle n’est pas à ajouter automatiquement dans le chantier.** Un compteur de leads manuel permet de commencer sans ce changement.

À faible trafic, privilégier entretiens, observation des parcours et comparaison de la qualité des demandes dans le temps. Un test A/B sur quelques visites ou deux leads ne peut pas départager sérieusement deux titres. Ne pas imposer de seuil de conversion universel à une activité nouvelle.

### 11.4 Recette fonctionnelle cible

- Accueil lisible à 360/390, 768 et 1440 px, sans débordement horizontal ni contenu essentiel masqué.
- Deux thèmes vérifiés ; zoom 200 % et reflow étroit à examiner ; navigation clavier avec focus visible.
- Ancres et liens fonctionnels ; intitulés cohérents avec les destinations.
- Première preuve accessible dans le hero ou juste après, avant la méthode détaillée.
- Illustrations identifiées comme telles, état statique compréhensible, pause opérationnelle.
- Mode de mouvement réduit pris en compte, y compris pour le terminal s’il est conservé.
- Formulaire : erreurs locales et serveur, limitation de débit, indisponibilité, succès, double clic, réseau lent et absence de JavaScript.
- Tests d’envoi uniquement dans un environnement local avec boîte de test ; une réception réelle en production nécessite une instruction explicite distincte.
- Relevés de performance reproductibles ; distinction mesures de laboratoire et données terrain.

## 12. Plan d’action et tickets

### 12.1 Ordre de travail recommandé

| Lot | Résultat recherché | Contenu | Dépendances |
|---|---|---|---|
| 0 — Vérité commerciale | Un brief unique et des promesses maîtrisées | Cible, zone, audience éditeur, organisation, registre de preuves | Réponses du porteur et éléments du premier projet |
| 1 — Version vitrine crédible | Un visiteur comprend qui fait quoi et pourquoi le contacter | Hero, preuve proche, À propos, nettoyage des blocs inachevés | Lot 0 |
| 2 — Offre et conversion | Le prospect comprend le premier engagement | Fiche d’offre, FAQ, contact, fiabilité du parcours | Offre décidée par le porteur |
| 3 — Éditeurs | Une entrée secondaire crédible | Page dédiée, cas partagé, intention de contact | Cas documenté, rôle et limites clairs |
| 4 — Qualité et apprentissage | Une version contrôlée et mesurable | Accessibilité, SEO utile, CI ciblée, suivi manuel | Pages et parcours stabilisés |

**Cadence indicative :** décisions et collecte sur quelques jours ; première révision éditoriale dans une semaine de travail disponible ; pages détaillées, fiabilisation et recette sur les semaines suivantes. Cette indication n’est pas un devis. La collecte des preuves et les décisions sur l’offre peuvent être le chemin critique, davantage que le développement.

Le premier lot publiable ne nécessite ni blog, ni calculateur ROI, ni nouvelle animation, ni changement de framework. Les mises en production restent à la main du porteur selon l’organisation du dépôt.

### 12.2 Backlog synthétique

Effort : S = intervention localisée ; M = plusieurs composants ou collecte ciblée ; L = travail transverse. Ces tailles sont relatives et ne constituent pas des durées promises.

| ID | Priorité | Responsable principal | Effort | Résultat |
|---|---|---|---|---|
| A01 | P0 | Porteur + rédaction | S | Brief unique 0–50 salariés, Metz ±80 km, éditeurs secondaires |
| A02 | P0 | Porteur + technique | M | Registre des promesses et preuves |
| A03 | P0 | Développement | S | Suppression des marqueurs marketing visibles |
| A04 | P1 | Porteur + commercial | M | Première offre achetable et suite explicite |
| A05 | P1 | Porteur + rédaction | M | Cas client documenté et illustrations séparées |
| A06 | P1 | Rédaction + développement | M | Accueil réordonné et hero précis |
| A07 | P1 | Porteur + rédaction | S/M | Présentation personnelle crédible et locale |
| A08 | P1 | Commercial + développement | M | Formulaire utile et parcours cohérent |
| A09 | P1 | Développement | M | Résilience du contact et tests ciblés |
| A10 | P1 | Porteur + rédaction | M | Page éditeurs distincte |
| A11 | P1 | Commercial + rédaction | S | FAQ qui répond aux objections d’achat |
| A12 | P2 | Design + développement | M | Lisibilité mobile et animations simplifiées |
| A13 | P2 | Technique + rédaction | M | Informations techniques factuelles et contextualisées |
| A14 | P2 | Développement | S/M | Partage et indexation propres |
| A15 | P2 | Porteur + commercial | S | Tableau manuel de qualification des leads |
| A16 | P2 | Développement | M | Contrôles de publication ciblés |
| A17 | P2 | Porteur + UX | M | Tests de compréhension sur les deux audiences |
| A18 | P3 | Porteur + commercial | M | Acquisition ciblée alimentée par les preuves |

### 12.3 Tickets détaillés transférables

#### A01 — Unifier le brief stratégique

**Problème :** cible publique 15–150, guide 1–50, cible réelle 0–50 locale ; éditeurs absents.

**Action :** consigner dans une source de vérité les décisions confirmées ; adapter la description de la cible et de la zone. Ne pas convertir automatiquement toute l’offre en spécialisation BTP.

**Fichiers concernés :** `src/config/site.ts`, `src/pages/a-propos.astro`, puis documents de référence à mettre en cohérence lors du futur chantier.

**Dépendance :** aucune pour les faits confirmés ; nom et organisation restent à fournir.

**Acceptation :** plus de 15–150 dans le contenu commercial actif ; Metz et environ 80 km formulés sans frontière stricte ; objectif éditeur explicitement secondaire ; aucune équipe inventée.

#### A02 — Vérifier les promesses

**Problème :** garanties absolues et délais non délimités.

**Action :** utiliser la matrice §8.3 ; attribuer une source et un statut à chaque promesse ; proposer des formulations compatibles avec le niveau de preuve.

**Fichiers concernés :** `Confiance.astro`, `Offre.astro`, `Methode.astro`, `SousLeCapot.astro`, FAQ et démonstrations.

**Dépendance :** configurations et description réelle de la solution par le porteur ; ne pas accéder à des secrets ou au VPS.

**Acceptation :** aucune promesse générale de zéro conservation, de localisation ou de délai sans périmètre validé ; distinction estimation/résultat ; absence de généralisation du cas.

#### A03 — Nettoyer les blocs marketing inachevés

**Problème :** second visuel « à compléter » visible dans « Sous le capot ».

**Action :** retirer le bloc facultatif et rééquilibrer la section, ou le remplacer par une information vérifiée utile au parcours. Ne pas créer une animation pour remplir un vide.

**Fichiers concernés :** `src/components/sections/SousLeCapot.astro`, éventuellement `ACompleter.astro` si son usage est rendu explicite.

**Dépendance :** aucune pour retirer le bloc facultatif.

**Acceptation :** aucun marqueur de travail sur les pages commerciales rendues ; aucun grand espace vide créé ; pages légales exclues de ce ticket et laissées pour la session dédiée.

#### A04 — Définir la première offre

**Problème :** méthode compréhensible, engagement d’achat flou.

**Action :** compléter une fiche de mission : bénéficiaire, entrées, travail, sorties, exclusions, chiffrage, décision suivante, coûts récurrents et suivi. Étudier un cadrage proportionné aux petites entreprises plutôt qu’un atelier universel de deux jours.

**Fichiers concernés :** `Offre.astro`, `Methode.astro`, `faq/cout.md`, éventuelle page `/offre`.

**Dépendance :** décision commerciale du porteur ; aucun tarif généré arbitrairement.

**Acceptation :** le lecteur sait ce qu’il achète d’abord, ce qu’il reçoit, ce qui reste à chiffrer et ce qui se passe s’il ne poursuit pas. Le diagnostic n’est pas présenté comme gratuit sans décision réelle.

#### A05 — Transformer le premier cas en preuve complète

**Problème :** preuve forte mais méthodologie incomplète et scénarios mêlés.

**Action :** collecter les éléments du §9.5 ; créer une page dédiée et un résumé réutilisable. Confirmer le rôle de Jason et la signification des rapports annuels. Ajouter des étiquettes visibles aux exemples inventés.

**Fichiers concernés :** `Clients.astro`, `EnchainementClient.astro`, `RotationEcrans.astro`, nouvelle page proposée `/cas-clients/atelier-sols-fils`.

**Dépendance :** données et autorisations du client pour tout ajout ; les chiffres existants ne sont pas modifiés sans validation.

**Acceptation :** chaque chiffre est attribué et contextualisé ; illustration et fait ne peuvent pas être confondus ; aucune citation fabriquée ; le lien depuis l’accueil conduit à une page réellement détaillée.

#### A06 — Réordonner et réécrire l’accueil

**Problème :** preuve tardive, message trop général, parcours long.

**Action :** appliquer §6.3 ; raccourcir le hero ; faire apparaître un résumé du cas avant la méthode ; limiter les répétitions ; ajouter la proximité.

**Fichiers concernés :** `src/pages/index.astro`, `Hero.astro`, `Probleme.astro`, `Engagements.astro`, `CtaFinal.astro`, navigation.

**Dépendance :** A01, A02 ; A05 pour le lien complet, mais une preuve résumée peut utiliser les données déjà autorisées.

**Acceptation :** service, cible, exemple, zone et prochaine étape lisibles rapidement ; première preuve avant méthode ; CTA vers la destination attendue ; ancres historiques préservées ; aucune promesse nouvelle non validée.

#### A07 — Incarner le prestataire

**Problème :** À propos générique malgré un service de proximité.

**Action :** intégrer nom, rôle, expérience pertinente, organisation réelle, zone et première réalisation ; expliquer « je » ou « nous » de façon cohérente.

**Fichiers concernés :** `src/config/site.ts`, `src/pages/a-propos.astro`, section courte sur l’accueil si utile.

**Dépendance :** informations biographiques et éventuel portrait fournis/validés.

**Acceptation :** un prospect sait qui prendra en charge son projet ; aucun nombre d’années, certification, associé ou client inventé ; page utile sans photo si elle manque.

#### A08 — Simplifier et orienter le contact

**Problème :** le besoin est facultatif alors que le secteur est obligatoire ; audience éditeur absente.

**Action :** définir les champs nécessaires et les intentions client/éditeur ; écrire l’attente et la suite ; utiliser un CTA fidèle au formulaire. Un paramètre d’intention éventuel doit être validé et visible.

**Fichiers concernés :** `contact.astro`, `ContactForm.tsx`, `src/lib/contact.ts`, `shared/contact.json`, `server/index.mjs`.

**Dépendance :** A04 et décision sur le traitement des leads ; mécanisme juridique d’accord conservé pour cette session.

**Acceptation :** client et serveur partagent les règles ; message de besoin exploitable ou choix explicite de discussion ; téléphone facultatif ; données conservées dans les champs en cas d’échec ; aucune promesse de délai de réponse inventée.

#### A09 — Fiabiliser le parcours de demande

**Problème :** dépendance à l’hydratation, erreurs génériques, faux succès anti-spam possible.

**Action :** décider d’un chemin sans JS ou d’un repli explicite ; vérifier le contrat JSON ; traiter les erreurs pertinentes ; tester autofill rapide et durée minimale ; documenter la différence SMTP accepté/réception.

**Fichiers concernés :** `ContactForm.tsx`, `server/index.mjs`, règles partagées et configuration de test locale existante.

**Dépendance :** A08 pour le schéma final.

**Acceptation :** tests locaux couvrant validation 400, débit 429, indisponibilité 503, erreur d’envoi 502 et succès ; absence de double envoi ; aucun faux message affirmant une réception non vérifiée ; aucun email envoyé à un tiers pendant les tests.

#### A10 — Construire le parcours éditeurs

**Problème :** objectif stratégique secondaire absent du site.

**Action :** créer la page décrite au §9.8 ; ajouter une entrée discrète depuis navigation ou footer ; réutiliser le cas et l’intention de contact.

**Fichiers concernés :** nouvelle page `src/pages/editeurs.astro`, navigation dans `site.ts`, footer et contact.

**Dépendance :** A02, A05, A08 ; rôle et capacités d’intégration confirmés.

**Acceptation :** un éditeur comprend l’apport terrain, le cas livré, les sujets à explorer et la prochaine étape ; aucun partenariat, SLA, licence ou produit en marque blanche inventé ; le hero principal reste centré sur les petites entreprises.

#### A11 — Réécrire les objections commerciales

**Problème :** prix, échec, délai et suivi sont abordés sans réponse assez opérationnelle.

**Action :** privilégier six à huit questions réellement utiles ; clarifier coût initial/récurrent, compatibilité, recette, reprise, données et modalités de suivi. Garder le contenu technique approfondi hors de la FAQ générale.

**Fichiers concernés :** `src/content/faq/*.md`, `Faq.astro`.

**Dépendance :** A02 et A04.

**Acceptation :** chaque réponse commence par répondre à la question ; pas de garantie contradictoire ; aucune donnée sensible ou contractuelle inventée ; réponse distincte à « que se passe-t-il si cela ne fonctionne pas ? ».

#### A12 — Réduire le coût de lecture mobile

**Problème :** page très longue, petits détails animés, CTA flottant pouvant recouvrir des illustrations.

**Action :** garder une démonstration principale, rendre les détails facultatifs, revoir les espacements après simplification du contenu ; prendre en compte le mouvement réduit ; vérifier les libellés et contrôles.

**Fichiers concernés :** styles/tokens, démonstrations, `Methode.astro`, `TerminalDemo.tsx`, `MobileCta.astro`.

**Dépendance :** A06 ; ne pas optimiser la longueur d’un parcours qui va être réorganisé.

**Acceptation :** lecture statique suffisante ; pas de contenu essentiel recouvert ; pause accessible ; contrôles utilisables au clavier ; vues étroites et deux thèmes inspectés. Pas d’objectif arbitraire « diviser la page par deux » au détriment d’informations utiles.

#### A13 — Remplacer la vitrine technologique par des réponses techniques

**Problème :** inventaire de stack et terminal scénarisé sans démonstration de fiabilité.

**Action :** présenter uniquement la stack réellement employée ou distinguer les variantes ; décrire flux, validations, échecs et reprise. Mettre le niveau technique dans le parcours éditeur ou une page adaptée.

**Fichiers concernés :** `SousLeCapot.astro`, `Confiance.astro`, page éditeurs et éventuelle page de fonctionnement.

**Dépendance :** A02 et description réelle de l’architecture ; pas d’accès aux systèmes client.

**Acceptation :** toutes les capacités techniques annoncées ont une source ; aucun terminal fictif lu comme une mesure ; distinction des données du site et des projets clients ; principe de calcul des montants cohérent entre FAQ et schéma.

#### A14 — Améliorer le partage et le référencement utile

**Problème :** métadonnées sociales absentes, peu de pages correspondant à des intentions précises.

**Action :** métadonnées par page, aperçu de partage, canonique cohérente, sitemap si pages ajoutées ; titres locaux naturels ; maillage vers offre, cas et éditeurs. Vérifier les routes publiques réellement destinées à l’indexation.

**Fichiers concernés :** `Base.astro`, `astro.config.mjs`, routes et fichiers publics appropriés.

**Dépendance :** A05, A06, A10 ; identité de marque validée pour le visuel.

**Acceptation :** titres/descriptions distincts, liens internes fonctionnels, aperçu lisible, seules pages publiables listées. Aucun faux établissement à Metz, aucune série de pages de villes artificielles, aucune promesse d’extrait FAQ Google.

#### A15 — Suivre les leads sans ajouter de traçage par défaut

**Problème :** pas de données pour savoir ce qui fonctionne.

**Action :** définir un suivi manuel avec origine déclarée, audience, besoin, statut et raison de refus ; revue hebdomadaire courte.

**Fichiers concernés :** aucun composant web obligatoire ; outil commercial au choix du porteur.

**Dépendance :** définition d’un lead qualifié.

**Acceptation :** les prochaines demandes peuvent être classées de façon cohérente ; les deux audiences sont séparées ; aucune collecte web supplémentaire introduite silencieusement.

#### A16 — Ajouter des contrôles de publication ciblés

**Problème :** les tests actuels ne préviennent pas les régressions de contenu ou de contact.

**Action :** tests de routes et de formulaire sur environnement local, détection des marqueurs sur pages commerciales, quelques contrôles d’accessibilité et liens ; conserver les tests Docker existants.

**Fichiers concernés :** workflow CI et fichiers de tests à définir selon les outils existants.

**Dépendance :** parcours final et contrats de formulaire stabilisés.

**Acceptation :** les contrôles échouent sur les régressions ciblées ; aucun besoin de secrets de production ; exception explicite et temporaire pour le chantier légal hors périmètre ; aucune publication automatique vers le VPS.

#### A17 — Faire tester la compréhension

**Problème :** l’audit est argumenté mais ne remplace pas la perception réelle des acheteurs.

**Action :** sessions qualitatives du §11.1 ; relever verbatim, incompréhensions, hésitations et questions non résolues.

**Fichiers concernés :** synthèse de recherche future ; corrections éditoriales localisées après observation.

**Dépendance :** prototype suffisamment complet ; participants recrutés par le porteur.

**Acceptation :** résultats distinguant faits observés et interprétations ; améliorations décidées sur problèmes récurrents ; aucun pourcentage de conversion extrapolé de cinq entretiens.

#### A18 — Développer l’acquisition à partir des premiers retours

**Problème :** élargir trop vite le contenu peut diluer l’apprentissage.

**Action :** utiliser le cas dans les échanges locaux autour de Metz et dans des conversations ciblées avec éditeurs ; créer ensuite la prochaine page sur un besoin réellement demandé. Choisir le canal d’après l’origine des leads qualifiés.

**Fichiers concernés :** éventuellement une future page d’usage ; pas de modification systématique nécessaire.

**Dépendance :** A05, A10, A15 et premiers retours.

**Acceptation :** une hypothèse de cible/canal par action, un retour documenté et une décision de poursuite. Les contacts sortants, publications et messages ne sont pas autorisés par ce ticket seul : ils demandent une instruction dédiée du porteur.

### 12.4 Ce qui est volontairement différé

- Constitution de l’entreprise, mentions légales et conformité juridique : session séparée demandée.
- Nouvelle identité visuelle et refonte de framework : aucun besoin démontré.
- Calculateur ROI public : prématuré sans modèle économique et hypothèses contrôlées.
- Blog, nombreuses pages sectorielles ou pages de villes : attendre les besoins réels.
- Chatbot public : ajoute un canal et des promesses à maintenir sans résoudre les défauts actuels.
- Programme partenaires, produit standardisé ou marque blanche pour éditeurs : opportunités à explorer, pas offres existantes.
- Tests A/B : attendre un volume et une question qui rendent l’expérience exploitable.
- Instrumentation d’audience : décision distincte ; commencer par le suivi commercial.

## 13. Brief transférable à un LLM

Le bloc suivant peut être copié dans une nouvelle session avec accès au dépôt et à ce rapport. **Il décrit le futur chantier ; il n’autorise aucune modification dans la session d’audit qui produit ce document.** Les passages dépendant d’informations métier doivent être résolus avec le porteur, sans bloquer les tâches indépendantes.

```text
Tu interviens sur le dépôt local /home/joris/dev/sosese.
Lis RAPPORT-AUDIT-STRATEGIQUE-2026-09-21.md, les instructions applicables du dépôt,
puis DESIGN.md et les fichiers concernés avant toute modification.

OBJECTIF
Améliorer un site vitrine qui doit aussi produire des leads qualifiés.
Audience principale : indépendants, TPE et petites PME de 0 à 50 salariés,
en priorité dans un rayon d'environ 80 km autour de Metz.
Audience secondaire : éditeurs de logiciels intéressés par des intégrations
fondées sur l'expérience terrain de sosese.
Un premier client a été livré : L'Atelier des Sols & Fils.
Le porteur discute avec ses premiers prospects.
Ne pas inventer une agence installée, une équipe, des références ou des partenariats.

PÉRIMÈTRE ET LIMITES
- Conserver Astro, les composants utiles et les tokens existants par défaut.
- Ne pas accéder au VPS ; pas de SSH/SCP/rsync, pas de déploiement.
- Ne pas lire ni modifier .env ; utiliser seulement les exemples autorisés.
- Respecter les changements déjà présents dans le dépôt ; commencer par git status
  et un examen des différences pertinentes. Ne jamais les écraser.
- Pas de push, PR, tag, message à un tiers ou publication sans instruction dédiée.
- Légal et structure juridique hors périmètre de cette session : ne pas inventer
  raison sociale, adresse, SIRET, TVA, statut, hébergeur ou base légale.
- Ne pas bloquer la révision marketing sur les marqueurs légaux connus et différés.
- Ne pas ajouter d'analytics, cookies, agenda externe, chatbot ou script tiers par défaut.
- Tester les emails uniquement dans l'environnement local de test prévu.
- Réaliser une évolution cohérente à la fois et respecter la procédure du dépôt.

FAITS CONFIRMÉS
- Site public : https://sosese.tech/.
- Cible 0–50 et Metz ±80 km priment sur les anciennes mentions 15–150 / 1–50.
- Ouverture à d'autres opportunités, sans transformer le message en cible universelle.
- Le cas client existant et ses chiffres sont des données attribuées au client,
  non une garantie générale. Toute modification ou ajout exige une source validée.
- L'intégration cite Extrabat, sans preuve de partenariat officiel avec cet éditeur.

INFORMATIONS À OBTENIR SI NÉCESSAIRES
Nom, rôle et expérience du porteur ; organisation réelle ; offre de diagnostic,
prix ou mode de chiffrage, livrables, suivi ; conditions de délai ; architecture
réelle des données ; méthode des mesures du cas ; rôle exact de Jason ; droits
et possibilités de réutilisation de l'intégration pour des éditeurs.
Une information manquante n'autorise jamais une valeur plausible inventée.
Préparer les décisions, indiquer les dépendances et avancer sur les tâches indépendantes.

ORDRE DE CHANTIER
1. A01 + A02 : brief unique et registre de promesses (vérifié / à confirmer /
   illustratif / à retirer), avec sources et propriétaire.
2. A03 : retirer le bloc marketing « second visuel à compléter » de SousLeCapot
   sans le remplacer par une décoration inutile.
3. A04 + A05 : préciser première mission et documenter le cas client.
4. A06 + A07 : accueil plus court, preuve avant méthode, cible locale,
   interlocuteur identifiable ; préserver les ancres existantes.
5. A08 + A09 + A11 : formulaire utile, contrat client/serveur cohérent,
   gestion des erreurs, repli et FAQ commerciale explicite.
6. A10 : page /editeurs et entrée secondaire vers un contact adapté.
7. A12 à A17 : mobile, accessibilité, explication technique, SEO utile,
   contrôles de publication et protocole de compréhension.
8. A18 reste une piste ultérieure : ne pas lancer de prospection automatiquement.

RÈGLES DE RÉDACTION
- Nommer objets, actions et bénéficiaires ; éviter « solution » sans explication.
- Conserver la simplicité du ton ; ne pas dévaloriser le travail administratif.
- Les titres seuls doivent raconter service, preuve, offre et prochaine étape.
- Distinguer estimation avant pilote et mesure après usage.
- Étiqueter visiblement les scénarios inventés et les séparer des résultats réels.
- Ne pas publier « aucune donnée conservée », « jamais hors UE », « tous vos outils »
  ou un délai universel sans preuve et périmètre validés.
- Le CTA décrit l'action réelle : formulaire ≠ rendez-vous réservé.
- Ne pas inventer de tarif, durée de réponse, certification, citation ou gain.
- Ignorer les statistiques non sourcées du guide copywriting local, notamment
  le gain de 22 % attribué à PAS et les gains quotidiens génériques.
- Ne pas transformer un cas terrain en spécialisation sectorielle exclusive
  sans décision du porteur.

ARCHITECTURE VISÉE
Accueil : promesse/cible/zone → preuve résumée → usages → première mission →
méthode courte → personne/garanties → FAQ → contact.
Cas détaillé : contexte → intervention → usage → résultats/méthode → limites →
illustration étiquetée → contact.
Éditeurs : usage terrain → intégration réalisée → questions produit/technique →
démarche de cadrage → contact. Aucun partenariat fictif.

RECETTE
- Build réussi lors du chantier ; aucun fichier utilisateur écrasé.
- Aucun marqueur marketing public ; pages légales exclues du lot comme demandé.
- Vues 360/390, 768 et 1440 px, clair/sombre, clavier, zoom et mouvement réduit.
- Aucun contenu essentiel masqué par le CTA flottant ; lecture sans animation utile.
- Cas réel et illustrations clairement distincts ; garanties cohérentes partout.
- Formulaire testé localement : validations, 400/429/502/503, succès,
  réseau lent, double clic, autofill rapide, avant hydratation et sans JS.
- Liens, ancres, canoniques et métadonnées cohérents ; pas de promesse de rich result FAQ.
- Aucun envoi réel ni déploiement réalisé dans la recette sans autorisation distincte.

SORTIE ATTENDUE PAR LOT
Donner ce qui a changé, pourquoi, les fichiers concernés, les vérifications
réellement réalisées et les décisions encore nécessaires.
Ne pas déclarer validé ce qui n'a pas été testé ou confirmé.
Mettre à jour la documentation du dépôt selon ses règles lorsque l'implémentation change.
```

### 13.1 Livrables attendus du futur chantier

1. Un brief stratégique unique et un registre des promesses.
2. Une copie finalisée par page, avec statut des informations métier.
3. Un accueil réorganisé sans refonte inutile.
4. Une étude de cas consultable et une page éditeurs.
5. Un parcours de contact fiable et une FAQ utile à la décision.
6. Une recette documentée, avec les limites explicitement restantes.
7. Un suivi commercial simple pour apprendre des premiers leads.

## 14. Informations à obtenir du dirigeant

Les questions initiales ont déjà fixé cible, zone, objectifs et stade. Il n’est pas utile de les reposer. Les éléments suivants restent à préciser **au moment où le chantier en dépend**.

| Information | Pourquoi elle compte | Si elle manque |
|---|---|---|
| Nom, rôle, expérience et organisation réelle | Incarner À propos et la relation de proximité | Préparer la structure ; ne pas inventer la biographie |
| Offre de première mission | Définir ce qui est vendu | Expliquer le processus de contact sans faux forfait |
| Prix ou logique de chiffrage et coûts récurrents | Qualifier les leads et rassurer sur l’achat | Publier les facteurs validés, jamais une fourchette arbitraire |
| Disponibilité et délai de réponse réel | Éviter les engagements intenables | Ne pas afficher de SLA marketing |
| Conditions des ateliers sur place | Rendre la proximité concrète | Conserver le rayon indicatif, ne pas garantir tous les déplacements |
| Mesure des temps du cas | Solidifier la preuve | Attribuer les données existantes et éviter les extrapolations |
| Sens des trois rapports annuels | Lever une ambiguïté | Ne pas reformuler en inventant une période |
| Rôle exact de Jason | Attribution correcte | Garder l’information à confirmer dans le brouillon interne |
| Architecture et fournisseurs réels | Délimiter les promesses de données | Retirer les absolus non étayés |
| Modalités de maintenance et passation | Répondre à « et après ? » | Proposer une décision de service, pas une garantie fictive |
| Apport souhaité aux éditeurs | Cadrer collaboration, intégration ou sous-traitance | Page exploratoire avec contact, sans modèle contractuel annoncé |
| Droits sur le connecteur et conditions d’API | Évaluer une réutilisation commerciale | Ne pas promettre un produit réutilisable ou une licence |

**Décision recommandée pour commencer :** une vitrine locale incarnée, un cas documenté et une première mission claire, puis une page éditeurs sobre. C’est une ambition compatible avec un premier client livré et suffisamment structurée pour accueillir les opportunités suivantes.

## 15. Références externes

Sources consultées le 21 septembre 2026. Les principes issus de ces sources sont distingués des recommandations propres à sosese. Les recherches anciennes sont utilisées pour leurs enseignements de lecture et de décision, pas comme statistiques actuelles de conversion. Les pages commerciales sont des inspirations observées, pas des preuves indépendantes de performance.

| Réf. | Source | Usage dans cet audit | Limite |
|---|---|---|---|
| R1 | [April Dunford — Positioning](https://www.aprildunford.com/) | Différence, valeur et clients les plus adaptés | Cadre de praticienne ; le segment de sosese reste à éprouver |
| R2 | [April Dunford — A Buyer-Centric Approach to Competitive Positioning](https://aprildunford.substack.com/p/a-buyer-centric-approach-to-competitive) | Alternatives réellement envisagées par l’acheteur | N’établit pas quelles alternatives vos prospects choisissent effectivement |
| R3 | [NN/g — Concise, Scannable, and Objective](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/) | Concision, repérage, langage factuel | Recherche historique ; pas de promesse de gain transposable |
| R4 | [NN/g — Layer-Cake Pattern](https://www.nngroup.com/articles/layer-cake-pattern-scanning/) | Titres informatifs et lecture par sections | Une structure aide la lecture sans garantir la persuasion |
| R5 | [Copyhackers — Copywriting research](https://copyhackers.com/2022/06/copywriting-research/) | Recherche de langage client avant rédaction | Méthode de praticiens, à alimenter avec vos données |
| R6 | [NN/g — B2B Usability](https://www.nngroup.com/articles/b2b-usability/) | Importance des informations d’achat et de crédibilité | Recherche ancienne ; pas de règle tarifaire universelle |
| R7 | [NN/g — About Us Information](https://www.nngroup.com/articles/about-us-information-on-websites/) | Identification de l’organisation et confiance | Ne permet pas de mesurer l’effet isolé d’un portrait |
| R8 | [GOV.UK — Structuring forms](https://www.gov.uk/service-manual/design/form-structure) | Justifier chaque question du formulaire | Contexte de services publics à adapter au B2B |
| R9 | [W3C — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) | Maîtrise des contenus animés | Un critère parmi d’autres ; audit d’accessibilité complet non réalisé |
| R10 | [Google web.dev — Web Vitals](https://web.dev/articles/vitals) | Seuils et distinction laboratoire/terrain | Aucun score réel sosese déduit de la source |
| R11 | [Google Search Central — Updates](https://developers.google.com/search/updates) | Retrait des résultats enrichis FAQ depuis mai 2026 | Ne dit pas que le contenu FAQ serait inutile |
| R12 | [CNIL — Exemples de formulaire](https://www.cnil.fr/fr/exemples-de-formulaire-de-collecte-de-donnees-caractere-personnel) | Référence conservée pour la session ultérieure sur les données | Chantier juridique exclu du présent plan |
| R13 | [Service Public — Mentions d’un entrepreneur individuel](https://entreprendre.service-public.gouv.fr/vosdroits/F31228) | Vérification de contexte initiale | Statut non choisi ; aucune application automatique, session séparée |
| R14 | [CNIL — IA et RGPD](https://www.cnil.fr/en/node/880) | Distinction données nécessaires et conservation | Ne certifie aucun fournisseur ni architecture sosese |
| R15 | [OWASP — Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) | Limites de permissions et d’actions des agents | Risques génériques ; aucun exploit démontré ici |
| R16 | [OWASP — Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) | Examiner la lecture de contenus et les barrières hors modèle | Ne prouve pas une vulnérabilité dans le projet client |

Sites d’inspiration consultés : [Pennylane](https://www.pennylane.com/fr), [Lucca](https://www.lucca.fr/), [Basecamp](https://basecamp.com/), [n8n](https://n8n.io/), [Dust](https://dust.tt/), [Thoughtworks](https://www.thoughtworks.com/clients). Les éléments à transposer et les limites figurent au §10.

**Périmètre de livraison de cet audit :** ce fichier Markdown uniquement. Les propositions de texte sont des brouillons à valider ; les tickets et le brief LLM préparent le chantier suivant. La cible locale, la zone de Metz, le premier cas et l’entrée éditeurs constituent désormais le cadre recommandé pour ce chantier.
