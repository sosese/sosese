// Déclenche chaque planche quand elle entre à l'écran. Sans ce script (ou sous mouvement réduit),
// data-scene n'est jamais posé : aucune animation, l'état final est affiché d'emblée.
const scenes = document.querySelectorAll<HTMLElement>(".sc");
if (scenes.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const obs = new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.scene = "joue";
        obs.unobserve(e.target);
      }
    },
    { threshold: 0.35 },
  );
  for (const s of scenes) {
    s.dataset.scene = "attend";
    obs.observe(s);
  }
}
