import Link from "next/link";
import { fetchGraphQL } from "@/lib/graphql-client";
import { PROJECTS_QUERY } from "@/graphql/queries";
import type { Project } from "@/lib/projects";

type ProjectListItem = Pick<
  Project,
  "slug" | "title" | "summary" | "stack" | "repoUrl" | "liveUrl" | "featured"
>;

async function getProjects(): Promise<ProjectListItem[]> {
  const data = await fetchGraphQL<{ projects: ProjectListItem[] }>(PROJECTS_QUERY);
  return data.projects;
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24 sm:px-10 sm:py-32">
      <header className="mb-20">
        <p className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-500">
          Software engineer
        </p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
          Sahil Kalgutkar
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          I build production-shaped systems end to end. Case studies below are served
          through a self-hosted GraphQL API backed by Supabase — not hardcoded.
        </p>
        <a
          href="https://github.com/sahilkalgutkar"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-950 hover:decoration-zinc-500 dark:text-zinc-300 dark:decoration-zinc-700 dark:hover:text-white dark:hover:decoration-zinc-400"
        >
          github.com/sahilkalgutkar
        </a>
      </header>

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
    </main>
  );
}
