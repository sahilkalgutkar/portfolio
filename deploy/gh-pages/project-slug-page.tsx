// Static-export variant of app/projects/[slug]/page.tsx, swapped in by
// .github/workflows/deploy-gh-pages.yml before `next build`. Not a route —
// Next only treats files literally named app/**/page.tsx as routes, and
// this file lives outside app/.
import { fetchGraphQL } from "@/lib/graphql-client";
import { PROJECTS_QUERY } from "@/graphql/queries";
import { ProjectDetailClient } from "@/components/ProjectDetailClient";

// Static export needs every dynamic path known at build time. This still
// runs in-process on the CI runner (same as the Vercel build), it just
// enumerates slugs instead of rendering a page with them.
export async function generateStaticParams() {
  const data = await fetchGraphQL<{ projects: { slug: string }[] }>(PROJECTS_QUERY);
  return data.projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24 sm:px-10 sm:py-32">
      <ProjectDetailClient slug={slug} />
    </main>
  );
}
