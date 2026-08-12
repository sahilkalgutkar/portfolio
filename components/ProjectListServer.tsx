import { fetchGraphQL } from "@/lib/graphql-client";
import { PROJECTS_QUERY } from "@/graphql/queries";
import { ProjectList, type ProjectListItem } from "./ProjectList";

// Used on Vercel: runs the query in-process at render time (see
// lib/graphql-client.ts). Never invoked in the GitHub Pages static export.
export async function ProjectListServer() {
  const data = await fetchGraphQL<{ projects: ProjectListItem[] }>(PROJECTS_QUERY);
  return <ProjectList projects={data.projects} />;
}
