import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

// Returns null when SUPABASE_URL / SUPABASE_ANON_KEY aren't set, so callers
// (see graphql/resolvers.ts) can fall back to lib/projects.ts seed data
// instead of erroring before a real Supabase project exists.
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  if (!cachedClient) {
    cachedClient = createClient(url, key);
  }

  return cachedClient;
}
