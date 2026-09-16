// Scénarios du mockup du hero (DicteeMobile). Cinq tâches très différentes, jouées à la suite en
// boucle : le visiteur reste pour voir si son métier — et son besoin — passent.
//
// Ce que la séquence doit démontrer, dans cet ordre de priorité :
// 1. le connecteur est polyvalent : devis, fiche client, relance, rendez-vous, question de gestion ;
// 2. il se nourrit toujours de règles DÉJÀ présentes dans les logiciels de l'entreprise — d'où le
//    champ `source` sur chaque règle, affiché à côté d'elle ;
// 3. la sortie n'est pas qu'un texte : elle prend la forme du besoin (tableau, fiche, message,
//    agenda, classement) et elle se termine par une ACTION réellement faite ;
// 4. l'action n'a lieu qu'après accord (`porte`), sauf en lecture seule — voir le scénario 5.
//
// Règles dures :
// - Scénarios INVENTÉS, légendés comme tels dans le composant. Aucune ligne, aucun montant, aucun
//   nom de client ne vient d'une pièce réelle ni d'un outil connecté (DESIGN.md, piège 17).
// - Les règles métier restent GÉNÉRIQUES : on nomme la nature de la règle (« vos taux de TVA »),
//   jamais sa valeur. Aucun taux affiché. Passer à des valeurs exactes = décision humaine.
// - Les sources sont des CATÉGORIES d'outils (catalogue, CRM, agenda, gestion, compta, boîte mail),
//   jamais une marque : pas de logo ni de nom de logiciel tiers sur une page publique.
// - Garder les scénarios de masse comparable : entrée de 13 à 16 mots, 4 règles, 3 à 4 éléments de
//   sortie. Les scènes sont empilées dans une même cellule de grille, donc la hauteur du bloc est
//   celle du plus grand — un scénario bavard creuse un trou sous tous les autres.
// - Nom de règle : 22 caractères au plus. Au-delà, il passe à la ligne à côté de sa source sur un
//   écran de 360 px et le connecteur double de hauteur.

export type Regle = { regle: string; source: string };

export type Sortie =
  | { forme: "lignes"; titre: string; items: { label: string; valeur: string }[]; total?: { label: string; valeur: string } }
  | { forme: "message"; titre: string; objet: string; corps: string[] }
  | { forme: "agenda"; titre: string; jour: string; debut: number; fin: number; creneau: { de: number; a: number }; label: string }
  | { forme: "barres"; titre: string; items: { label: string; valeur: string; part: number }[] };

export type Scenario = {
  contexte: string;
  metier: string;
  entree: { type: "voix" | "email" | "declencheur"; libelle: string; texte: string; cite: boolean };
  regles: Regle[];
  sortie: Sortie;
  porte?: string;
  action: string;
};

export const scenarios: Scenario[] = [
  {
    contexte: "sur le chantier",
    metier: "paysagiste",
    entree: {
      type: "voix",
      libelle: "dicté",
      texte: "120 m² de gazon en plaques, 30 mètres de bordures béton, évacuation des déblais.",
      cite: true,
    },
    regles: [
      { regle: "vos tarifs de pose", source: "catalogue" },
      { regle: "vos temps par m²", source: "historique" },
      { regle: "vos remises client", source: "CRM" },
      { regle: "vos taux de TVA", source: "gestion" },
    ],
    sortie: {
      forme: "lignes",
      titre: "Devis préparé",
      items: [
        { label: "Gazon en plaques, 120 m²", valeur: "1 440,00 €" },
        { label: "Bordures béton, 30 ml", valeur: "450,00 €" },
        { label: "Évacuation des déblais", valeur: "180,00 €" },
      ],
      total: { label: "Total TTC", valeur: "2 484,00 €" },
    },
    porte: "Je crée le devis ?",
    action: "devis créé dans votre logiciel de gestion",
  },
  {
    contexte: "au bureau",
    metier: "maçonnerie",
    entree: {
      type: "email",
      libelle: "reçu par email",
      texte: "Bonjour, nous cherchons un maçon pour une terrasse de 40 m² à Bègles. SARL Delmas.",
      cite: true,
    },
    regles: [
      { regle: "vos champs requis", source: "CRM" },
      { regle: "vos doublons connus", source: "CRM" },
      { regle: "vos zones desservies", source: "gestion" },
      { regle: "votre nomenclature", source: "CRM" },
    ],
    sortie: {
      forme: "lignes",
      titre: "Fiche client à valider",
      items: [
        { label: "Société", valeur: "SARL Delmas" },
        { label: "Besoin", valeur: "terrasse 40 m²" },
        { label: "Secteur", valeur: "Bègles — zone 2" },
        { label: "Origine", valeur: "email du site" },
      ],
    },
    porte: "Je crée la fiche ?",
    action: "fiche créée dans votre CRM, sans doublon",
  },
  {
    contexte: "au bureau",
    metier: "pose de sols",
    entree: {
      type: "declencheur",
      libelle: "repéré ce matin",
      texte: "Facture 2026-118 échue depuis 12 jours. Client habituel, aucun litige en cours.",
      cite: false,
    },
    regles: [
      { regle: "vos délais de paiement", source: "gestion" },
      { regle: "l'historique du client", source: "compta" },
      { regle: "votre ton habituel", source: "boîte mail" },
      { regle: "votre lien de paiement", source: "gestion" },
    ],
    sortie: {
      forme: "message",
      titre: "Relance préparée",
      objet: "Votre facture 2026-118",
      corps: [
        "Bonjour, sauf erreur de notre part, cette facture reste ouverte.",
        "Je vous remets le lien de règlement. Bonne journée.",
      ],
    },
    porte: "J'envoie la relance ?",
    action: "email envoyé depuis votre boîte, suivi programmé",
  },
  {
    contexte: "en déplacement",
    metier: "menuiserie",
    entree: {
      type: "voix",
      libelle: "dicté",
      texte: "Cale la prise de cotes chez Rivière jeudi matin, deux heures, avec Karim.",
      cite: true,
    },
    regles: [
      { regle: "vos disponibilités", source: "agenda" },
      { regle: "vos temps de trajet", source: "agenda" },
      { regle: "les équipes en poste", source: "planning" },
      { regle: "vos horaires d'atelier", source: "gestion" },
    ],
    sortie: {
      forme: "agenda",
      titre: "Créneau trouvé",
      jour: "jeudi",
      debut: 7,
      fin: 19,
      creneau: { de: 8, a: 10 },
      label: "prise de cotes · Karim",
    },
    porte: "Je pose le rendez-vous ?",
    action: "rendez-vous posé, client prévenu",
  },
  {
    contexte: "au bureau",
    metier: "gérance",
    entree: {
      type: "voix",
      libelle: "demandé",
      texte: "Donne-moi les articles les plus vendus ce trimestre.",
      cite: true,
    },
    regles: [
      { regle: "vos ventes", source: "gestion" },
      { regle: "vos familles produits", source: "catalogue" },
      { regle: "vos marges par article", source: "compta" },
      { regle: "votre exercice", source: "gestion" },
    ],
    sortie: {
      forme: "barres",
      titre: "Top ventes du trimestre",
      items: [
        { label: "Parquet chêne", valeur: "42", part: 100 },
        { label: "Plinthes MDF", valeur: "31", part: 74 },
        { label: "Sous-couche", valeur: "18", part: 43 },
        { label: "Colle parquet", valeur: "12", part: 29 },
      ],
    },
    // Pas de porte : lire ne demande aucun accord. C'est l'autre moitié de la promesse.
    action: "lecture seule — rien n'a été modifié",
  },
];
