// Contact des variantes : un lien email pré-rempli, comme la page contact de la V3 (pas de formulaire).
import { site } from "../../src/config/site";

export const mailto = (sujet: string, lignes: string[]) =>
  `mailto:${site.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(lignes.join("\n"))}`;

export const mailTache = mailto("Une tâche à simplifier", [
  "Bonjour,",
  "",
  "La tâche qui me prend le plus de temps :",
  "",
  "",
  "Le logiciel de gestion que j’utilise :",
  "",
  "Mon entreprise et mon métier :",
  "",
  "Comment j’ai connu sosese :",
  "",
  "Le meilleur moyen de me joindre (email ou téléphone) :",
  "",
]);

export const mailEditeur = mailto("Intégration à un logiciel métier", [
  "Bonjour,",
  "",
  "Notre logiciel :",
  "",
  "L’usage de nos clients que nous aimerions explorer :",
  "",
  "Les accès disponibles (API, documentation, environnement de test) :",
  "",
]);
