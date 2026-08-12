import { notFound } from "next/navigation";
import { fetchGraphQL } from "@/lib/graphql-client";
import { PROJECT_QUERY } from "@/graphql/queries";
import type { Project } from "@/lib/projects";
import { ProjectDetailView } from "./ProjectDetailView";

// Used on Vercel: runs the query in-process at render time. Never invoked
// in the GitHub Pages static export.
export async function ProjectDetailServer({ slug }: { slug: string }) {
  const data = await fetchGraphQL<{ project: Project | null }>(PROJECT_QUERY, { slug });
  if (!data.project) notFound();
  return <ProjectDetailView project={data.project} />;
}
