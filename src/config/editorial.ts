// Données reprises de la V1 et du cadrage du 21 septembre 2026.
// Les durées sont rapportées pour ce cas, sans protocole statistique fourni.
export const preuve = {
  periode: "Six premières semaines d’utilisation",
  date: "Chiffres communiqués le 19 septembre 2026",
  production: [
    { valeur: "+50", label: "devis créés" },
    { valeur: "+30", label: "rendez-vous posés" },
    { valeur: "+40", label: "fiches clients créées" },
    { valeur: "3", label: "rapports d’analyse annuels" },
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
export const besoins = [
  { n: "01", titre: "Arrêter de saisir deux fois", texte: "Une information reçue par email, puis recopiée dans votre logiciel : identifions les passages que l’on peut automatiser.", exemple: "Exemple : préparer une fiche client à partir d’une demande." },
  { n: "02", titre: "Préparer vos devis plus vite", texte: "Retrouver les bons articles, reprendre les tarifs, mettre en forme : votre logiciel peut recevoir un devis préparé à partir de vos indications.", exemple: "Déjà réalisé : des devis dictés sur chantier dans Extrabat." },
  { n: "03", titre: "Retrouver une information utile", texte: "Des données dispersées dans vos outils peuvent devenir une réponse exploitable, sans recommencer les mêmes recherches.", exemple: "Exemple : rassembler les éléments pour préparer un suivi d’activité." },
];
export const etapes = [
  { titre: "Choisir un problème précis", texte: "Nous regardons comment vous travaillez, avec quels outils et où le temps se perd.", livrable: "Un besoin prioritaire et un périmètre à vérifier." },
  { titre: "Vérifier avant de construire", texte: "Accès aux logiciels, qualité des données, actions à valider : nous examinons la faisabilité et les limites.", livrable: "Une proposition précisant livrables, budget et conditions." },
  { titre: "Tester avec votre façon de travailler", texte: "Une première version est confrontée à des situations réelles, puis ajustée avec les personnes qui l’utiliseront.", livrable: "Des critères d’acceptation vérifiés ensemble." },
  { titre: "Mettre en service et transmettre", texte: "La prise en main, les accès et le suivi sont définis avant la mise en service.", livrable: "Une solution documentée et un cadre de suivi explicite." },
];
