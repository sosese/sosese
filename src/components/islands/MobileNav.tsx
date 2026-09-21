import { useRef } from "react";
import ThemeToggle from "./ThemeToggle";

type Link = { label: string; href: string };

type Props = {
  links: Link[];
  cta: Link;
};

export default function MobileNav({ links, cta }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-controls="menu-mobile"
        aria-label="Ouvrir le menu"
        className="inline-flex size-10 items-center justify-center rounded-md text-ink transition-colors duration-(--duration-fast) ease-out hover:bg-bg-subtle"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {/* <dialog> modal : piège de focus, Échap et restitution du focus fournis par le navigateur. */}
      <dialog
        id="menu-mobile"
        ref={dialogRef}
        aria-label="Menu principal"
        onClose={() => {
          document.documentElement.style.overflow = "";
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-ink backdrop:bg-transparent"
      >
        <div className="container-site flex h-(--header-h) items-center justify-between border-b border-border">
          <a href="/v2/" onClick={close} className="text-21 font-semibold tracking-tight">
            sosese<span className="text-accent">.</span>
          </a>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              onClick={close}
              aria-label="Fermer le menu"
              className="inline-flex size-10 items-center justify-center rounded-md transition-colors duration-(--duration-fast) ease-out hover:bg-bg-subtle"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>

        <nav aria-label="Navigation principale" className="container-site flex flex-col pt-8">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href} className="border-b border-border">
                <a
                  href={link.href}
                  onClick={close}
                  className="flex items-center justify-between py-4 text-28 font-medium tracking-tight transition-colors duration-(--duration-fast) ease-out hover:text-accent"
                >
                  {link.label}
                  <span aria-hidden="true" className="font-mono text-16 text-ink-muted">→</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={cta.href}
            onClick={close}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 text-16 font-medium text-on-accent transition-colors duration-(--duration-fast) ease-out hover:bg-accent-hover"
          >
            {cta.label}
          </a>
        </nav>
      </dialog>
    </>
  );
}
