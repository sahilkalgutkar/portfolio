import { describe, expect, it, vi } from "vitest";
import { seedProjects } from "@/lib/projects";

const getSupabaseClientMock = vi.fn();
vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: () => getSupabaseClientMock(),
}));

const { resolvers } = await import("./resolvers");

function supabaseReturning(data: unknown, error: unknown = null) {
  return {
    from: () => ({
      select: () => Promise.resolve({ data, error }),
    }),
  };
}

describe("resolvers.Query.projects", () => {
  it("falls back to seed data when Supabase isn't configured", async () => {
    getSupabaseClientMock.mockReturnValue(null);

    const result = await resolvers.Query.projects();

    expect(result).toEqual(seedProjects);
  });

  it("falls back to seed data when the Supabase query errors", async () => {
    getSupabaseClientMock.mockReturnValue(supabaseReturning(null, new Error("boom")));

    const result = await resolvers.Query.projects();

    expect(result).toEqual(seedProjects);
  });

  it("falls back to seed data when Supabase returns an empty table", async () => {
    getSupabaseClientMock.mockReturnValue(supabaseReturning([]));

    const result = await resolvers.Query.projects();

    expect(result).toEqual(seedProjects);
  });

  it("returns Supabase's rows when they exist", async () => {
    const rows = [{ slug: "from-db", title: "From DB" }];
    getSupabaseClientMock.mockReturnValue(supabaseReturning(rows));

    const result = await resolvers.Query.projects();

    expect(result).toEqual(rows);
  });
});

describe("resolvers.Query.project", () => {
  it("finds a project by slug from the fallback seed data", async () => {
    getSupabaseClientMock.mockReturnValue(null);

    const result = await resolvers.Query.project(undefined, { slug: seedProjects[0].slug });

    expect(result).toEqual(seedProjects[0]);
  });

  it("returns null for an unknown slug", async () => {
    getSupabaseClientMock.mockReturnValue(null);

    const result = await resolvers.Query.project(undefined, { slug: "does-not-exist" });

    expect(result).toBeNull();
  });
});
