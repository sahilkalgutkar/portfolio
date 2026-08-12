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
    'Expense-splitting app for groups. Case study placeholder — swap in the real write-up.',
    'Placeholder — replace with SplitEasy''s real architecture and description.',
    array['TBD'],
    'https://github.com/sahilkalgutkar/SplitEasy',
    null,
    false
  )
on conflict (slug) do nothing;
