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
    summary: "Expense-splitting app for groups. Case study placeholder — swap in the real write-up.",
    description:
      "Placeholder description. Replace this with SplitEasy's actual architecture, the problem it solves, and the interesting engineering decisions — same treatment as the PipelineOps case study above.",
    stack: ["TBD"],
    repoUrl: "https://github.com/sahilkalgutkar/SplitEasy",
    liveUrl: null,
    featured: false,
  },
];
