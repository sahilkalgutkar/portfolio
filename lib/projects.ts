export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  stack: string[];
  repoUrl: string;
  liveUrl: string | null;
  featured: boolean;
};

// Seed data. Used whenever SUPABASE_URL/SUPABASE_ANON_KEY aren't configured
// (see lib/supabase.ts), and as the row shape to load into the `projects`
// table once a real Supabase project is wired up.
export const seedProjects: Project[] = [
  {
    slug: "pipelineops",
    title: "PipelineOps",
    summary:
      "Job-monitoring and alerting platform for scheduled data pipelines — cron jobs, Airflow DAGs, batch ETL — that pages the team before a stakeholder notices a silent failure.",
    description: `Silent pipeline failures are one of the most common blind spots in data platform teams: a DAG stops firing, a cron job's host gets decommissioned, a script starts throwing on line one — and nobody finds out until a downstream report is wrong. PipelineOps closes that gap: jobs send a heartbeat on every run, and PipelineOps tracks expected intervals, flags jobs that go quiet or fail, and alerts over Slack, email, or SMS.

The system is a deliberately polyglot stack, each piece chosen for the job rather than for architectural padding: a Django + DRF core API owns the data model (jobs, users, alert rules); a separate Go + Gin ingestion service handles the high-throughput heartbeat write path independently of the Django app; a Celery worker/beat process polls the shared Postgres schema on an interval and fires alerts; and a React + TypeScript + Recharts dashboard gives teams a live view of job health. Auth moved from DRF token auth stored in localStorage to httpOnly session cookies with CSRF protection, closing an XSS-exposed credential-theft path. Deployment targets Kubernetes (Deployments, HPA, Ingress) with an AWS (RDS/ElastiCache/EKS) path documented.`,
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind",
      "Recharts",
      "Django",
      "Django REST Framework",
      "Go",
      "Gin",
      "PostgreSQL",
      "Redis",
      "Celery",
      "Docker Compose",
      "Kubernetes",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/PipelineOps",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "spliteasy",
    title: "SplitEasy",
    summary:
      "Splitwise-style expense splitter for roommates and trip groups — equal/exact/percentage splits, a greedy min-cash-flow settle-up algorithm, and recurring bills that post themselves on a schedule.",
    description: `Splitting group expenses fairly gets tedious fast once a trip or shared household has more than a couple of recurring costs — someone's tracking who paid for what in a group chat, and settling up means untangling a web of who-owes-who by hand. SplitEasy handles the whole loop: create a group, log expenses with equal, exact, or percentage splits, and get a settle-up plan that minimizes the number of payments needed to zero everyone out, instead of naively pairing every debtor with every creditor.

The backend is NestJS + Prisma + PostgreSQL, with short-lived JWT access tokens paired with rotating refresh tokens stored as SHA-256 hashes — never the raw token — so a database leak alone can't be replayed. The standout piece is the settle-up algorithm: a hand-rolled max-heap greedy solver rather than a brute-force optimal search (settling group debt in the fewest possible transactions is NP-hard), with tests that assert the actual invariant — net effect per user must equal their original balance — rather than pinning exact output, so they still hold if the algorithm's internals change later. Recurring expenses (rent, subscriptions) post themselves via a NestJS cron job with a bounded catch-up loop for missed runs.

The frontend is React + TypeScript + Vite + Tailwind, with TanStack Query for server state and a single axios interceptor handling silent access-token refresh — with single-flight de-duplication so concurrent 401s don't trigger a refresh stampede. Test coverage spans real unit tests for every service (Prisma mocked) plus a genuine end-to-end suite that drives the full HTTP stack — auth, groups, invites, expenses, balances, settle-up, recurring — against a real Postgres database, not mocks, wired into CI alongside the frontend's own Vitest suite covering the auth flow, the interceptor pipeline, and every API hook.`,
    stack: [
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Passport JWT",
      "React",
      "TypeScript",
      "Vite",
      "Tailwind",
      "TanStack Query",
      "React Hook Form",
      "Zod",
      "Jest",
      "Vitest",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/expense-splitter",
    liveUrl: null,
    featured: false,
  },
];
