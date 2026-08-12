"use client";

import { useEffect, useState } from "react";
import { PROJECTS_QUERY } from "@/graphql/queries";
import { GRAPHQL_ENDPOINT } from "@/lib/graphql-endpoint";
import { ProjectList, ProjectListSkeleton, ProjectListError, type ProjectListItem } from "./ProjectList";

// Used only in the GitHub Pages static export: fetches the Vercel
// deployment's /api/graphql cross-origin, in the browser, after hydration
// (there's no server at request time to run this in-process).
export function ProjectListClient() {
  const [projects, setProjects] = useState<ProjectListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: PROJECTS_QUERY }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.errors?.length) throw new Error(json.errors[0].message);
        setProjects(json.data.projects as ProjectListItem[]);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <ProjectListError message={error} />;
  if (!projects) return <ProjectListSkeleton />;
  return <ProjectList projects={projects} />;
}
