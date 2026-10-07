import { z } from "zod";
import contact from "../shared/contact.json" with { type: "json" };
import regles from "../shared/questionnaire.json" with { type: "json" };

const L = regles.limites;
const EMAIL_RE = new RegExp(contact.emailRegex);
const PHONE_RE = new RegExp(contact.telephoneRegex);
const NOMBRE_RE = new RegExp(regles.nombreRegex);
const uneLigne = /^[^\r\n]*$/;

// Toutes les questions sont facultatives : une réponse absente vaut "" (ou [] pour les choix multiples).
const schemaQuestion = (q) => {
  switch (q.type) {
    case "texte":
      return z.string().trim().max(L.texte).regex(uneLigne).default("");
    case "paragraphe":
      return z.string().trim().max(L.paragraphe).default("");
    case "nombre":
      return z.string().trim().regex(NOMBRE_RE).default("");
    case "email":
      return z.string().trim().max(contact.limites.email).refine((v) => v === "" || EMAIL_RE.test(v)).default("");
    case "tel":
      return z.string().trim().max(contact.limites.telephone).refine((v) => v === "" || PHONE_RE.test(v)).default("");
    case "choix":
      return z.union([z.literal(""), z.enum(q.options)]).default("");
    case "multi":
      return z.array(z.enum(q.options)).max(q.options.length).default([]);
    default:
      throw new Error(`questionnaire.json : type de question inconnu « ${q.type} » (${q.id})`);
  }
};

// `optionsDe` : options reprises de shared/contact.json (secteurs, irritants), comme côté front.
for (const s of regles.sections) for (const q of s.questions) if (q.optionsDe) q.options = contact[q.optionsDe];
const questions = regles.sections.flatMap((s) => s.questions);
const schema = z.object({
  reponses: z.strictObject(Object.fromEntries(questions.map((q) => [q.id, schemaQuestion(q)]))),
  consentement: z.literal(true),
  [contact.champPiege]: z.string().max(500).default(""),
  dureeRemplissage: z.number().int().nonnegative(),
});

const valeurLisible = (q, v) => {
  if (Array.isArray(v)) return v.join(", ");
  return q.unite && v ? `${v} ${q.unite}` : v;
};

function corpsTexte(reponses) {
  const lignes = [];
  for (const section of regles.sections) {
    lignes.push(`== ${section.titre} ==`);
    for (const q of section.questions) {
      const v = valeurLisible(q, reponses[q.id]);
      lignes.push(`- ${q.label}`, `  ${(v || "—").replace(/\n/g, "\n  ")}`);
    }
    lignes.push("");
  }
  return lignes.join("\n");
}

export function routeQuestionnaire(app, { transport, env }) {
  app.post(
    regles.endpoint,
    // Un questionnaire complet dépasse la limite de 16 ko du formulaire de contact (sept champs de 3 000 caractères).
    { bodyLimit: 64 * 1024, config: { rateLimit: { max: 5, timeWindow: "10 minutes" } } },
    async (req, reply) => {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        const champs = [...new Set(parsed.error.issues.map((i) => i.path.filter((p) => p !== "reponses").map(String)[0] ?? "corps"))];
        return reply.code(400).send({ ok: false, erreur: "validation", champs });
      }
      const d = parsed.data;
      const r = d.reponses;

      // Robot probable : on répond comme un succès pour ne rien lui apprendre, sans envoyer.
      if (d[contact.champPiege] || d.dureeRemplissage < regles.dureeMinimaleMs) {
        const motif = d[contact.champPiege] ? "champ piège rempli" : `questionnaire rempli en ${d.dureeRemplissage} ms`;
        req.log.warn({ motif }, "questionnaire : envoi ignoré (anti-spam), aucun email envoyé");
        return { ok: true };
      }
      if (!transport) return reply.code(503).send({ ok: false, erreur: "indisponible" });

      const qui = [r.prenom, r.entreprise].filter(Boolean).join(" — ") || "anonyme";
      const date = new Date().toISOString();
      try {
        const info = await transport.sendMail({
          from: env.MAIL_FROM,
          to: env.MAIL_TO,
          replyTo: r.email ? { name: r.prenom || r.email, address: r.email } : undefined,
          subject: `Questionnaire — ${qui}`,
          text: `${regles.titre}\nReçu le ${date}\n\n${corpsTexte(r)}`,
          // Les mêmes réponses en JSON, pour les regrouper ensuite dans un tableur.
          attachments: [
            {
              filename: `questionnaire-${date.slice(0, 19).replace(/[:T]/g, "-")}.json`,
              contentType: "application/json",
              content: JSON.stringify({ recu: date, reponses: r }, null, 2),
            },
          ],
        });
        req.log.info(
          { reponse: info.response, messageId: info.messageId, acceptes: info.accepted.length, refuses: info.rejected.length },
          "questionnaire : email accepté par le serveur SMTP",
        );
      } catch (err) {
        req.log.error({ code: err.code, reponse: err.responseCode, detail: err.response }, "questionnaire : échec de l'envoi SMTP");
        return reply.code(502).send({ ok: false, erreur: "envoi" });
      }

      // Accusé de réception : texte fixe, rien de saisi n'y est recopié (l'adresse n'est pas vérifiée, le
      // formulaire ne doit pas pouvoir servir à envoyer un contenu choisi par un tiers). Son échec n'annule rien.
      let accuse = false;
      if (r.email) {
        try {
          await transport.sendMail({ from: env.MAIL_FROM, to: r.email, subject: regles.accuse.sujet, text: regles.accuse.texte.join("\n") });
          accuse = true;
          req.log.info("questionnaire : accusé de réception accepté par le serveur SMTP");
        } catch (err) {
          req.log.error({ code: err.code, reponse: err.responseCode }, "questionnaire : échec de l'accusé de réception");
        }
      }
      return { ok: true, accuse };
    },
  );
}
