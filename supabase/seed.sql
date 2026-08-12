-- Run this against a Supabase project's SQL editor once SUPABASE_URL /
-- SUPABASE_ANON_KEY are set. Row shape matches lib/projects.ts.

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

create policy "projects are publicly readable"
  on projects for select
  using (true);

insert into projects (slug, title, summary, description, stack, "repoUrl", "liveUrl", featured)
values
  (
    'pipelineops',
    'PipelineOps',
    'Job-monitoring and alerting platform for scheduled data pipelines — cron jobs, Airflow DAGs, batch ETL — that pages the team before a stakeholder notices a silent failure.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['React', 'TypeScript', 'Django', 'DRF', 'Go', 'Gin', 'PostgreSQL', 'Redis', 'Celery', 'Kubernetes'],
    'https://github.com/sahilkalgutkar/PipelineOps',
    null,
    true
  ),
  (
    'spliteasy',
    'SplitEasy',
    'Splitwise-style expense splitter for roommates and trip groups — equal/exact/percentage splits, a greedy min-cash-flow settle-up algorithm, and recurring bills that post themselves on a schedule.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['NestJS', 'Prisma', 'PostgreSQL', 'React', 'TypeScript', 'Vite', 'TanStack Query', 'Zod', 'Jest', 'GitHub Actions'],
    'https://github.com/sahilkalgutkar/expense-splitter',
    null,
    false
  )
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  stack = excluded.stack,
  "repoUrl" = excluded."repoUrl",
  "liveUrl" = excluded."liveUrl",
  featured = excluded.featured;
