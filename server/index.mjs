import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { constants as zlib } from "node:zlib";
import Fastify, { LogController } from "fastify";
import compress from "@fastify/compress";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import nodemailer from "nodemailer";
import { z } from "zod";
import regles from "../shared/contact.json" with { type: "json" };

const env = process.env;
const PROD = env.NODE_ENV === "production";
const DIST = fileURLToPath(new URL("../dist/", import.meta.url));

// Inventaire du build : routes « /page/ » servies sans slash final, et empreintes des scripts inline pour la CSP.
const htmlFiles = readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith(".html")).map((f) => join(DIST, f));
const routes = new Set(
  htmlFiles.filter((f) => f.endsWith(`${sep}index.html`)).map((f) => `/${relative(DIST, f).split(sep).slice(0, -1).join("/")}`),
);
const scriptHashes = new Set();
for (const file of htmlFiles) {
  for (const [, attrs, body] of readFileSync(file, "utf8").matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=|application\/ld\+json/.test(attrs) || !body.trim()) continue;
    scriptHashes.add(`'sha256-${createHash("sha256").update(body).digest("base64")}'`);
  }
}

const app = Fastify({
  logger: { level: env.LOG_LEVEL ?? "info" },
  // Les journaux ne contiennent ni IP ni URL par requête (cf. politique de confidentialité).
  logController: new LogController({ disableRequestLogging: true }),
  // Un seul proxy de confiance (Traefik) : l'IP retenue est celle qu'il a vue, pas un X-Forwarded-For fourni par le client.
  trustProxy: 1,
  bodyLimit: 16 * 1024,
  rewriteUrl: (req) => {
    const [path, query] = req.url.split("?");
    return path !== "/" && routes.has(path) ? `${path}/${query === undefined ? "" : `?${query}`}` : req.url;
  },
});

const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", ...scriptHashes],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", "data:"],
  fontSrc: ["'self'"],
  connectSrc: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  baseUri: ["'self'"],
  objectSrc: ["'none'"],
  ...(PROD ? {} : { upgradeInsecureRequests: null }),
};
await app.register(helmet, {
  contentSecurityPolicy: { directives: cspDirectives },
  strictTransportSecurity: PROD ? { maxAge: 31536000, includeSubDomains: true } : false,
});

// Compression faite ici : ne pas l'activer aussi dans Traefik (§7.8).
await app.register(compress, { encodings: ["br", "gzip"], brotliOptions: { params: { [zlib.BROTLI_PARAM_QUALITY]: 5 } } });

await app.register(rateLimit, {
  global: false,
  errorResponseBuilder: (_req, ctx) => ({ statusCode: 429, ok: false, erreur: "trop_de_requetes", reessayer: ctx.after }),
});

await app.register(fastifyStatic, {
  root: DIST,
  redirect: false,
  cacheControl: false,
  setHeaders(res, path) {
    if (path.includes(`${sep}_astro${sep}`)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    else if (path.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
    else res.setHeader("Cache-Control", "public, max-age=604800");
  },
});

app.setNotFoundHandler((req, reply) => {
  if (req.url.startsWith("/api/")) return reply.code(404).send({ ok: false, erreur: "introuvable" });
  return reply.code(404).header("Cache-Control", "no-cache").sendFile("404.html");
});

app.get("/api/health", async () => ({ ok: true }));

const L = regles.limites;
const ligne = (max) => z.string().trim().min(1).max(max).regex(/^[^\r\n]*$/);
const contactSchema = z.object({
  nom: ligne(L.nom),
  societe: ligne(L.societe),
  email: z.string().trim().max(L.email).regex(new RegExp(regles.emailRegex)),
  telephone: z.string().trim().max(L.telephone).refine((v) => v === "" || new RegExp(regles.telephoneRegex).test(v)).default(""),
  secteur: z.enum(regles.secteurs),
  irritants: z.string().max(500).refine((v) => v === "" || v.split(", ").every((i) => regles.irritants.includes(i))).default(""),
  message: z.string().trim().max(L.message).default(""),
  consentement: z.literal(true),
  [regles.champPiege]: z.string().max(500).default(""),
  dureeRemplissage: z.number().int().nonnegative(),
});

const smtpManquants = ["SMTP_HOST", "SMTP_PORT", "MAIL_TO", "MAIL_FROM"].filter((k) => !env[k]);
const smtpPort = Number(env.SMTP_PORT);
const transport = smtpManquants.length
  ? null
  : nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: smtpPort === 587,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
if (!transport) {
  app.log.warn(`SMTP non configuré (${smtpManquants.join(", ")}) : POST /api/contact répondra 503.`);
} else {
  // Diagnostic au démarrage, sans jamais journaliser le mot de passe.
  const adresseSuspecte = (a) => !new RegExp(regles.emailRegex).test(a) || /\.$|\s/.test(a);
  for (const cle of ["MAIL_TO", "MAIL_FROM"]) {
    if (adresseSuspecte(env[cle])) app.log.warn(`${cle} ne ressemble pas à une adresse valide : "${env[cle]}"`);
  }
  if (env.SMTP_USER && env.MAIL_FROM !== env.SMTP_USER) {
    app.log.warn("MAIL_FROM diffère de SMTP_USER : la plupart des hébergeurs refusent ou déclassent ces envois.");
  }
  app.log.info(
    { hote: env.SMTP_HOST, port: smtpPort, tls: smtpPort === 465 ? "implicite" : smtpPort === 587 ? "STARTTLS" : "aucun", authentification: Boolean(env.SMTP_USER) },
    "SMTP configuré",
  );
  transport.verify().then(
    () => app.log.info("SMTP : connexion et authentification vérifiées"),
    (err) => app.log.error({ code: err.code, reponse: err.responseCode, detail: err.response }, "SMTP : vérification échouée"),
  );
}

app.post("/api/contact", { config: { rateLimit: { max: 5, timeWindow: "10 minutes" } } }, async (req, reply) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const champs = [...new Set(parsed.error.issues.map((issue) => String(issue.path[0] ?? "corps")))];
    return reply.code(400).send({ ok: false, erreur: "validation", champs });
  }
  const d = parsed.data;

  // Robot probable : on répond comme un succès pour ne rien lui apprendre, sans envoyer.
  if (d[regles.champPiege] || d.dureeRemplissage < regles.dureeMinimaleMs) {
    const motif = d[regles.champPiege] ? "champ piège rempli" : `formulaire rempli en ${d.dureeRemplissage} ms`;
    req.log.warn({ motif }, "contact : demande ignorée (anti-spam), aucun email envoyé");
    return { ok: true };
  }
  if (!transport) return reply.code(503).send({ ok: false, erreur: "indisponible" });

  try {
    const info = await transport.sendMail({
      from: env.MAIL_FROM,
      to: env.MAIL_TO,
      replyTo: { name: d.nom, address: d.email },
      subject: `Demande de contact — ${d.societe}`,
      text: [
        `Nom : ${d.nom}`,
        `Société : ${d.societe}`,
        `Email : ${d.email}`,
        `Téléphone : ${d.telephone || "—"}`,
        `Secteur : ${d.secteur}`,
        `Où ils perdent du temps : ${d.irritants || "—"}`,
        "",
        d.message || "(pas de message)",
      ].join("\n"),
    });
    // « Accepté » = pris en charge par le serveur SMTP, pas encore distribué : un rejet ultérieur revient en bounce sur MAIL_FROM.
    req.log.info(
      { reponse: info.response, messageId: info.messageId, acceptes: info.accepted.length, refuses: info.rejected.length },
      "contact : email accepté par le serveur SMTP",
    );
    return { ok: true };
  } catch (err) {
    req.log.error({ code: err.code, reponse: err.responseCode, detail: err.response }, "contact : échec de l'envoi SMTP");
    return reply.code(502).send({ ok: false, erreur: "envoi" });
  }
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.once(signal, async () => {
    await app.close();
    process.exit(0);
  });
}

await app.listen({ port: Number(env.PORT ?? 3000), host: env.HOST ?? "0.0.0.0" });
