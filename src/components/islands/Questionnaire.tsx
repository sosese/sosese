import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  EMAIL_RE,
  HONEYPOT_FIELD,
  LIMITES,
  NOMBRE_RE,
  PHONE_RE,
  QUESTIONNAIRE_ENDPOINT,
  SECTIONS,
  type Question,
  type QuestionnairePayload,
  type Reponses,
} from "../../lib/questionnaire";

type Status = "idle" | "sending" | "success" | "error";
type Errors = Record<string, string>;

// Brouillon gardé dans ce navigateur seulement (politique de confidentialité), effacé après l'envoi.
const BROUILLON = "questionnaire-brouillon";
const DERNIERE = SECTIONS.length - 1;
const QUESTIONS = SECTIONS.flatMap((s) => s.questions);

// Seulement les questions et options actuelles : un brouillon d'une version précédente du questionnaire peut
// contenir une question retirée ou une option renommée, que le serveur refuserait (objet strict, listes fermées).
function nettoyer(reponses: Reponses): Reponses {
  const propres: Reponses = {};
  for (const q of QUESTIONS) {
    const v = reponses[q.id];
    if (v === undefined) continue;
    if (q.type === "multi") propres[q.id] = (Array.isArray(v) ? v : []).filter((o) => q.options!.includes(o));
    else if (typeof v !== "string") continue;
    else if (q.type === "choix") propres[q.id] = q.options!.includes(v) ? v : "";
    else propres[q.id] = v.trim();
  }
  return propres;
}

function lireBrouillon(): { etape: number; reponses: Reponses } | null {
  try {
    const d = JSON.parse(localStorage.getItem(BROUILLON) ?? "null");
    if (!d || typeof d.reponses !== "object") return null;
    return { etape: Math.min(Math.max(Number(d.etape) || 0, 0), DERNIERE), reponses: d.reponses };
  } catch {
    return null;
  }
}

function ecrireBrouillon(etape: number, reponses: Reponses | null) {
  try {
    if (reponses) localStorage.setItem(BROUILLON, JSON.stringify({ etape, reponses }));
    else localStorage.removeItem(BROUILLON);
  } catch {}
}

// Focus sans laisser le navigateur choisir où défiler (il remontait jusqu'au titre de la page), puis le haut de
// la carte (`data-questionnaire-carte`, posé par la page) sous l'en-tête collant, grâce au scroll-padding-top de
// html. Sans option behavior : le défilement doux de global.css ne s'applique que hors mouvement réduit.
function ramener(cible: HTMLElement | null) {
  if (!cible) return;
  cible.focus({ preventScroll: true });
  (cible.closest<HTMLElement>("[data-questionnaire-carte]") ?? cible).scrollIntoView({ block: "start" });
}

function valider(questions: Question[], reponses: Reponses): Errors {
  const errors: Errors = {};
  for (const q of questions) {
    const v = String(reponses[q.id] ?? "").trim();
    if (!v) continue;
    if (q.type === "nombre" && !NOMBRE_RE.test(v)) errors[q.id] = "Indiquez un nombre (par exemple 12 ou 12,5).";
    if (q.type === "email" && (!EMAIL_RE.test(v) || v.length > LIMITES.email))
      errors[q.id] = "Cette adresse email ne semble pas valide (exemple : nom@societe.fr).";
    if (q.type === "tel" && (!PHONE_RE.test(v) || v.length > LIMITES.telephone)) errors[q.id] = "Ce numéro ne semble pas valide.";
  }
  return errors;
}

const inputClass =
  "h-12 w-full rounded-md border border-border-strong bg-surface px-4 text-16 text-ink transition-colors duration-(--duration-fast) ease-out hover:border-ink-muted aria-invalid:border-accent";
const boutonBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-16 font-medium transition-[background-color,border-color,color,transform] duration-(--duration-fast) ease-out motion-safe:active:translate-y-px";
const boutonPrimaire = `${boutonBase} bg-accent text-on-accent hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70`;
const boutonSecondaire = `${boutonBase} border border-border-strong bg-surface text-ink hover:border-accent hover:text-accent`;

export default function Questionnaire({ fallbackEmail }: { fallbackEmail: string }) {
  const titreRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const aNavigue = useRef(false);
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState<Reponses>({});
  const [consentement, setConsentement] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [accuse, setAccuse] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    startedAt.current = Date.now();
    const brouillon = lireBrouillon();
    if (brouillon) {
      setReponses(brouillon.reponses);
      setEtape(brouillon.etape);
    }
  }, []);

  // Au changement d'étape (pas au chargement), le focus va sur le titre : le lecteur d'écran l'annonce.
  useEffect(() => {
    if (aNavigue.current) ramener(titreRef.current);
  }, [etape]);

  useEffect(() => {
    if (status === "success") ramener(successRef.current);
  }, [status]);

  const section = SECTIONS[etape];
  const derniere = etape === DERNIERE;

  const repondre = (id: string, valeur: string | string[]) => {
    const suivantes = { ...reponses, [id]: valeur };
    setReponses(suivantes);
    ecrireBrouillon(etape, suivantes);
    if (errors[id])
      setErrors((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
  };

  const allerA = (cible: number) => {
    aNavigue.current = true;
    setErrors({});
    setEtape(cible);
    ecrireBrouillon(cible, reponses);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;

    const found = valider(section.questions, reponses);
    if (derniere && !consentement) found.consentement = "Votre accord est nécessaire pour que l'on puisse lire vos réponses.";
    setErrors(found);
    const premier = [...section.questions.map((q) => q.id), "consentement"].find((id) => found[id]);
    if (premier) {
      form.querySelector<HTMLElement>(`[name="${premier}"]`)?.focus();
      return;
    }
    if (!derniere) return allerA(etape + 1);

    const payload: QuestionnairePayload = {
      reponses: nettoyer(reponses),
      consentement: true,
      site_web: String(new FormData(form).get(HONEYPOT_FIELD) ?? ""),
      dureeRemplissage: Date.now() - startedAt.current,
    };

    setStatus("sending");
    try {
      const response = await fetch(QUESTIONNAIRE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const corps = await response.json().catch(() => ({}));
      setAccuse(Boolean(corps.accuse));
      ecrireBrouillon(0, null);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col gap-4 py-8 focus:outline-none">
        <p className="eyebrow">Réponses envoyées</p>
        <p className="text-28 font-semibold tracking-tight">Merci pour votre temps.</p>
        <p className="text-16 text-ink-muted">
          {accuse
            ? "Vos réponses sont bien arrivées. Un accusé de réception vient de partir vers votre boîte email."
            : "Vos réponses sont bien arrivées."}{" "}
          Pour toute question, écrivez à{" "}
          <a href={`mailto:${fallbackEmail}`} className="text-accent underline underline-offset-4 hover:text-accent-hover">
            {fallbackEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={QUESTIONNAIRE_ENDPOINT} method="post" noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div aria-hidden="true" className="flex gap-2">
          {SECTIONS.map((s, i) => (
            <span key={s.titre}
              className={`h-1 flex-1 rounded-full transition-colors duration-(--duration-base) ease-out ${i <= etape ? "bg-accent" : "bg-border-strong"}`} />
          ))}
        </div>
        <p className="eyebrow">
          Étape {etape + 1} sur {SECTIONS.length}
        </p>
        <h2 ref={titreRef} tabIndex={-1} className="text-28 focus:outline-none">
          {section.titre}
        </h2>
        <p className="text-16 text-ink-muted">{section.chapeau}</p>
      </div>

      <div className="flex flex-col gap-8">
        {section.questions.map((q) => (
          <Champ key={q.id} question={q} valeur={reponses[q.id]} erreur={errors[q.id]} onChange={(v) => repondre(q.id, v)} />
        ))}
      </div>

      {/* Champ piège : invisible pour les humains, rempli par les robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Ne pas remplir ce champ</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {derniere && (
        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-start gap-3 text-14 text-ink">
            <input type="checkbox" name="consentement" checked={consentement}
              aria-invalid={Boolean(errors.consentement)} aria-describedby={errors.consentement ? "consentement-erreur" : undefined}
              onChange={(e) => {
                setConsentement(e.target.checked);
                setErrors(({ consentement: _, ...rest }) => rest);
              }}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent" />
            <span>
              J'accepte que ces réponses soient utilisées pour mieux comprendre les besoins des petites entreprises et,
              si j'ai laissé mes coordonnées, pour me recontacter. Rien d'autre, voir la{" "}
              <a href="/confidentialite" className="text-accent underline underline-offset-4 hover:text-accent-hover">
                politique de confidentialité
              </a>
              .
            </span>
          </label>
          {errors.consentement && <ErrorText id="consentement-erreur">{errors.consentement}</ErrorText>}
        </div>
      )}

      <div className="flex flex-col">
        {/* Région d'alerte toujours présente dans le DOM (sinon l'annonce n'est pas garantie), vide hors erreur. */}
        <div role="alert" aria-live="assertive">
          {status === "error" && (
            <div className="mb-6 flex flex-col gap-1 rounded-md border border-accent bg-accent-soft p-4 text-14 text-ink">
              <p className="font-medium">L'envoi n'a pas abouti.</p>
              <p>
                Vos réponses sont conservées : réessayez dans un instant, ou écrivez directement à{" "}
                <a href={`mailto:${fallbackEmail}`} className="font-medium underline underline-offset-4">
                  {fallbackEmail}
                </a>
                .
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {etape > 0 ? (
            <button type="button" onClick={() => allerA(etape - 1)} className={boutonSecondaire}>
              Précédent
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={status === "sending"} className={boutonPrimaire}>
            {derniere ? (status === "sending" ? "Envoi en cours…" : "Envoyer mes réponses") : "Suivant"}
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-2 text-14 text-ink-muted">
          {status === "sending" ? "Envoi de vos réponses…" : ""}
        </p>
      </div>
    </form>
  );
}

function Champ({
  question: q,
  valeur,
  erreur,
  onChange,
}: {
  question: Question;
  valeur: string | string[] | undefined;
  erreur?: string;
  onChange: (v: string | string[]) => void;
}) {
  const aide = q.aide ? `${q.id}-aide` : undefined;
  const describedBy = [aide, erreur ? `${q.id}-erreur` : undefined].filter(Boolean).join(" ") || undefined;
  const texte = typeof valeur === "string" ? valeur : "";

  if (q.type === "choix" || q.type === "multi") {
    const multi = q.type === "multi";
    const coches = multi ? (Array.isArray(valeur) ? valeur : []) : [texte];
    return (
      <fieldset className="flex flex-col gap-3" aria-describedby={describedBy}>
        <legend className="mb-3 text-16 font-medium text-ink">{q.label}</legend>
        {multi && <p className="-mt-2 text-14 text-ink-muted">Plusieurs choix possibles.</p>}
        <div className="flex flex-wrap gap-2">
          {q.options!.map((option) => (
            <label key={option}
              className="group/chip inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2 text-14 text-ink select-none transition-[background-color,border-color,color] duration-(--duration-fast) ease-out hover:border-accent has-checked:border-accent has-checked:bg-accent has-checked:text-on-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent">
              <input type={multi ? "checkbox" : "radio"} name={q.id} value={option} checked={coches.includes(option)}
                onChange={(e) => {
                  if (!multi) return onChange(option);
                  onChange(e.target.checked ? [...coches, option] : coches.filter((c) => c !== option));
                }}
                className="sr-only" />
              <span aria-hidden="true" className="hidden group-has-checked/chip:inline">✓</span>
              {option}
            </label>
          ))}
        </div>
        {!multi && texte && (
          <button type="button" onClick={() => onChange("")}
            className="w-fit text-14 text-ink-muted underline underline-offset-4 hover:text-accent">
            Effacer ma réponse
          </button>
        )}
      </fieldset>
    );
  }

  const commun = {
    id: q.id,
    name: q.id,
    value: texte,
    autoComplete: q.autocomplete ?? "off",
    "aria-invalid": Boolean(erreur),
    "aria-describedby": describedBy,
  };

  let controle: ReactNode;
  if (q.type === "paragraphe") {
    controle = (
      <textarea {...commun} rows={4} maxLength={LIMITES.paragraphe} onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} h-auto min-h-32 resize-y py-3 leading-(--leading-body)`} />
    );
  } else if (q.type === "nombre") {
    controle = (
      <div className="flex items-center gap-3">
        <input {...commun} type="text" inputMode="decimal" maxLength={9} onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} max-w-40`} />
        {q.unite && <span className="text-16 text-ink-muted">{q.unite}</span>}
      </div>
    );
  } else {
    const attributs =
      q.type === "email"
        ? { type: "email", inputMode: "email" as const, maxLength: LIMITES.email }
        : q.type === "tel"
          ? { type: "tel", inputMode: "tel" as const, maxLength: LIMITES.telephone }
          : { type: "text", maxLength: LIMITES.texte };
    controle = <input {...commun} {...attributs} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={q.id} className="text-16 font-medium text-ink">
        {q.label}
      </label>
      {q.aide && (
        <p id={aide} className="-mt-1 text-14 text-ink-muted">
          {q.aide}
        </p>
      )}
      {controle}
      {erreur && <ErrorText id={`${q.id}-erreur`}>{erreur}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-baseline gap-2 text-14 text-accent">
      <span aria-hidden="true">!</span>
      {children}
    </p>
  );
}
