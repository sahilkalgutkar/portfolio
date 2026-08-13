const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
];

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-10 border-b border-black/[.06] bg-white/70 backdrop-blur-xl dark:border-white/[.08] dark:bg-black/50">
      <div className="mx-auto flex max-w-3xl items-center gap-5 overflow-x-auto px-6 py-3 font-mono text-xs tracking-wide text-zinc-600 uppercase sm:px-10 dark:text-zinc-400">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 transition-colors hover:text-zinc-950 dark:hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
