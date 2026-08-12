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
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24 sm:px-10">
        <header className="mb-16">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Sahil Kalgutkar
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Software engineer. Below are case studies for a few projects, served through a
            self-hosted GraphQL API backed by Supabase.
          </p>
        </header>

        <section aria-label="Projects" className="flex flex-col gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group rounded-xl border border-black/[.08] p-6 transition-colors hover:border-black/[.16] dark:border-white/[.12] dark:hover:border-white/[.24]"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-medium text-black dark:text-zinc-50">
                  {project.title}
                </h2>
                {project.featured && (
                  <span className="shrink-0 rounded-full bg-black/[.06] px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-white/[.08] dark:text-zinc-400">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{project.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-black/[.04] px-2.5 py-1 text-xs text-zinc-700 dark:bg-white/[.06] dark:text-zinc-300"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
