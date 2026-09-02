import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { seedProjects } from "./projects";
import { buildSeedSql, seedSqlPath } from "../scripts/generate-seed";

const committed = readFileSync(seedSqlPath, "utf8");

describe("supabase/seed.sql", () => {
  // The live site reads from Supabase and only falls back to lib/projects.ts
  // when credentials are absent, so anything missing from this file is missing
  // from the deployed portfolio. The two were hand-maintained once and drifted
  // to 8 of 15 projects, all showing a placeholder description.
  it("matches what lib/projects.ts generates", () => {
    expect(committed).toBe(buildSeedSql());
  });

  it("carries every project, with its real description rather than a placeholder", () => {
    for (const p of seedProjects) {
      expect(committed).toContain(`'${p.slug}'`);
    }
    expect(committed).not.toContain("See lib/projects.ts for the full write-up");
  });

  it("is idempotent, so re-running it updates rows instead of failing on the primary key", () => {
    expect(committed).toContain("on conflict (slug) do update set");
  });
});
