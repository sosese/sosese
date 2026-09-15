import { useEffect, useRef, useState } from "react";

type Line = { kind: "cmd" | "out" | "ok" | "result" | "blank"; text: string };

const LINES: Line[] = [
  { kind: "cmd", text: 'atelier --client "PME industrie" --duree 2j' },
  { kind: "out", text: "14 processus cartographiés" },
  { kind: "out", text: "6 candidats à l'automatisation" },
  { kind: "out", text: "2 quick wins identifiés" },
  { kind: "blank", text: "" },
  { kind: "cmd", text: "build devis-auto" },
  { kind: "ok", text: "lecture des demandes entrantes" },
  { kind: "ok", text: "génération du devis depuis votre catalogue" },
  { kind: "ok", text: "envoi pour validation" },
  { kind: "result", text: "38 min économisées par devis" },
];

type Frame = { line: number; chars: number; delay: number };

// Séquence d'environ 12 s : frame 0 = écran vide, dernière frame = état final tenu 4 s.
const FRAMES: Frame[] = (() => {
  const frames: Frame[] = [{ line: 0, chars: 0, delay: 500 }];
  LINES.forEach((line, index) => {
    if (line.kind === "cmd") {
      for (let c = 1; c <= line.text.length; c++) frames.push({ line: index, chars: c, delay: 32 });
      frames[frames.length - 1].delay = 350;
    } else {
      frames.push({ line: index, chars: line.text.length, delay: line.kind === "blank" ? 150 : 480 });
    }
  });
  frames.push({ line: LINES.length, chars: 0, delay: 4000 });
  return frames;
})();

const FINAL = FRAMES.length - 1;

export default function TerminalDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(FINAL);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setFrame(FINAL);
      return;
    }
    if (paused || hovered || !inView) return;
    const timer = window.setTimeout(() => setFrame((f) => (f + 1) % FRAMES.length), FRAMES[frame].delay);
    return () => window.clearTimeout(timer);
  }, [frame, reducedMotion, paused, hovered, inView]);

  const current = FRAMES[frame];
  const promptReady = current.line >= LINES.length;

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="section-invert overflow-hidden rounded-lg border border-border-strong"
    >
      <div className="flex h-10 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
        </div>
        <p className="font-mono text-12 text-ink-muted">sosese — exemple de mission</p>
        {reducedMotion ? (
          <span className="size-6" aria-hidden="true" />
        ) : (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? "Relancer l'animation" : "Mettre l'animation en pause"}
            title={paused ? "Relancer l'animation" : "Mettre l'animation en pause"}
            className="inline-flex size-6 items-center justify-center rounded-sm text-ink-muted transition-colors duration-(--duration-fast) ease-out hover:text-ink"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3" fill="currentColor">
              {paused ? <path d="M4 2.5v11l9-5.5-9-5.5Z" /> : <path d="M4 2.5h2.5v11H4zM9.5 2.5H12v11H9.5z" />}
            </svg>
          </button>
        )}
      </div>

      {/* Texte complet pour lecteurs d'écran et moteurs ; le bloc animé est masqué aux technologies d'assistance. */}
      <div className="sr-only">
        {LINES.filter((l) => l.kind !== "blank").map((l, i) => (
          <p key={i}>{l.text}</p>
        ))}
      </div>

      <div aria-hidden="true" className="p-4 font-mono text-12 leading-(--leading-body) sm:p-6 sm:text-14">
        {LINES.map((line, index) => {
          const done = index < current.line;
          const active = index === current.line;
          const shown = done ? line.text.length : active ? current.chars : 0;
          const visible = done || (active && shown > 0) || (active && line.kind === "cmd");

          return (
            <p key={index} className={`min-h-[1lh] whitespace-pre-wrap ${visible ? "" : "invisible"}`}>
              <Prefix kind={line.kind} />
              <span className={line.kind === "result" ? "text-accent" : line.kind === "cmd" ? "text-ink" : "text-ink-muted"}>
                {line.text.slice(0, shown)}
              </span>
              {active && line.kind === "cmd" && <Cursor />}
              <span className="invisible">{line.text.slice(shown)}</span>
            </p>
          );
        })}
        <p className={`min-h-[1lh] ${promptReady ? "" : "invisible"}`}>
          <Prefix kind="cmd" />
          <Cursor />
        </p>
      </div>
    </div>
  );
}

function Prefix({ kind }: { kind: Line["kind"] }) {
  if (kind === "blank") return null;
  const symbol = kind === "cmd" ? "$ " : kind === "ok" ? "✓ " : "→ ";
  return <span className={kind === "out" ? "text-ink-muted" : "text-accent"}>{symbol}</span>;
}

function Cursor() {
  return <span className="terminal-cursor inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-accent" />;
}
