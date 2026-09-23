// Questions posées avant de commencer. Les réponses reprennent les engagements publiés en V1 (tag v0.8)
// et en V2 ; celles qui dépendent d'un prix utilisent `prix` (site.ts) et retombent sur le FORMAT du
// prix tant qu'aucun montant n'est fourni.
import { casClient, prix } from "./site";

export type Question = { q: string; a: string[] };

const montants = [
  prix.diagnostic && `L’atelier et la feuille de route : ${prix.diagnostic}${prix.diagnosticDeduit ? ", déduits du projet s’il se fait" : ""}.`,
  prix.premiereAutomatisation && `Une première automatisation : ${prix.premiereAutomatisation}${prix.fraisUsage ? `, plus des frais d’usage d’${prix.fraisUsage}` : ""}.`,
].filter(Boolean) as string[];

export const faqCout: Question = {
  q: "Combien ça coûte ?",
  a: montants.length
    ? [...montants, "Le montant exact de chaque étape est écrit dans un devis ferme, avant de commencer."]
    : [
        "Chaque étape a son devis ferme, signé avant de commencer : l’atelier et la feuille de route d’abord, puis chaque automatisation que vous choisissez, avec le temps gagné en face.",
        "Pas de régie, pas d’abonnement caché : les éventuels frais d’usage (service d’IA, hébergement) sont chiffrés à part dans la feuille de route.",
      ],
};

export const faqAccueil: Question[] = [
  {
    q: "Et si l’IA invente un prix ?",
    a: [
      "Elle ne calcule jamais un prix de son côté : elle lit vos tarifs et vos règles dans votre logiciel.",
      "Le montant vous est toujours montré avant d’être écrit. Tant que vous n’avez pas dit « oui », rien n’est créé dans votre logiciel de gestion.",
    ],
  },
  {
    q: "Faut-il changer de logiciel ?",
    a: [
      "Non. Je pars de ce que vous utilisez déjà : logiciel de gestion, messagerie, tableurs. Vos équipes continuent de s’en servir normalement.",
      `Chez ${casClient.nom}, c’est ${casClient.logiciel}. Votre logiciel n’est pas celui-là ? Si un outil ne permet aucune connexion, je vous le dis dès le premier échange, avant tout engagement.`,
    ],
  },
  faqCout,
  {
    q: "Combien de temps avant de voir un résultat ?",
    a: ["L’atelier a lieu sous 15 jours. Une fois la feuille de route validée, une automatisation est livrée en 4 semaines."],
  },
];

export const faqAccompagnement: Question[] = [
  faqCout,
  {
    q: "Et si ça ne marche pas ?",
    a: [
      "La faisabilité de chaque piste est vérifiée dans la feuille de route, avant toute construction.",
      "Pendant la construction, vous voyez la solution avancer chaque semaine, et vous pouvez arrêter à la fin de chaque étape.",
    ],
  },
  {
    q: "Qui détient les accès ?",
    a: [
      "Vous. Le code, les comptes et les accès sont à votre nom, et le mode d’emploi est livré avec.",
      "Pour chaque tâche, j’écris noir sur blanc quelles données sont consultées, où, et par quel service.",
    ],
  },
  {
    q: "Et si vous n’êtes plus disponible ?",
    a: [
      "Tout ce qui a été construit vous est remis : code, accès, documentation. Votre équipe, ou un autre prestataire, peut reprendre la main sans repartir de zéro.",
    ],
  },
  {
    q: "Faut-il des compétences techniques en interne ?",
    a: ["Non. Il faut surtout une personne qui connaît bien la tâche à automatiser et qui peut y consacrer un peu de temps pendant le projet."],
  },
];

export const faqJsonLd = (questions: Question[]) => ({
  "@type": "FAQPage",
  mainEntity: questions.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") } })),
});
