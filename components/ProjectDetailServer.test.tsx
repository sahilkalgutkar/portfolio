import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/projects";

const fetchGraphQLMock = vi.fn();
vi.mock("@/lib/graphql-client", () => ({
  fetchGraphQL: (...args: unknown[]) => fetchGraphQLMock(...args),
}));

const notFoundMock = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

const { ProjectDetailServer } = await import("./ProjectDetailServer");

const project: Project = {
  slug: "pipelineops",
  title: "PipelineOps",
  summary: "Job-monitoring platform.",
  description: "Full description.",
  stack: ["React"],
  repoUrl: "https://github.com/sahilkalgutkar/PipelineOps",
  liveUrl: null,
  featured: true,
};

describe("ProjectDetailServer", () => {
  it("fetches the project by slug and renders its detail view", async () => {
    fetchGraphQLMock.mockResolvedValue({ project });

    const element = await ProjectDetailServer({ slug: "pipelineops" });
    render(element);

    expect(screen.getByRole("heading", { name: "PipelineOps" })).toBeInTheDocument();
    expect(fetchGraphQLMock).toHaveBeenCalledWith(expect.any(String), { slug: "pipelineops" });
  });

  it("calls notFound() when the query returns no project for the slug", async () => {
    fetchGraphQLMock.mockResolvedValue({ project: null });

    await expect(ProjectDetailServer({ slug: "does-not-exist" })).rejects.toThrow(
      "NEXT_NOT_FOUND"
    );
    expect(notFoundMock).toHaveBeenCalled();
  });
});
