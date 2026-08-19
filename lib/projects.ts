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
    slug: "raftlite",
    title: "raftlite",
    summary:
      "The Raft consensus algorithm implemented from scratch in Go — elections, log replication, snapshots, dynamic membership — behind a replicated key-value store you can run, break, and watch recover.",
    description: `I had already built a single-node storage engine (kvforge) and several services that assume a database stays up. raftlite is the question those projects let me skip: what happens when three machines have to agree, and one of them is dead, or lying, or was unreachable for the last ten minutes and doesn't know it yet. No hashicorp/raft, no etcd/raft — importing the algorithm would have left nothing to build — and no third-party dependencies at all: the wire codec, the write-ahead log and the metrics registry are all hand-written.

The consensus core is a pure state machine that owns no sockets, no files and no clock. Time arrives through Tick, the network through Step, and everything it wants done leaves through Ready. That split is what makes the hard part testable: elections, log repair, snapshot installation and membership changes are driven from ordinary table tests against a simulated network with fixed message ordering, so a failure reproduces on the first try rather than one run in fifty. On top of it sits a runtime that performs side effects in the order Raft's safety proof requires — persist, then send, then apply — a crash-safe WAL that recovers cleanly from a write cut in half, an HTTP API where a follower redirects rather than proxies so clients learn the topology, and a raftctl CLI that finds the leader for you.

Beyond the base algorithm it implements pre-vote and a leader lease, so a node that was partitioned away cannot depose a healthy leader on its return; the current-term no-op that makes a new leader's commit index trustworthy; single-server membership changes with non-voting learners so a cold replica cannot stall writes; and linearizable reads via ReadIndex, where a deposed leader refuses to answer rather than serving stale state.

The chaos suite runs real nodes against real directories through random crashes, restarts and partitions, asserting one invariant: an acknowledged write is never lost. Around five thousand acknowledged writes survive forty rounds of random failures. Two bugs surfaced only once real processes had to talk over real sockets — a message field threaded through the algorithm but never encoded, and a lost snapshot leaving a follower stranded forever — both now fixed with tests that fail without the fix.`,
    stack: [
      "Go",
      "Raft",
      "Distributed Systems",
      "Consensus",
      "Custom Binary Protocol",
      "Write-Ahead Log",
      "Prometheus",
      "Docker Compose",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/raftlite",
    liveUrl: null,
    featured: true,
  },
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
  {
    slug: "risk-signal-platform",
    title: "Risk Signal Platform",
    summary:
      "Event-driven transaction risk-scoring platform on Java, Spring Boot, and Kafka — three services communicating only through events, with a full observability stack (Prometheus/Grafana, ELK) actually wired up and working.",
    description: `Three Spring Boot services form one asynchronous pipeline: transaction-api accepts a transaction over REST and publishes it to Kafka; risk-scoring-service scores it against a set of independent, Spring-collected risk rules (amount threshold, merchant/account country mismatch, watchlisted country) and publishes the result; alert-service raises and dispatches an alert for anything above threshold. No service calls another directly — the only coupling is the event contracts in a shared module.

Each service owns its own MySQL database and Flyway migration history rather than sharing one schema — a real bug caught while standing the stack up in Docker: with all three pointed at one database, the second and third services to boot failed Flyway's checksum validation, because every service's migration independently started at V1 with different SQL. All three follow the same durable-write-then-best-effort-publish shape (persist first, publish after, track publish failure in a column) with idempotent handling per transaction ID so a redelivered event is a no-op rather than a double-score or double-alert. A failed notification dispatch in alert-service retries on Kafka-native retry topics with backoff via \`@RetryableTopic\` before landing on a dead-letter topic — verified in an integration test that forces the failure and asserts the event actually reaches the DLT, not just that retry fires.

Observability is a working system, not a checkbox: a custom Micrometer counter (\`risk_scores_total\`, tagged by risk level) feeds the main panel of a provisioned Grafana dashboard, and structured JSON logs from all three services are shipped through Filebeat into Elasticsearch, queryable in Kibana. Real integration tests spin up actual MySQL and Kafka via Testcontainers rather than mocking either, kept separate from the fast unit/web-slice suite via the Surefire/Failsafe split (\`mvn test\` vs \`mvn verify\`) so the everyday edit-test loop never needs Docker. Kubernetes manifests cover both a local kind cluster and the EKS path (RDS, MSK, OpenSearch).`,
    stack: [
      "Java",
      "Spring Boot",
      "Apache Kafka",
      "MySQL",
      "Flyway",
      "Micrometer",
      "Prometheus",
      "Grafana",
      "Elasticsearch",
      "Kibana",
      "Filebeat",
      "Testcontainers",
      "Docker Compose",
      "Kubernetes",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/risk-signal-platform",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "order-processing-platform",
    title: "Order Processing Platform",
    summary:
      "Event-driven order processing in Go — a REST API publishes to SNS, fanning out to two independent SQS consumers (MongoDB reservations, simulated notifications), with Terraform for the AWS ECS Fargate path.",
    description: `Three independently deployable Go services built around one integration pattern: order-service validates and persists an order to Postgres, then publishes an OrderCreated event to SNS. Two independent SQS subscribers pick it up — inventory-service applies a reservation rule and writes the result to MongoDB, notification-service logs a simulated notification — neither aware the other exists. One event, two consumers, no coordination between them.

The handler layer depends on OrderStore/EventPublisher interfaces it defines itself rather than the concrete Postgres/SNS types, so the handler tests run against in-memory fakes with zero network calls, including a test asserting the specific behavior that a publish failure still returns 201 — the order is durable even if the event isn't, with the real gap (no reconciliation job for that case) documented rather than hidden. Domain logic (order validation, the reservation rule) is pure functions, table-tested independently of any transport or infrastructure. SNS→SQS subscriptions use raw message delivery so consumers unmarshal the event directly, and both consumers only delete their SQS message after their write succeeds, so a failed write leaves the message to retry rather than silently dropping it.

Terraform (a reusable ECS Fargate service module plus SNS/SQS/least-privilege-IAM wiring) documents the AWS deployment path; Docker Compose with LocalStack standing in for SNS/SQS is what actually runs locally. CI runs a per-service matrix — vet, build, race-detector tests, Docker build — for all three services independently, matching how they'd deploy as separate ECS services.`,
    stack: [
      "Go",
      "PostgreSQL",
      "MongoDB",
      "AWS SNS",
      "AWS SQS",
      "Terraform",
      "Docker Compose",
      "Prometheus",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/order-processing-platform",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "grpc-catalog-platform",
    title: "gRPC Catalog Platform",
    summary:
      "Two Go gRPC services sharing a buf-generated proto contract — catalog-service serves one implementation over both native gRPC and REST via grpc-gateway, calling pricing-service internally over gRPC for quantity-based pricing.",
    description: `catalog-service and pricing-service demonstrate two things my other (Kafka/REST-based) projects don't: real service-to-service gRPC, and serving a single handler implementation over two transports at once. catalog-service's ProductService is registered directly against grpc-gateway's mux in-process (RegisterProductServiceHandlerServer, not the from-endpoint variant), so a REST request never makes a network hop back into the service's own gRPC port — one set of business logic, no self-loopback. GetProduct calls pricing-service's internal-only PricingService over gRPC for a quantity-based price, but only when a quantity is actually given, rather than always calling it and special-casing a zero-quantity response — one fewer network call on the common path, and one fewer way for the no-pricing case to accidentally depend on pricing-service being up.

The two services share generated proto code from a single gen/ Go module (buf generate, buf.gen.yaml) instead of each vendoring its own copy, so the wire contract can't drift between them. catalog-service's pricing client forwards the caller's x-request-id onto the outgoing call, so pricing-service's own logging interceptor can correlate both services' logs for one end-to-end request. Tests for both services spin up the gRPC server on an in-memory bufconn listener rather than a real socket; catalog-service's tests go one step further and run a fake PricingServiceServer the same way, so GetProduct's pricing-call logic is exercised against a real gRPC call with a controllable response, not a mocked Go interface.`,
    stack: [
      "Go",
      "gRPC",
      "Protocol Buffers",
      "grpc-gateway",
      "buf",
      "Docker Compose",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/grpc-catalog-platform",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "kvforge",
    title: "kvforge",
    summary:
      "In-memory key-value store engine built from scratch in Rust — a Redis-shaped RESP wire protocol, TTLs, an append-only log for crash durability, and a CLI client, on nothing but the standard library and tokio.",
    description: `kvforge is a key-value store built from the network layer down rather than a wrapper around an existing engine: the storage core, the wire protocol clients speak to it, and the durability layer that lets it survive a crash, all written from scratch in Rust.

The AOF durability format reuses the wire protocol itself — every logged write is encoded exactly the way it'd be sent over the network, so the same streaming decoder that parses TCP input also parses the log on replay. That gets a property a bespoke log format would need to earn separately for free: a truncated final entry from a crash mid-write decodes as "incomplete" rather than garbage, so replay stops cleanly at the last whole command. Expiry is lazy rather than swept by a background thread — a key past its TTL is skipped and removed the next time something touches it, trading a small amount of stale memory for one fewer moving part to get wrong.

The async tokio TCP server handles concurrent connections against one shared store, verified end-to-end (not just unit-tested): a real server writes over a real socket, gets killed, and a second server boots against the same log file and replays the data back over a fresh connection. kvforge-cli, the REPL and one-shot client, never re-implements command parsing — it builds a request from raw tokens and hands it to the exact same parser the server calls on every inbound TCP request, so client and server can't quietly disagree about what a command means.`,
    stack: [
      "Rust",
      "Tokio",
      "Async I/O",
      "Custom Binary Protocol",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/kvforge",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "digest-bot",
    title: "DigestBot",
    summary:
      "RAG chatbot that answers questions over a rolling window of RSS/changelog feeds instead of a static, one-time-indexed corpus — built to work through the parts most RAG tutorials skip: freshness, dedup, and incremental indexing.",
    description: `Most RAG tutorials index a fixed set of documents once and stop there. DigestBot works through the parts they skip: keeping the index fresh as new articles arrive, deduping across re-polls, and weighting retrieval toward what's recent instead of just what's semantically closest.

The pipeline is five stages: ingest polls RSS feeds, extracts readable article text, and dedupes by GUID/URL; index chunks articles, embeds them, and stores them in a local vector DB with published_at and source metadata; retrieve blends vector similarity with a recency-decay weight, so a fresher, slightly-less-similar chunk can outrank an older, closer one; generate answers questions with forced citations back to source articles, and says so explicitly when retrieval comes back empty instead of guessing; eval runs a hand-built question/answer set to measure retrieval recall and citation correctness against the current index, rather than trusting it by feel.

Every Anthropic/model call in the test suite is mocked, so the 34-test suite runs with zero API keys and zero network calls — CI can verify the retrieval and citation logic without ever touching a live model.`,
    stack: [
      "Python",
      "RAG",
      "Vector Search",
      "Anthropic",
      "pytest",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/digest-bot",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "portfolio",
    title: "Portfolio",
    summary:
      "This site — a Next.js (App Router) portfolio backed by a self-hosted GraphQL API over Supabase, with a seed-data fallback so it runs fully offline with no external service configured.",
    description: `This is the site you're looking at right now. It's a Next.js App Router app serving project data through an Apollo Server route handler backed by Supabase — but Supabase is optional, not required: when SUPABASE_URL/SUPABASE_ANON_KEY aren't configured, the same GraphQL resolvers fall back to the seed data in lib/projects.ts (this very file), so the site runs fully offline with zero external services wired up.

That seed data doubles as the row shape to load into Supabase's projects table once a real database is connected, so the fallback path and the real path share one schema instead of drifting into two different shapes over time. The site deploys two ways from one codebase: a normal Vercel deployment with the live GraphQL API, and a static GitHub Pages mirror that can't run /api/graphql at all and so is built entirely against the seed-data fallback.`,
    stack: [
      "Next.js",
      "Apollo Server",
      "Supabase",
      "Tailwind CSS",
      "GitHub Actions",
      "Vercel",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/portfolio",
    liveUrl: null,
    featured: false,
  },
  {
    slug: "ledger-strangler-platform",
    title: "Ledger Strangler Platform",
    summary:
      "A legacy core-banking monolith strangled into microservices behind a YARP facade — .NET Core, Cassandra, RabbitMQ, and a deliberately honest gap where one domain hasn't been migrated yet.",
    description: `A legacy monolith starts out owning two domains in one process against one Postgres database: Accounts and Statements. A YARP-based Gateway sits in front as the strangler facade — the single place that decides, per request path, which side of the migration a request belongs on. Account CRUD and balance adjustments are already strangled off to a new Cassandra-backed AccountsService; Statements hasn't been migrated yet, so those requests still fall through to the legacy monolith, which still reads its own copy of account data to generate them.

That's a deliberate, honest gap rather than a glossed-over one: an account created after the cutover has no statement history in the legacy database, because Statements is still reading local state the new service never writes to. Real strangler migrations live with exactly this kind of transitional inconsistency for however long it takes to reach the next domain. NotificationsService is the first thing that only exists because of the migration — it consumes an AccountBalanceChangedEvent off a durable RabbitMQ topic exchange and turns each one into a notification record, reacting to an event the old code was never able to produce.

Balance updates against Cassandra go through a lightweight transaction (compare-and-swap on the current balance) with a bounded retry loop, since Cassandra has no cross-row ACID transactions to lean on — verified under real concurrent writers, not just the happy path. Every service ships structured JSON logs via Serilog into a shared Filebeat → Logstash → Elasticsearch → Kibana pipeline. Terraform provisions the target Azure environment (AKS, ACR, Log Analytics); an ArgoCD Application watches the Kubernetes manifests directly, so a cluster's state is pulled from git instead of pushed by hand. Shipped with a real git-flow history — feature branches merged via PR, a tagged release, and a hotfix for a routing gap found while testing locally, not one commit dumped on main.`,
    stack: [
      "C#",
      ".NET Core",
      "YARP",
      "PostgreSQL",
      "Cassandra",
      "RabbitMQ",
      "Entity Framework Core",
      "Serilog",
      "ELK Stack",
      "Docker Compose",
      "Terraform",
      "Kubernetes",
      "ArgoCD",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/ledger-strangler-platform",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "advisor-match-service",
    title: "Advisor Match Service",
    summary:
      "An AI-based client-advisor matching API — pandas/numpy preprocessing, PyTorch/Hugging Face embeddings, and hybrid Elasticsearch search behind a Flask API, measured against a hand-labeled eval set.",
    description: `I built this to work back through an AI-based matching system the way I first built one during an internship — pairing clients with the right subject-matter expert from free text describing what they need — except this time with real infrastructure behind it instead of a notebook. A pandas/numpy pipeline cleans a raw CSV of advisor profiles (inconsistent whitespace, years-of-experience entered as "12 yrs" or "N/A", the same advisor entered twice under a different id); a small sentence-transformers model turns each bio into a 384-dim embedding with a real PyTorch forward pass; Elasticsearch indexes the result and matches with hybrid search — kNN over the embedding blended with BM25 in the same request — rather than pure vector search, since a client's query might share vocabulary with an advisor's bio without being semantically identical, or vice versa.

A hand-labeled eval harness measures whether any of this actually works: 10 hand-paraphrased queries against the seed dataset, checking whether the intended advisor shows up in the top-k results and where — 90% hit@5, MRR 0.90 on the current dataset, a real measured number from the test suite rather than an assumed one. Smoke-testing the real docker-compose stack (not just the test suite) caught a genuine race condition: two Gunicorn workers both trying to create the Elasticsearch index on boot, with the loser crashing on a resource_already_exists_exception. Terraform provisions the target GCP environment — Artifact Registry and a Cloud Run service sized for PyTorch and the embedding model.`,
    stack: [
      "Python",
      "Flask",
      "PyTorch",
      "Hugging Face Transformers",
      "pandas",
      "NumPy",
      "Elasticsearch",
      "Docker Compose",
      "Terraform",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/advisor-match-service",
    liveUrl: null,
    featured: true,
  },
];
