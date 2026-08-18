import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("assetPath", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns the path unchanged when not building the static export", async () => {
    delete process.env.NEXT_PUBLIC_STATIC_EXPORT;
    const { assetPath } = await import("./asset-path");

    expect(assetPath("/favicon.svg")).toBe("/favicon.svg");
  });

  it("prefixes the path with /portfolio when building the static export", async () => {
    process.env.NEXT_PUBLIC_STATIC_EXPORT = "true";
    const { assetPath } = await import("./asset-path");

    expect(assetPath("/favicon.svg")).toBe("/portfolio/favicon.svg");
  });
});
