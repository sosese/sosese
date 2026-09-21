export const site = {
  name: "sosese",
  title: "sosese — IA sur-mesure pour PME, branchée sur vos outils",
  description:
    "On part de vos logiciels actuels : l'administratif en moins, vos données enfin utiles, et rien qui parte sans votre accord.",
  // À confirmer (§9) : adresse de contact et URL LinkedIn réelles.
  email: "contact@sosese.tech",
  linkedin: null as string | null,
};

// Contenus bloquants du §9 : null = non fourni. Rendu en marqueur « à compléter », jamais inventé.
type Texte = string | null;

export const legal = {
  raisonSociale: null as Texte,
  formeJuridique: null as Texte,
  capital: null as Texte,
  adresse: null as Texte,
  siret: null as Texte,
  rcs: null as Texte,
  tvaIntracom: null as Texte,
  directeurPublication: null as Texte,
  hebergeur: {
    nom: null as Texte,
    adresse: null as Texte,
    telephone: null as Texte,
  },
  prestataireEmail: {
    nom: "Hostinger" as Texte,
    localisation: null as Texte,
  },
  // À VALIDER : durée recommandée par la CNIL pour des prospects (3 ans après le dernier contact).
  dureeConservation: "3 ans à compter du dernier échange",
  // Journal d'accès Traefik (/var/log/traefik/access.log sur le VPS : IP, date, chemin, statut),
  // lu par CrowdSec. Durée = rotation logrotate hebdomadaire × 26 sur le VPS : les deux doivent rester alignées.
  dureeJournauxTechniques: "6 mois" as Texte,
  miseAJour: "15 septembre 2026",
};

export const personne = null as null | {
  nom: string;
  role: string;
  bio: string[];
  photo: string;
};

// Cas client réel (DESIGN.md, « Cas client »). Nom de l'entreprise, prénom du dirigeant et lien vers
// son site : publiés avec son accord explicite. Ne rien ajouter ici sans le même accord.
// `logo` : chemin d'un fichier déposé dans `public/`. Tant que le fichier n'est pas là, la section
// n'affiche que le nom — jamais d'image cassée, jamais de logo reconstitué.
export const casClient = {
  nom: "L'Atelier des Sols & Fils",
  metier: "pose de sols",
  prenom: "Jason",
  site: "https://www.atelier-sols-fils.com/",
  logo: "/clients/atelier-sols-fils.svg" as Texte,
  // Le logiciel de gestion sur lequel le connecteur a été construit. Seul nom de logiciel tiers cité
  // sur le site : il dit ce qui a été fait, pas ce que nous vendons (DESIGN.md, « Cas client »).
  // Le nom seul, jamais le logo, et aucune mention de partenariat.
  logiciel: "Extrabat" as Texte,
};

export const zoneIntervention = null as Texte;

export const mainNav = [
  { label: "Méthode", href: "/#methode" },
  { label: "Offre", href: "/#offre" },
  // L'ancre reste `#cas-client` : elle est publiée depuis la v1, le libellé seul change.
  { label: "Clients", href: "/#cas-client" },
  { label: "À propos", href: "/a-propos" },
];

export const legalNav = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
];

export const cta = { label: "Parlons-en", href: "/contact" };
