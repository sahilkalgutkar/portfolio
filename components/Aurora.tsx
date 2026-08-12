// Slow-drifting gradient-blob background, shared across all pages via the
// root layout. Pure CSS (see .aurora* rules in app/globals.css) — no JS,
// no canvas, respects prefers-reduced-motion.
export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__blob aurora__blob--1" />
      <div className="aurora__blob aurora__blob--2" />
      <div className="aurora__blob aurora__blob--3" />
      <div className="aurora__grain" />
    </div>
  );
}
