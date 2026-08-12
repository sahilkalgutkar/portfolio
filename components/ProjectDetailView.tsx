import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectDetailView({ project }: { project: Project }) {
  const paragraphs = project.description.split("\n\n");

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-zinc-500 uppercase transition-colors hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        ← All projects
      </Link>

      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-transparent sm:text-5xl bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
        {project.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {project.summary}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full bg-zinc-900/[.04] px-2.5 py-1 font-mono text-xs text-zinc-700 dark:bg-white/[.06] dark:text-zinc-300"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-5 text-sm font-medium">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-500 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-400"
        >
          Repository ↗
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-500 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-400"
          >
            Live demo ↗
          </a>
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-black/[.06] bg-white/60 p-6 backdrop-blur-xl sm:p-8 dark:border-white/[.08] dark:bg-white/[.03]">
        <div className="flex flex-col gap-5 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 rounded bg-zinc-900/10 dark:bg-white/10" />
      <div className="mt-6 h-10 w-64 rounded bg-zinc-900/10 dark:bg-white/10" />
      <div className="mt-4 h-4 w-full max-w-md rounded bg-zinc-900/[.06] dark:bg-white/[.06]" />
      <div className="mt-10 h-48 rounded-2xl border border-black/[.06] bg-white/60 backdrop-blur-xl dark:border-white/[.08] dark:bg-white/[.03]" />
    </div>
  );
}

export function ProjectDetailError({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-red-900/10 bg-red-500/5 p-4 text-sm text-red-700 dark:border-red-100/10 dark:text-red-400">
      Couldn&apos;t load this project: {message}
    </p>
  );
}
