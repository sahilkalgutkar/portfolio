import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ProjectListItem } from "./ProjectList";

const fetchGraphQLMock = vi.fn();
vi.mock("@/lib/graphql-client", () => ({
  fetchGraphQL: (...args: unknown[]) => fetchGraphQLMock(...args),
}));

const { ProjectListServer } = await import("./ProjectListServer");

const projects: ProjectListItem[] = [
  {
    slug: "pipelineops",
    title: "PipelineOps",
    summary: "Job-monitoring platform.",
    stack: ["React"],
    repoUrl: "https://github.com/sahilkalgutkar/PipelineOps",
    liveUrl: null,
    featured: true,
  },
];

describe("ProjectListServer", () => {
  it("fetches projects via the in-process GraphQL client and renders them", async () => {
    fetchGraphQLMock.mockResolvedValue({ projects });

    const element = await ProjectListServer();
    render(element);

    expect(screen.getByText("PipelineOps")).toBeInTheDocument();
  });

  it("queries the projects list query with no variables", async () => {
    fetchGraphQLMock.mockResolvedValue({ projects: [] });

    await ProjectListServer();

    expect(fetchGraphQLMock).toHaveBeenCalledWith(expect.stringContaining("projects"));
  });
});
