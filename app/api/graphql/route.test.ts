import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { seedProjects } from "@/lib/projects";
import { GET, OPTIONS, POST } from "./route";

// No SUPABASE_URL/SUPABASE_ANON_KEY are set in the test environment, so
// these hit the real resolvers and fall back to the seed data (see
// graphql/resolvers.ts and lib/supabase.ts) — the same path a fresh clone
// with no Supabase project configured takes.

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/graphql", () => {
  it("executes a valid query against the real resolvers and returns seed data", async () => {
    const response = await POST(postRequest({ query: "{ projects { slug title } }" }));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.projects).toEqual(
      seedProjects.map((p) => ({ slug: p.slug, title: p.title }))
    );
  });

  it("resolves a single project by slug", async () => {
    const response = await POST(
      postRequest({
        query: "query($slug: String!) { project(slug: $slug) { slug title } }",
        variables: { slug: seedProjects[0].slug },
      })
    );

    const json = await response.json();
    expect(json.data.project).toEqual({
      slug: seedProjects[0].slug,
      title: seedProjects[0].title,
    });
  });

  it("returns a GraphQL error for a malformed query instead of throwing", async () => {
    const response = await POST(postRequest({ query: "{ notARealField }" }));

    const json = await response.json();
    expect(json.errors).toBeDefined();
    expect(json.errors.length).toBeGreaterThan(0);
  });

  it("sets permissive CORS headers on the response", async () => {
    const response = await POST(postRequest({ query: "{ projects { slug } }" }));

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe("Content-Type");
  });
});

describe("GET /api/graphql", () => {
  it("sets CORS headers even on non-POST requests", async () => {
    const response = await GET(new NextRequest("http://localhost/api/graphql"));

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

describe("OPTIONS /api/graphql", () => {
  it("returns a 204 preflight response with CORS headers and no body", async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe("Content-Type");
    expect(await response.text()).toBe("");
  });
});
