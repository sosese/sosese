export const site = {
  name: "sosese",
  // Titre et description par défaut (accueil) : en « je », sans jargon (2026-10-08, DESIGN.md « Copy »).
  // Le titre dit ce que je fais et pour qui : le h1 du hero ne dit rien seul dans un onglet.
  title: "Un assistant sur mesure pour artisans, indépendants et petites entreprises | sosese",
  description:
    "Je suis Joris : je relie un assistant aux logiciels que vous avez déjà. Il prépare le travail, vous validez. Pour artisans, indépendants et petites entreprises.",
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
  miseAJour: "7 octobre 2026",
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
  // Non fourni dans le formulaire de satisfaction : `null`, la signature dit « Jason » seul. Jamais inventé.
  nomFamille: null as Texte,
  // Son rôle, tel qu'il l'a donné dans le formulaire de satisfaction.
  role: "commercial et gestionnaire",
  site: "https://www.atelier-sols-fils.com/",
  logo: "/clients/atelier-sols-fils.svg" as Texte,
  // Le logiciel de gestion sur lequel le connecteur a été construit. Seul nom de logiciel tiers cité
  // sur le site : il dit ce qui a été fait, pas ce que je vends (DESIGN.md, « Cas client »).
  // Le nom seul, jamais le logo, et aucune mention de partenariat.
  logiciel: "Extrabat" as Texte,
};

// Fournie par l'humain le 2026-10-08.
export const zoneIntervention = "Je suis basé à Metz, mais j'interviens partout en France et en Europe." as Texte;

export const mainNav = [
  // Dans l'ordre de la page. L'ancre reste `#cas-client` : elle est publiée depuis la v1, le libellé seul change.
  { label: "Clients", href: "/#cas-client" },
  { label: "Méthode", href: "/#methode" },
  { label: "Offre", href: "/#offre" },
  { label: "À propos", href: "/a-propos" },
];

export const legalNav = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
];

export const cta = { label: "Parlons-en", href: "/contact" };
