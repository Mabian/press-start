export function prefersReducedMotion(document: Document): boolean {
  const view = document.defaultView;
  if (typeof view?.matchMedia !== 'function') {
    return false;
  }
  return view.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
