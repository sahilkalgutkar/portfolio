import { getSupabaseClient } from "@/lib/supabase";
import { seedProjects, type Project } from "@/lib/projects";

async function fetchProjects(): Promise<Project[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return seedProjects;

  const { data, error } = await supabase
    .from("projects")
    .select("slug, title, summary, description, stack, repoUrl, liveUrl, featured");

  if (error || !data || data.length === 0) return seedProjects;
  return data as Project[];
}

export const resolvers = {
  Query: {
    projects: async (): Promise<Project[]> => fetchProjects(),
    project: async (_parent: unknown, args: { slug: string }): Promise<Project | null> => {
      const projects = await fetchProjects();
      return projects.find((project) => project.slug === args.slug) ?? null;
    },
  },
};
