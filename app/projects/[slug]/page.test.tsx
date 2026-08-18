import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// ProjectDetailServer is an async server component fetching from GraphQL
// in-process; it's exercised on its own elsewhere. This test is about
// whether app/projects/[slug]/page.tsx correctly awaits the route's params
// and passes the slug through.
vi.mock("@/components/ProjectDetailServer", () => ({
  ProjectDetailServer: ({ slug }: { slug: string }) => (
    <div data-testid="project-detail-server-slot">{slug}</div>
  ),
}));

const { default: ProjectPage, dynamic } = await import("./page");

describe("app/projects/[slug]/page.tsx", () => {
  it("opts out of static caching so Supabase data is fetched on every request", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("awaits the route params and passes the slug through to ProjectDetailServer", async () => {
    const element = await ProjectPage({ params: Promise.resolve({ slug: "pipelineops" }) });
    render(element);

    expect(screen.getByTestId("project-detail-server-slot")).toHaveTextContent("pipelineops");
  });

  it("passes a different slug through unchanged", async () => {
    const element = await ProjectPage({ params: Promise.resolve({ slug: "spliteasy" }) });
    render(element);

    expect(screen.getByTestId("project-detail-server-slot")).toHaveTextContent("spliteasy");
  });
});
