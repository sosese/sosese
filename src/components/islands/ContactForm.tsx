import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  CONTACT_ENDPOINT,
  EMAIL_RE,
  HONEYPOT_FIELD,
  IRRITANTS,
  LIMITES,
  PHONE_RE,
  SECTEURS,
  type ContactPayload,
} from "../../lib/contact";

type Status = "idle" | "sending" | "success" | "error";
type FieldName = "nom" | "societe" | "email" | "telephone" | "secteur" | "message" | "consentement";
type Errors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ["nom", "societe", "email", "telephone", "secteur", "message", "consentement"];

function validate(data: FormData): Errors {
  const get = (key: string) => String(data.get(key) ?? "").trim();
  const errors: Errors = {};

  if (!get("nom")) errors.nom = "Indiquez votre nom.";
  else if (get("nom").length > LIMITES.nom) errors.nom = `${LIMITES.nom} caractères maximum.`;

  if (!get("societe")) errors.societe = "Indiquez le nom de votre société.";
  else if (get("societe").length > LIMITES.societe) errors.societe = `${LIMITES.societe} caractères maximum.`;

  if (!get("email")) errors.email = "Indiquez votre adresse email.";
  else if (!EMAIL_RE.test(get("email")) || get("email").length > LIMITES.email)
    errors.email = "Cette adresse email ne semble pas valide (exemple : nom@societe.fr).";

  if (get("telephone") && (!PHONE_RE.test(get("telephone")) || get("telephone").length > LIMITES.telephone))
    errors.telephone = "Ce numéro ne semble pas valide.";

  if (!SECTEURS.includes(get("secteur"))) errors.secteur = "Choisissez votre secteur.";

  if (get("message").length > LIMITES.message) errors.message = `${LIMITES.message} caractères maximum.`;

  if (data.get("consentement") !== "on") errors.consentement = "Votre accord est nécessaire pour que l'on puisse vous répondre.";

  return errors;
}

const inputClass =
  "h-12 w-full rounded-md border border-border-strong bg-surface px-4 text-16 text-ink transition-colors duration-(--duration-fast) ease-out hover:border-ink-muted aria-invalid:border-accent";

export default function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  // Reprise de l'estimation du calculateur de l'accueil (/contact?heures=12) : le visiteur ne la retape pas.
  // Paramètre validé (chiffres seuls) avant d'être réinjecté dans un texte.
  useEffect(() => {
    const heures = new URLSearchParams(window.location.search).get("heures");
    if (!heures || !/^\d{1,4}$/.test(heures)) return;
    const champ = formRef.current?.elements.namedItem("message");
    if (champ instanceof HTMLTextAreaElement && !champ.value) {
      champ.value = `D'après l'estimation faite sur votre site, une tâche qui revient nous prend environ ${heures} h par mois.`;
    }
  }, []);

  const clearError = (name: FieldName) =>
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const get = (key: string) => String(data.get(key) ?? "").trim();
    const payload: ContactPayload = {
      nom: get("nom"),
      societe: get("societe"),
      email: get("email"),
      telephone: get("telephone"),
      secteur: get("secteur"),
      irritants: data.getAll("irritants").map(String).join(", "),
      message: get("message"),
      consentement: true,
      site_web: get(HONEYPOT_FIELD),
      dureeRemplissage: Date.now() - startedAt.current,
    };

    setStatus("sending");
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col gap-4 py-8 focus:outline-none">
        <p className="eyebrow">Message envoyé</p>
        <p className="text-28 font-semibold tracking-tight">Merci, votre demande est bien partie.</p>
        <p className="text-16 text-ink-muted">
          Nous revenons vers vous par email. Si c'est urgent, écrivez directement à{" "}
          <a href={`mailto:${fallbackEmail}`} className="text-accent underline underline-offset-4 hover:text-accent-hover">
            {fallbackEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  const describedBy = (name: FieldName, hint?: string) =>
    [hint, errors[name] ? `${name}-erreur` : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} action={CONTACT_ENDPOINT} method="post" noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      <p className="text-14 text-ink-muted">Tous les champs sont obligatoires, sauf mention contraire.</p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="nom" label="Nom" error={errors.nom}>
          <input id="nom" name="nom" type="text" autoComplete="name" maxLength={LIMITES.nom} required
            aria-invalid={Boolean(errors.nom)} aria-describedby={describedBy("nom")}
            onChange={() => clearError("nom")} className={inputClass} />
        </Field>
        <Field name="societe" label="Société" error={errors.societe}>
          <input id="societe" name="societe" type="text" autoComplete="organization" maxLength={LIMITES.societe} required
            aria-invalid={Boolean(errors.societe)} aria-describedby={describedBy("societe")}
            onChange={() => clearError("societe")} className={inputClass} />
        </Field>
        <Field name="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={LIMITES.email} required
            aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")}
            onChange={() => clearError("email")} className={inputClass} />
        </Field>
        <Field name="telephone" label="Téléphone" optional error={errors.telephone}>
          <input id="telephone" name="telephone" type="tel" autoComplete="tel" inputMode="tel" maxLength={LIMITES.telephone}
            aria-invalid={Boolean(errors.telephone)} aria-describedby={describedBy("telephone")}
            onChange={() => clearError("telephone")} className={inputClass} />
        </Field>
      </div>

      <Field name="secteur" label="Secteur d'activité" error={errors.secteur}>
        <div className="relative">
          <select id="secteur" name="secteur" required defaultValue=""
            aria-invalid={Boolean(errors.secteur)} aria-describedby={describedBy("secteur")}
            onChange={() => clearError("secteur")} className={`${inputClass} cursor-pointer appearance-none pr-12`}>
            <option value="" disabled>Choisir…</option>
            {SECTEURS.map((secteur) => (
              <option key={secteur} value={secteur}>{secteur}</option>
            ))}
          </select>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
      </Field>

      <fieldset className="flex flex-col gap-3" aria-describedby="irritants-aide">
        <legend className="mb-3 text-14 font-medium text-ink">
          Où perdez-vous le plus de temps ? <span className="font-normal text-ink-muted">(facultatif)</span>
        </legend>
        <p id="irritants-aide" className="-mt-2 text-14 text-ink-muted">Plusieurs choix possibles.</p>
        <div className="flex flex-wrap gap-2">
          {IRRITANTS.map((irritant) => (
            <label key={irritant}
              className="group/chip inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border-strong bg-surface px-4 text-14 text-ink select-none transition-[background-color,border-color,color] duration-(--duration-fast) ease-out hover:border-accent has-checked:border-accent has-checked:bg-accent has-checked:text-on-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent">
              <input type="checkbox" name="irritants" value={irritant} className="sr-only" />
              <span aria-hidden="true" className="hidden font-mono group-has-checked/chip:inline">✓</span>
              {irritant}
            </label>
          ))}
        </div>
      </fieldset>

      <Field name="message" label="Votre message" optional error={errors.message} hint="Quelques lignes sur votre contexte suffisent.">
        <textarea id="message" name="message" rows={5} maxLength={LIMITES.message}
          aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("message", "message-aide")}
          onChange={() => clearError("message")}
          className={`${inputClass} h-auto min-h-32 resize-y py-3 leading-(--leading-body)`} />
      </Field>

      {/* Champ piège : invisible pour les humains, rempli par les robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Ne pas remplir ce champ</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-14 text-ink">
          <input type="checkbox" name="consentement" required
            aria-invalid={Boolean(errors.consentement)} aria-describedby={describedBy("consentement")}
            onChange={() => clearError("consentement")}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent" />
          <span>
            J'accepte que ces informations soient utilisées pour répondre à ma demande. Rien d'autre, voir la{" "}
            <a href="/confidentialite" className="text-accent underline underline-offset-4 hover:text-accent-hover">
              politique de confidentialité
            </a>
            .
          </span>
        </label>
        {errors.consentement && <ErrorText id="consentement-erreur">{errors.consentement}</ErrorText>}
      </div>

      <div className="flex flex-col">
      {/* Région d'alerte toujours présente dans le DOM (sinon l'annonce n'est pas garantie), vide hors erreur. */}
      <div role="alert" aria-live="assertive">
        {status === "error" && (
          <div className="mb-6 flex flex-col gap-1 rounded-md border border-accent bg-accent-soft p-4 text-14 text-ink">
            <p className="font-medium">L'envoi n'a pas abouti.</p>
            <p>
              Vos informations sont conservées ci-dessus : réessayez dans un instant, ou écrivez-nous directement à{" "}
              <a href={`mailto:${fallbackEmail}`} className="font-medium underline underline-offset-4">
                {fallbackEmail}
              </a>
              .
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-16 font-medium text-on-accent transition-[background-color,transform] duration-(--duration-fast) ease-out hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70 motion-safe:active:translate-y-px">
          {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>
        <p role="status" aria-live="polite" className="text-14 text-ink-muted">
          {status === "sending" ? "Envoi de votre demande…" : ""}
        </p>
      </div>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  optional = false,
  hint,
  error,
  children,
}: {
  name: FieldName;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-14 font-medium text-ink">
        {label} {optional && <span className="font-normal text-ink-muted">(facultatif)</span>}
      </label>
      {hint && (
        <p id={`${name}-aide`} className="-mt-1 text-14 text-ink-muted">
          {hint}
        </p>
      )}
      {children}
      {error && <ErrorText id={`${name}-erreur`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-baseline gap-2 text-14 text-accent">
      <span aria-hidden="true" className="font-mono">!</span>
      {children}
    </p>
  );
}
