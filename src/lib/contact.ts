// Contrat du formulaire de contact, partagé avec POST /api/contact (Lot 3 : le schéma zod devra reprendre ces règles).

export const CONTACT_ENDPOINT = "/api/contact";

export const SECTEURS = [
  "Industrie",
  "BTP",
  "Commerce et distribution",
  "Services aux entreprises",
  "Santé et médico-social",
  "Transport et logistique",
  "Autre",
] as const;

export const IRRITANTS = [
  "Devis et commandes",
  "Facturation et relances",
  "SAV et support client",
  "Saisie en double",
  "Emails et documents",
  "Reporting",
  "Recrutement et RH",
  "Autre",
] as const;

export const LIMITES = {
  nom: 100,
  societe: 120,
  email: 200,
  telephone: 30,
  message: 2000,
} as const;

export const HONEYPOT_FIELD = "site_web";

export type ContactPayload = {
  nom: string;
  societe: string;
  email: string;
  telephone: string;
  secteur: (typeof SECTEURS)[number];
  // Puces multi-sélection concaténées (§5.2).
  irritants: string;
  message: string;
  consentement: true;
  // Anti-spam : champ piège (doit rester vide) et durée de remplissage en ms (le serveur refuse < 3 s).
  [HONEYPOT_FIELD]: string;
  dureeRemplissage: number;
};
