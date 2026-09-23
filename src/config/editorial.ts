// Contenus éditoriaux partagés par plusieurs pages de la V3. Règles d'écriture : RAPPORT-COPYWRITING-V1-V2-2026-09-23.md,
// §3.8 (voix « je », scènes plutôt qu'étiquettes, trois réserves au maximum sur tout le site).
// Les durées et engagements ci-dessous reprennent ceux publiés par le porteur en V1 (tag v0.8) : rien de nouveau n'est promis.

// Chiffres communiqués par le client (voir casClient.protocole pour le détail de mesure, à fournir).
// « 3 rapports d'analyse annuels » (V1/V2) n'est plus affiché : sens ambigu, à préciser avant de le republier.
export const preuve = {
  periode: "Six premières semaines d’utilisation",
  date: "Chiffres communiqués le 19 septembre 2026",
  production: [
    { valeur: "+50", label: "devis créés" },
    { valeur: "+30", label: "rendez-vous posés" },
    { valeur: "+40", label: "fiches clients créées" },
  ],
  devis: [
    { label: "Avant · ressaisi au bureau", value: 40, display: "40 min", tone: "muted" },
    { label: "Après · dicté sur le chantier", value: 2, display: "2 min", tone: "accent" },
  ],
  fiche: [
    { label: "Avant · saisie à la main", value: 5, display: "5 min", tone: "muted" },
    { label: "Après · dictée sur place", value: 0.5, display: "30 s", tone: "accent" },
  ],
} as const;

// Le constat, en trois scènes (V1, section « Le temps que personne n'a décidé de perdre »).
export const scenes = [
  { titre: "La même information, tapée trois fois.", texte: "Dans le devis, puis dans la facture, puis dans le tableau de suivi." },
  { titre: "L’information existe. Personne n’a le temps de la chercher.", texte: "Tarifs, chantiers, historique client : tout est là, éparpillé entre plusieurs outils." },
  { titre: "La bonne personne est absente. Le dossier attend.", texte: "Ce qu’elle sait faire n’est écrit nulle part. Ça repart avec elle le vendredi soir." },
];

// Trois portes d'entrée. `statut` distingue ce qui tourne déjà de ce qui reste à étudier chez vous :
// il remplace la phrase de réserve de la V2.
export const besoins = [
  {
    statut: "en-service",
    titre: "Le devis, dicté sur place",
    scene: "« Parquet chêne, 25 m², plinthes, vitrification. » Le devis est prêt dans votre logiciel, aux prix de votre catalogue.",
    detail: "Déjà en service chez L’Atelier des Sols & Fils, dans Extrabat.",
  },
  {
    statut: "en-service",
    titre: "La fiche client, sans recopier",
    scene: "Nouveau client sur place : vous dictez son nom, sa commune et son besoin. La fiche est créée dans votre logiciel après votre « oui ».",
    detail: "Déjà en service, même chantier : 5 min à la main, 30 s à la voix.",
  },
  {
    statut: "a-etudier",
    titre: "La réponse, sans ouvrir trois logiciels",
    scene: "« On a vu M. Michel quand, la dernière fois ? » La date du rendez-vous et le compte rendu, retrouvés pour vous.",
    detail: "Lecture seule : rien n’est modifié dans vos outils.",
  },
] as const;

// Le parcours d'un projet. Durées et temps demandé : ceux publiés en V1 (tag v0.8), inchangés.
// `prix` pointe vers la clé de `prix` (site.ts) affichée quand elle est fournie.
export const etapes = [
  {
    nom: "Premier échange",
    texte: "Vous me décrivez la tâche qui vous prend du temps et les outils que vous utilisez. Je vous dis franchement si l’automatiser vaut la peine.",
    votreTemps: "le temps d’un appel",
    duree: null,
    recu: "un avis clair, même si la réponse est non",
    prix: "sans-engagement" as const,
  },
  {
    nom: "Atelier sur le terrain",
    texte: "Je viens voir comment vous travaillez, avec la personne qui fait la tâche. On repère ce qui se ressaisit et ce qui peut être préparé pour vous.",
    votreTemps: "une demi-journée avec vos équipes",
    duree: "2 jours",
    recu: "le déroulé de vos processus, et où ça coince",
    prix: "diagnostic" as const,
  },
  {
    nom: "Feuille de route",
    texte: "Je vous dis ce qui mérite d’être fait, avec le temps gagné, le coût et la faisabilité dans vos logiciels. Vous choisissez par quoi commencer, ou vous arrêtez là.",
    votreTemps: "1 heure pour en parler",
    duree: "1 semaine",
    recu: "une liste chiffrée, dans l’ordre où je la ferais",
    prix: "diagnostic" as const,
  },
  {
    nom: "Construction et mise en service",
    texte: "Je construis ce que vous avez choisi, branché sur vos outils actuels, puis je le mets entre les mains de vos équipes. Vous le voyez avancer chaque semaine.",
    votreTemps: "1 heure de point par semaine",
    duree: "4 semaines",
    recu: "une solution en service, avec son mode d’emploi",
    prix: "premiereAutomatisation" as const,
  },
];

// Qui décide quoi (V1, section Confiance). Vrai pour le cas livré : l'assistant prépare, le client écrit.
export const decide = {
  seul: ["lire les demandes qui arrivent", "chercher dans vos dossiers", "calculer un prix à partir de vos tarifs", "préparer le brouillon"],
  valide: ["envoyer un message à un client", "créer un devis dans votre logiciel", "modifier une fiche", "engager un prix"],
};
