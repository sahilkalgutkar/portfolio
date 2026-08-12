import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchGraphQL } from "@/lib/graphql-client";
import { PROJECT_QUERY } from "@/graphql/queries";
import type { Project } from "@/lib/projects";

async function getProject(slug: string): Promise<Project | null> {
  const data = await fetchGraphQL<{ project: Project | null }>(PROJECT_QUERY, { slug });
  return data.project;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24 sm:px-10">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          ← All projects
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {project.title}
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {project.summary}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-black/[.04] px-2.5 py-1 text-xs text-zinc-700 dark:bg-white/[.06] dark:text-zinc-300"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-4 text-sm font-medium">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline underline-offset-4 dark:text-zinc-50"
          >
            Repository
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline underline-offset-4 dark:text-zinc-50"
            >
              Live demo
            </a>
          )}
        </div>

        <div className="mt-10 whitespace-pre-line text-base leading-7 text-zinc-700 dark:text-zinc-300">
          {project.description}
        </div>
      </main>
    </div>
  );
}
