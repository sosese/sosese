// Préfixe de publication (astro.config.mjs, `base`). Tous les liens internes passent par `lien()` :
// le jour où la V3 devient la racine, seul `base` change.
export const base = import.meta.env.BASE_URL.replace(/\/$/, "");
export const lien = (chemin = "/") => `${base}${chemin}`;

export const site = {
  name: "sosese",
  title: "sosese — Devis et fiches clients dictés sur le terrain, autour de Metz",
  description:
    "Dictez le devis sur le chantier, retrouvez-le prêt dans votre logiciel de gestion. Automatisations sur mesure pour indépendants, TPE et PME, à Metz et dans un rayon de 80 km.",
  url: "https://sosese.tech",
  email: "contact@sosese.tech",
  linkedin: "https://www.linkedin.com/in/joris-chamvoux-71881b84/" as string | null,
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

// ————————————————————————————————————————————————————————————————————————————————
// Valeurs qui dépendent d'une décision ou d'une information du porteur (décisions D1 à D9 du
// rapport RAPPORT-COPYWRITING-V1-V2-2026-09-23.md, §3.7). Règle dure : null = non fourni.
// Un bloc dont la valeur est null n'est PAS rendu en production ; en `npm run dev`, il affiche
// un marqueur « à compléter ». Jamais de valeur inventée, jamais de valeur « plausible ».
// ————————————————————————————————————————————————————————————————————————————————

export const personne = {
  nom: "Joris Chamvoux",
  // Chemin d'un portrait réel déposé dans public/ (ex. "/equipe/joris.webp"), dimensions ci-dessous.
  // Jamais de portrait généré (DESIGN.md, « Anti-patterns »).
  photo: null as Texte,
  photoLargeur: 480,
  photoHauteur: 600,
  // Une phrase de parcours vérifiable, cohérente avec LinkedIn. Ex. « Je viens de … ».
  parcours: null as Texte,
};

// Contact direct. Téléphone affiché tel quel (format lisible), lien tel: dérivé.
export const telephone = null as Texte;
// Délai de réponse que tu peux tenir à chaque fois, ex. « sous 48 h ouvrées ».
export const delaiReponse = null as Texte;

// Offre (D3, D4). Montants en texte, tels qu'ils doivent s'afficher (« 450 € HT »,
// « entre 2 000 et 5 000 € HT »). Tant qu'ils sont null, le site affiche le FORMAT du prix
// (devis ferme par étape, V1), jamais un montant.
export const prix = {
  diagnostic: null as Texte,
  premiereAutomatisation: null as Texte,
  fraisUsage: null as Texte, // ex. « environ 20 € par mois »
  // true = le prix du diagnostic est déduit si le projet suit. null = non décidé, rien n'est affiché.
  diagnosticDeduit: null as boolean | null,
};

// Cas client réel (DESIGN.md, « Cas client »). Nom de l'entreprise, prénom et lien vers
// son site : publiés avec son accord explicite. Ne rien ajouter ici sans le même accord.
export const casClient = {
  nom: "L'Atelier des Sols & Fils",
  metier: "pose de sols",
  prenom: "Jason",
  site: "https://www.atelier-sols-fils.com/",
  logo: "/clients/atelier-sols-fils.svg" as Texte, // relatif à public/, préfixé par lien()
  // Seul nom de logiciel tiers cité : il dit ce qui a été fait, pas ce que nous vendons.
  // Le nom seul, jamais le logo, aucune mention de partenariat.
  logiciel: "Extrabat" as Texte,
  // Rôle de Jason dans l'entreprise, à confirmer (la V1 disait « commercial », un commentaire
  // disait « dirigeant »). Tant que null, le site écrit seulement « Jason ».
  role: null as Texte,
  // Mois de mise en service, ex. « août 2026 ».
  miseEnService: null as Texte,
  // Protocole des durées : ex. « sur 12 devis de pose, en septembre 2026 ». Complète la phrase
  // « Durées relevées par L'Atelier des Sols & Fils … ».
  protocole: null as Texte,
  // Citation mot pour mot, 15 à 30 mots, avec accord écrit archivé HORS dépôt.
  citation: null as Texte,
};

export const zoneIntervention = "Metz et environ 80 km autour. À distance selon le projet.";

export const mainNav = [
  { label: "Accompagnement", href: lien("/accompagnement") },
  { label: "Réalisation", href: lien("/realisations/atelier-sols-fils") },
  { label: "À propos", href: lien("/a-propos") },
];

export const secondaryNav = [{ label: "Vous éditez un logiciel ?", href: lien("/editeurs") }];

export const legalNav = [
  { label: "Mentions légales", href: lien("/mentions-legales") },
  { label: "Confidentialité", href: lien("/confidentialite") },
];

export const cta = { label: "Décrire ma tâche", href: lien("/contact") };
// Contact par email uniquement pour l’instant (décision du 23/09/2026) : la page /contact porte un mailto pré-rempli.
// Sous chaque CTA principal. Complété par le délai de réponse quand il est fourni.
export const ctaRassurance = "Premier échange sans engagement, sur place autour de Metz ou à distance.";
