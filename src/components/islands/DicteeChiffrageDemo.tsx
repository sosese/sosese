import { useEffect, useRef, useState } from "react";

type Ligne = { designation: string; qte: string; puht: string; tva: string; totalHt: string };

const LIGNES: Ligne[] = [
  { designation: "Parquet massif chêne, posé et collé", qte: "25 m²", puht: "90,00 €", tva: "10 %", totalHt: "2 250,00 €" },
  { designation: "Plinthes chêne, posées", qte: "12 ml", puht: "8,00 €", tva: "10 %", totalHt: "96,00 €" },
  { designation: "Ponçage et vitrification", qte: "25 m²", puht: "14,00 €", tva: "10 %", totalHt: "350,00 €" },
];

const PHASE_DELAY = 1100;
const FINAL = 2;

export default function DicteeChiffrageDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(FINAL);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || played) return;
    const node = rootRef.current;
    if (!node) return;
    // Seuil à 40 % : déclenchée au premier pixel visible, l'animation (2,2 s) était finie avant d'être vue.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlayed(true);
          setPhase(0);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, played]);

  useEffect(() => {
    if (reducedMotion || phase >= FINAL) return;
    const timer = window.setTimeout(() => setPhase((p) => p + 1), PHASE_DELAY);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  const showTable = phase >= 1;
  const validated = phase >= FINAL;

  return (
    <div ref={rootRef} className="flex w-full flex-col gap-6 rounded-lg border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">Aperçu du principe</p>
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setPhase(0)}
            className="font-mono text-14 text-accent transition-colors duration-(--duration-fast) ease-out hover:text-accent-hover"
          >
            Revoir la démonstration
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="eyebrow">Dicté sur le chantier</p>
        <blockquote className="rounded-md border border-border bg-bg-subtle px-4 py-3 text-16 text-ink">
          « 25 m² de parquet massif chêne collé, 12 mètres de plinthes et un ponçage-vitrification. Cale la prise de
          cotes jeudi 8 h. »
        </blockquote>
      </div>

      <div
        className={`flex flex-col gap-3 transition-opacity duration-(--duration-slow) ease-out ${showTable ? "opacity-100" : "opacity-0"}`}
      >
        <p className="eyebrow">Chiffré sur le catalogue</p>
        <div className="overflow-x-auto rounded-md border border-border">
          {/* min-w-120 = 480px : en dessous, le tableau défile dans son cadre plutôt que d'écraser les colonnes. */}
          <table className="w-full min-w-120 text-left text-14">
            <thead className="border-b border-border bg-bg-subtle text-ink-muted">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Désignation</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Qté</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">PU HT</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">TVA</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Total HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LIGNES.map((ligne) => (
                <tr key={ligne.designation}>
                  <td className="px-3 py-2 text-ink">{ligne.designation}</td>
                  <td className="px-3 py-2 text-right font-mono whitespace-nowrap text-ink-muted">{ligne.qte}</td>
                  <td className="px-3 py-2 text-right font-mono whitespace-nowrap text-ink-muted">{ligne.puht}</td>
                  <td className="px-3 py-2 text-right font-mono whitespace-nowrap text-ink-muted">{ligne.tva}</td>
                  <td className="px-3 py-2 text-right font-mono whitespace-nowrap text-ink">{ligne.totalHt}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-mono">
              <tr className="border-t border-border-strong">
                <td colSpan={4} className="px-3 py-2 text-ink-muted">Total HT</td>
                <td className="px-3 py-2 text-right text-ink">2 696,00 €</td>
              </tr>
              <tr>
                <td colSpan={4} className="px-3 py-2 text-ink-muted">TVA 10 %</td>
                <td className="px-3 py-2 text-right text-ink-muted">269,60 €</td>
              </tr>
              <tr>
                <td colSpan={4} className="px-3 py-2 font-semibold text-ink">Total TTC</td>
                <td className="px-3 py-2 text-right font-semibold text-accent">2 965,60 €</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-12 text-ink-muted">Illustration du principe à partir d'un scénario type — pas un devis réel.</p>
      </div>

      <div
        className={`flex flex-wrap items-center gap-3 border-t border-border pt-4 transition-opacity duration-(--duration-slow) ease-out ${showTable ? "opacity-100" : "opacity-0"}`}
      >
        {validated ? (
          <span className="inline-flex h-6 w-fit items-center gap-2 rounded-full border border-transparent bg-accent-soft px-2 font-mono text-12 whitespace-nowrap text-ink">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-bright" />
            devis créé + rendez-vous posé
          </span>
        ) : (
          <span className="inline-flex h-6 w-fit items-center gap-2 rounded-full border border-border bg-bg-subtle px-2 font-mono text-12 whitespace-nowrap text-ink-muted">
            en attente de votre validation à l'oral
          </span>
        )}
        <p className="text-14 text-ink-muted">
          Consultation et chiffrage libres, sans trace. L'écriture dans le logiciel de gestion n'a lieu qu'après votre
          accord explicite.
        </p>
      </div>
    </div>
  );
}
