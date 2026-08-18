import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createClientMock = vi.fn<(url: string, key: string) => { from: () => void }>(() => ({
  from: vi.fn(),
}));
vi.mock("@supabase/supabase-js", () => ({
  createClient: (url: string, key: string) => createClientMock(url, key),
}));

describe("getSupabaseClient", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockClear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null when SUPABASE_URL is not set", async () => {
    delete process.env.SUPABASE_URL;
    process.env.SUPABASE_ANON_KEY = "key";
    const { getSupabaseClient } = await import("./supabase");

    expect(getSupabaseClient()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns null when SUPABASE_ANON_KEY is not set", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    delete process.env.SUPABASE_ANON_KEY;
    const { getSupabaseClient } = await import("./supabase");

    expect(getSupabaseClient()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("creates a client once both env vars are set", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "key";
    const { getSupabaseClient } = await import("./supabase");

    const client = getSupabaseClient();

    expect(client).not.toBeNull();
    expect(createClientMock).toHaveBeenCalledWith("https://example.supabase.co", "key");
  });

  it("caches the client across calls instead of recreating it", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "key";
    const { getSupabaseClient } = await import("./supabase");

    const first = getSupabaseClient();
    const second = getSupabaseClient();

    expect(first).toBe(second);
    expect(createClientMock).toHaveBeenCalledTimes(1);
  });
});
