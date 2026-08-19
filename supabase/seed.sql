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

drop policy if exists "projects are publicly readable" on projects;
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
  ),
  (
    'risk-signal-platform',
    'Risk Signal Platform',
    'Event-driven transaction risk-scoring platform on Java, Spring Boot, and Kafka — three services communicating only through events, with a full observability stack (Prometheus/Grafana, ELK) actually wired up and working.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['Java', 'Spring Boot', 'Apache Kafka', 'MySQL', 'Flyway', 'Micrometer', 'Prometheus', 'Grafana', 'Elasticsearch', 'Kibana', 'Filebeat', 'Testcontainers', 'Docker Compose', 'Kubernetes', 'GitHub Actions'],
    'https://github.com/sahilkalgutkar/risk-signal-platform',
    null,
    true
  ),
  (
    'order-processing-platform',
    'Order Processing Platform',
    'Event-driven order processing in Go — a REST API publishes to SNS, fanning out to two independent SQS consumers (MongoDB reservations, simulated notifications), with Terraform for the AWS ECS Fargate path.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['Go', 'PostgreSQL', 'MongoDB', 'AWS SNS', 'AWS SQS', 'Terraform', 'Docker Compose', 'Prometheus', 'GitHub Actions'],
    'https://github.com/sahilkalgutkar/order-processing-platform',
    null,
    true
  ),
  (
    'grpc-catalog-platform',
    'gRPC Catalog Platform',
    'Two Go gRPC services sharing a buf-generated proto contract — catalog-service serves one implementation over both native gRPC and REST via grpc-gateway, calling pricing-service internally over gRPC for quantity-based pricing.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['Go', 'gRPC', 'Protocol Buffers', 'grpc-gateway', 'buf', 'Docker Compose', 'GitHub Actions'],
    'https://github.com/sahilkalgutkar/grpc-catalog-platform',
    null,
    true
  ),
  (
    'kvforge',
    'kvforge',
    'In-memory key-value store engine built from scratch in Rust — a Redis-shaped RESP wire protocol, TTLs, an append-only log for crash durability, and a CLI client, on nothing but the standard library and tokio.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['Rust', 'Tokio', 'Async I/O', 'Custom Binary Protocol', 'GitHub Actions'],
    'https://github.com/sahilkalgutkar/kvforge',
    null,
    true
  ),
  (
    'digest-bot',
    'DigestBot',
    'RAG chatbot that answers questions over a rolling window of RSS/changelog feeds instead of a static, one-time-indexed corpus — built to work through the parts most RAG tutorials skip: freshness, dedup, and incremental indexing.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['Python', 'RAG', 'Vector Search', 'Anthropic', 'pytest', 'GitHub Actions'],
    'https://github.com/sahilkalgutkar/digest-bot',
    null,
    true
  ),
  (
    'portfolio',
    'Portfolio',
    'This site — a Next.js (App Router) portfolio backed by a self-hosted GraphQL API over Supabase, with a seed-data fallback so it runs fully offline with no external service configured.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['Next.js', 'Apollo Server', 'Supabase', 'Tailwind CSS', 'GitHub Actions', 'Vercel'],
    'https://github.com/sahilkalgutkar/portfolio',
    null,
    false
  ),
  (
    'ledger-strangler-platform',
    'Ledger Strangler Platform',
    'A legacy core-banking monolith strangled into microservices behind a YARP facade — .NET Core, Cassandra, RabbitMQ, and a deliberately honest gap where one domain hasn''t been migrated yet.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['C#', '.NET Core', 'YARP', 'PostgreSQL', 'Cassandra', 'RabbitMQ', 'Entity Framework Core', 'Serilog', 'ELK Stack', 'Docker Compose', 'Terraform', 'Kubernetes', 'ArgoCD', 'GitHub Actions'],
    'https://github.com/sahilkalgutkar/ledger-strangler-platform',
    null,
    true
  ),
  (
    'advisor-match-service',
    'Advisor Match Service',
    'An AI-based client-advisor matching API — pandas/numpy preprocessing, PyTorch/Hugging Face embeddings, and hybrid Elasticsearch search behind a Flask API, measured against a hand-labeled eval set.',
    'See lib/projects.ts for the full write-up, or edit this row directly.',
    array['Python', 'Flask', 'PyTorch', 'Hugging Face Transformers', 'pandas', 'NumPy', 'Elasticsearch', 'Docker Compose', 'Terraform', 'GitHub Actions'],
    'https://github.com/sahilkalgutkar/advisor-match-service',
    null,
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  stack = excluded.stack,
  "repoUrl" = excluded."repoUrl",
  "liveUrl" = excluded."liveUrl",
  featured = excluded.featured;
