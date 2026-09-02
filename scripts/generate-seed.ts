// Regenerates supabase/seed.sql from lib/projects.ts, which is the single
// source of truth for project content.
//
//   npm run seed:generate
//
// The two used to be maintained by hand and drifted badly: the live site was
// serving 8 of 15 projects, and every one of those showed the literal string
// "See lib/projects.ts for the full write-up" because the description column
// was seeded with a placeholder. A test asserts this file's output matches
// what is committed, so the drift cannot come back silently.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { seedProjects, type Project } from "../lib/projects.ts";

const q = (v: string) => `'${v.replace(/'/g, "''")}'`;
const arr = (v: string[]) => `array[${v.map(q).join(", ")}]`;

const row = (p: Project) =>
  `  (
    ${q(p.slug)},
    ${q(p.title)},
    ${q(p.summary)},
    ${q(p.description)},
    ${arr(p.stack)},
    ${q(p.repoUrl)},
    ${p.liveUrl === null ? "null" : q(p.liveUrl)},
    ${p.featured}
  )`;

export function buildSeedSql(projects: readonly Project[] = seedProjects): string {
  return `-- GENERATED FILE - do not edit by hand.
-- Regenerate with \`npm run seed:generate\` after changing lib/projects.ts,
-- which is the source of truth for project content.
--
-- Paste this into a Supabase project's SQL editor to publish the case studies.
-- Re-running it is safe: existing rows are updated in place and any project no
-- longer present in lib/projects.ts is removed, so the table ends up matching
-- the repository exactly.

create table if not exists projects (
  slug text primary key,
  title text not null,
  summary text not null,
  description text not null,
  stack text[] not null default '{}',
  "repoUrl" text not null,
  "liveUrl" text,
  featured boolean not null default false
);

alter table projects enable row level security;

drop policy if exists "projects are publicly readable" on projects;
create policy "projects are publicly readable"
  on projects for select
  using (true);

insert into projects (slug, title, summary, description, stack, "repoUrl", "liveUrl", featured)
values
${projects.map(row).join(",\n")}
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  stack = excluded.stack,
  "repoUrl" = excluded."repoUrl",
  "liveUrl" = excluded."liveUrl",
  featured = excluded.featured;

delete from projects
where slug <> all (${arr(projects.map((p) => p.slug))});
`;
}

// Resolved from the package root rather than import.meta.url, because under
// vitest import.meta.url is not a file:// URL and readFileSync rejects it.
// Both `npm run seed:generate` and vitest run from the package root.
export const seedSqlPath = resolve(process.cwd(), "supabase/seed.sql");

// Only write when run as a script. The drift test imports buildSeedSql, and an
// import that rewrote the file would make that test assert against its own
// output and pass no matter what.
if (process.argv[1] && resolve(process.argv[1]) === resolve(process.cwd(), "scripts/generate-seed.ts")) {
  writeFileSync(seedSqlPath, buildSeedSql());
  console.log(`wrote supabase/seed.sql (${seedProjects.length} projects)`);
}
