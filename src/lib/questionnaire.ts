// Questionnaire de découverte : source unique dans shared/questionnaire.json, lue aussi par server/questionnaire.mjs.
// Email, téléphone et champ piège reprennent les règles du formulaire de contact (shared/contact.json).
import regles from "../../shared/questionnaire.json";
import contact from "../../shared/contact.json";

export type TypeQuestion = "texte" | "paragraphe" | "nombre" | "choix" | "multi" | "email" | "tel";

export type Question = {
  id: string;
  type: TypeQuestion;
  label: string;
  aide?: string;
  unite?: string;
  options?: string[];
  autocomplete?: string;
};

type QuestionSource = Omit<Question, "options"> & { options?: string[]; optionsDe?: "secteurs" | "irritants" };

export type Section = { titre: string; chapeau: string; questions: Question[] };

export const QUESTIONNAIRE_ENDPOINT = regles.endpoint;
export const TITRE = regles.titre;
// `optionsDe` : options reprises de shared/contact.json (secteurs, irritants), pour croiser les deux sources.
export const SECTIONS: Section[] = (regles.sections as { titre: string; chapeau: string; questions: QuestionSource[] }[]).map((s) => ({
  ...s,
  questions: s.questions.map(({ optionsDe, ...q }) => ({ ...q, options: q.options ?? (optionsDe ? contact[optionsDe] : undefined) })),
}));
export const LIMITES = { ...regles.limites, email: contact.limites.email, telephone: contact.limites.telephone };
export const HONEYPOT_FIELD = contact.champPiege;
export const EMAIL_RE = new RegExp(contact.emailRegex);
export const PHONE_RE = new RegExp(contact.telephoneRegex);
export const NOMBRE_RE = new RegExp(regles.nombreRegex);

export type Reponses = Record<string, string | string[]>;

export type QuestionnairePayload = {
  reponses: Reponses;
  consentement: true;
  // Anti-spam : champ piège (doit rester vide) et durée de remplissage en ms.
  site_web: string;
  dureeRemplissage: number;
};
