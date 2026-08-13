import { profile } from "@/lib/profile";

export function SiteFooter() {
  return (
    <footer className="mt-4 border-t border-black/[.06] py-10 dark:border-white/[.08]">
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-500 dark:text-zinc-500">
        <p>© {profile.name}</p>
        <div className="flex gap-5">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-zinc-950 dark:hover:text-white">
            Email
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-950 dark:hover:text-white"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-950 dark:hover:text-white"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
