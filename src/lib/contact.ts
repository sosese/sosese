// Règles du formulaire : source unique dans shared/contact.json, lue aussi par server/index.mjs.
import regles from "../../shared/contact.json";

export const CONTACT_ENDPOINT = regles.endpoint;
export const SECTEURS = regles.secteurs;
export const IRRITANTS = regles.irritants;
export const LIMITES = regles.limites;
export const HONEYPOT_FIELD = regles.champPiege;
export const EMAIL_RE = new RegExp(regles.emailRegex);
export const PHONE_RE = new RegExp(regles.telephoneRegex);

export type ContactPayload = {
  nom: string;
  societe: string;
  email: string;
  telephone: string;
  secteur: string;
  // Puces multi-sélection concaténées par « , » (§5.2).
  irritants: string;
  message: string;
  consentement: true;
  // Anti-spam : champ piège (doit rester vide) et durée de remplissage en ms.
  site_web: string;
  dureeRemplissage: number;
};
