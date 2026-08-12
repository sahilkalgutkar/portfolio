import Link from "next/link";
import type { Project } from "@/lib/projects";

export type ProjectListItem = Pick<
  Project,
  "slug" | "title" | "summary" | "stack" | "repoUrl" | "liveUrl" | "featured"
>;

export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  return (
    <section aria-label="Projects" className="flex flex-col gap-5">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/projects/${project.slug}`}
          className="group relative overflow-hidden rounded-2xl border border-black/[.06] bg-white/60 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-black/[.12] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.15)] dark:border-white/[.08] dark:bg-white/[.03] dark:hover:border-white/[.16] dark:hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)]"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-medium text-zinc-900 dark:text-zinc-50">
              {project.title}
            </h2>
            {project.featured && (
              <span className="shrink-0 rounded-full bg-zinc-900/5 px-2.5 py-1 font-mono text-[0.65rem] font-medium tracking-wide text-zinc-600 uppercase dark:bg-white/10 dark:text-zinc-400">
                Featured
              </span>
            )}
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{project.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-zinc-900/[.04] px-2.5 py-1 font-mono text-xs text-zinc-700 dark:bg-white/[.06] dark:text-zinc-300"
              >
                {tech}
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-zinc-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-white/30"
          />
        </Link>
      ))}
    </section>
  );
}

export function ProjectListSkeleton() {
  return (
    <section aria-label="Loading projects" className="flex flex-col gap-5">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-black/[.06] bg-white/60 p-6 backdrop-blur-xl dark:border-white/[.08] dark:bg-white/[.03]"
        >
          <div className="h-5 w-40 rounded bg-zinc-900/10 dark:bg-white/10" />
          <div className="mt-3 h-4 w-full rounded bg-zinc-900/[.06] dark:bg-white/[.06]" />
          <div className="mt-2 h-4 w-2/3 rounded bg-zinc-900/[.06] dark:bg-white/[.06]" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-zinc-900/[.04] dark:bg-white/[.06]" />
            <div className="h-6 w-16 rounded-full bg-zinc-900/[.04] dark:bg-white/[.06]" />
            <div className="h-6 w-16 rounded-full bg-zinc-900/[.04] dark:bg-white/[.06]" />
          </div>
        </div>
      ))}
    </section>
  );
}

export function ProjectListError({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-red-900/10 bg-red-500/5 p-4 text-sm text-red-700 dark:border-red-100/10 dark:text-red-400">
      Couldn&apos;t load projects: {message}
    </p>
  );
}
