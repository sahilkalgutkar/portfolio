import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("GRAPHQL_ENDPOINT", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("defaults to an empty string when unset", async () => {
    delete process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
    const { GRAPHQL_ENDPOINT } = await import("./graphql-endpoint");

    expect(GRAPHQL_ENDPOINT).toBe("");
  });

  it("uses the env var when set", async () => {
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT = "https://example.vercel.app/api/graphql";
    const { GRAPHQL_ENDPOINT } = await import("./graphql-endpoint");

    expect(GRAPHQL_ENDPOINT).toBe("https://example.vercel.app/api/graphql");
  });
});
