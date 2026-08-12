"use client";

import { useEffect, useState } from "react";
import { PROJECT_QUERY } from "@/graphql/queries";
import { GRAPHQL_ENDPOINT } from "@/lib/graphql-endpoint";
import type { Project } from "@/lib/projects";
import { ProjectDetailView, ProjectDetailSkeleton, ProjectDetailError } from "./ProjectDetailView";

// Used only in the GitHub Pages static export: fetches the Vercel
// deployment's /api/graphql cross-origin, in the browser, after hydration.
// generateStaticParams (app/projects/[slug]/page.tsx) already limits which
// slugs get built, so a genuinely unknown slug 404s at the static-host
// level before this component ever runs.
export function ProjectDetailClient({ slug }: { slug: string }) {
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: PROJECT_QUERY, variables: { slug } }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.errors?.length) throw new Error(json.errors[0].message);
        setProject(json.data.project as Project | null);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) return <ProjectDetailError message={error} />;
  if (project === undefined) return <ProjectDetailSkeleton />;
  if (project === null) return <ProjectDetailError message="project not found" />;
  return <ProjectDetailView project={project} />;
}
