import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { profile } from "@/lib/profile";

// ProjectListServer is an async server component (fetches from GraphQL
// in-process) — real React DOM render can't invoke async components, so it
// gets a synchronous stand-in here. That's already exercised on its own in
// components/ProjectListServer via lib/graphql-client's tests; this test is
// about how app/page.tsx wires the real profile page together.
vi.mock("@/components/ProjectListServer", () => ({
  ProjectListServer: () => <div data-testid="project-list-server-slot" />,
}));

const { default: Home, dynamic } = await import("./page");

describe("app/page.tsx", () => {
  it("opts out of static caching so Supabase data is fetched on every request", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("renders the real profile page with the project list slot in place", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeInTheDocument();
    expect(screen.getByTestId("project-list-server-slot")).toBeInTheDocument();
  });
});
