// Scénarios du mockup du hero (DicteeMobile). Quatre métiers joués à la suite, en boucle :
// le visiteur reste pour voir si le sien passe.
//
// Règles dures :
// - Scénarios INVENTÉS, légendés comme tels dans le composant. Aucune ligne, aucun montant ne vient
//   d'une pièce commerciale réelle ni d'un outil connecté (DESIGN.md, piège 17).
// - Les règles métier restent GÉNÉRIQUES : on nomme la nature de la règle (« vos taux de TVA »),
//   jamais sa valeur. Un taux faux sur un site qui vend de l'automatisation de devis coûterait
//   plus cher que tout ce que la démo rapporte. Passer à des valeurs exactes = décision humaine.
// - Aucun taux n'est affiché : seul un « Total TTC » plausible apparaît.
// - Garder les quatre scénarios de longueur comparable : même nombre de lignes, dictée de
//   longueur voisine. Les scènes sont empilées dans une même cellule de grille, donc la hauteur du
//   bloc est celle du plus grand — un scénario bavard creuserait un trou sous les trois autres.

export type Scenario = {
  metier: string;
  dictee: string;
  regles: string[];
  lignes: { designation: string; quantite: string; total: string }[];
  totalTtc: string;
};

export const scenarios: Scenario[] = [
  {
    metier: "paysagiste",
    dictee: "120 m² de gazon en plaques, 30 mètres de bordures béton, évacuation des déblais.",
    regles: ["votre catalogue végétaux", "vos temps de pose", "vos forfaits d'évacuation", "vos taux de TVA"],
    lignes: [
      { designation: "Gazon en plaques", quantite: "120 m²", total: "1 440,00 €" },
      { designation: "Bordures béton", quantite: "30 ml", total: "450,00 €" },
      { designation: "Évacuation des déblais", quantite: "forfait", total: "180,00 €" },
    ],
    totalTtc: "2 484,00 €",
  },
  {
    metier: "maçonnerie",
    dictee: "45 m² de dalle béton en 15 centimètres, ferraillage compris, avec pompe à béton.",
    regles: ["vos prix matériaux", "vos locations de matériel", "vos minimums de facturation", "vos taux de TVA"],
    lignes: [
      { designation: "Dalle béton 15 cm", quantite: "45 m²", total: "4 275,00 €" },
      { designation: "Ferraillage", quantite: "45 m²", total: "810,00 €" },
      { designation: "Pompe à béton", quantite: "1 journée", total: "450,00 €" },
    ],
    totalTtc: "6 642,00 €",
  },
  {
    metier: "pose de sols",
    dictee: "25 m² de parquet chêne collé, 12 mètres de plinthes, ponçage et vitrification.",
    regles: ["votre catalogue fournisseur", "vos temps de pose", "vos marges par poste", "vos taux de TVA"],
    lignes: [
      { designation: "Parquet chêne posé", quantite: "25 m²", total: "2 250,00 €" },
      { designation: "Plinthes posées", quantite: "12 ml", total: "96,00 €" },
      { designation: "Ponçage, vitrification", quantite: "25 m²", total: "350,00 €" },
    ],
    totalTtc: "2 965,60 €",
  },
  {
    metier: "menuiserie",
    dictee: "4 fenêtres PVC 120 par 100 en rénovation, dépose et évacuation comprises.",
    regles: ["votre catalogue fournisseur", "vos forfaits de dépose", "vos marges par poste", "vos taux de TVA"],
    lignes: [
      { designation: "Fenêtre PVC 120 × 100", quantite: "4 u", total: "2 480,00 €" },
      { designation: "Dépose ancienne menuiserie", quantite: "4 u", total: "360,00 €" },
      { designation: "Évacuation", quantite: "forfait", total: "120,00 €" },
    ],
    totalTtc: "3 122,80 €",
  },
];
