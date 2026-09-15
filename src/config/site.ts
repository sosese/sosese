export const site = {
  name: "sosese",
  title: "sosese — automatisations et IA sur-mesure pour PME",
  description:
    "Studio IA : on identifie vos tâches répétitives, on priorise, on construit des automatisations intégrées à vos outils existants.",
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

export const zoneIntervention = null as Texte;

export const mainNav = [
  { label: "Méthode", href: "/#methode" },
  { label: "Offre", href: "/#offre" },
  { label: "Cas client", href: "/#cas-client" },
  { label: "À propos", href: "/a-propos" },
];

export const legalNav = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
];

export const cta = { label: "Parlons-en", href: "/contact" };
