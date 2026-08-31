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
    slug: "modelforge",
    title: "modelforge",
    summary:
      "A model-serving platform in Go — a pure-Go XGBoost scorer verified against XGBoost itself, dynamic request batching worth 43x throughput, canary and shadow routing keyed per entity, and PSI drift detection over a sliding window.",
    description: `I wanted the layer *underneath* the machine-learning projects I had already built, the one that decides which version of a model answers a request, groups concurrent requests into a single forward pass, and notices when the inputs have stopped looking like the data the model was trained on. So modelforge is a serving platform rather than a model: a registry, a scorer, a router, and a drift monitor.

I wrote the scorer rather than shelling out to a Python process, and rather than binding to libxgboost through cgo. The reason is that everything the serving layer offers — rolling back to a previous version, shadowing a candidate against production, reproducing a prediction somebody is disputing — is only true if the artifact behind a version cannot change. A C++ shared library on that path would mean the artifact's behaviour depended on which libxgboost the host happened to have, and cross-compiling the static binary would stop working. Pure Go keeps CGO_ENABLED=0 and makes the artifact the only thing that decides what a version predicts.

The correctness of that scorer is established by differential testing rather than by assertion. A Python script trains seven models covering binary logistic, missing values, squared-error regression, Poisson, multi-class softprob and softmax, and records the margins and probabilities XGBoost itself produces for a fixed input matrix; the Go scorer has to reproduce both. Margins are compared as well as probabilities on purpose, because a sigmoid squashes margins of 12 and 14 to 0.999994 and 0.999999 — a probability-only comparison would pass with a materially wrong margin on exactly the confident rows a threshold depends on most.

That test found a bug I would never have found by reading the format. XGBoost compares a feature against a split threshold in float32, and writes split_conditions to JSON at float32 precision, so a threshold reads back as -0.3775961 while the feature value that produced it — a float32 widened to float64 — is -0.37759611010551453. Compared as float64 those differ and the row goes left; compared as float32 they are the same number, the comparison is false, and it goes right, which is what XGBoost does. It only matters for a row sitting exactly on a threshold, but thresholds are chosen from training values, so rows land on them constantly: one row in 64 in the binary fixture, seven in the regression one. The symptom is the worst kind there is — predictions correct for about 99% of traffic and quietly wrong for the rest, with nothing downstream able to tell. The second finding was that base_score lives in two different spaces, prediction space for single-output models and margin space for multi-class, which is why the binary fixture deliberately uses a base_score other than 0.5: logit(0.5) is zero, and would make an intercept applied in the wrong space look correct.

Batching is where the throughput comes from. Scoring one row of a boosted model is about a microsecond, while the HTTP handling, decoding, routing and metrics around it are considerably more, so under concurrent load it is the per-call overhead and not the arithmetic that sets throughput. Measured against a scorer with 200 microseconds of fixed per-call cost and 320 concurrent callers, batch size 1 costs 59.5µs/op and batch size 64 costs 1.38µs/op — a 43x difference. The design decision that matters is that the batching window opens when the first request of a batch arrives rather than on a fixed tick. A ticker looks equivalent and is not: a request arriving just after a tick waits a full interval, the tick fires on an empty queue when traffic is light, and the latency added belongs to the clock rather than to the request. Opening it per batch makes the delay a genuine ceiling, so an idle system answers a lone request after exactly one window and a busy one dispatches full batches without waiting at all. Requests whose caller has already given up are dropped before scoring rather than after, because the load that makes clients time out is exactly when the wasted capacity matters, and a batch is scored under its own context rather than any caller's, so one client cancelling does not fail the unrelated requests batched with it.

Rolling a model out is meant to be gradual and reversible. Canary assignment is a deterministic hash of a caller-supplied entity key, so the same user always reaches the same version while the policy is unchanged — if a user flipped between control and candidate from request to request, every per-user metric would mix both models and the experiment would measure nothing. The model name is mixed into that hash too, because otherwise an entity in the canary bucket for one model would be in the canary bucket for every model, correlating experiments that are supposed to be independent. A shadow version receives a copy of every request on its own goroutine with its own context; inheriting the request's context would kill the shadow the moment the handler returned, which is to say on nearly every request, and running it inline would put the candidate's latency directly into production's. And a rollout guard removes a version whose error rate crosses a threshold, but only after a minimum sample, because the first request to fail puts a version at a 100% error rate and the start of a rollout is the smallest sample there is. It sets the weight to zero rather than deleting the route, so an operator can see that a version was pulled rather than guessing why it is absent, and it will never remove the last version receiving traffic: turning "this version is failing" into "this model serves nothing" is strictly worse, because there is nothing left to fall back to.

Drift detection is PSI over quantile bins, computed on a sliding ring of bin counts rather than retained samples, so memory depends on the window and the bin count rather than on how busy the service is — keeping raw values would make watching a service more expensive the busier it got, which is exactly backwards. Writing the test for empty bins found a second real bug: bins are half-open, so a quantile edge equal to the smallest sample creates a first bin no value can ever fall into, whose expected proportion is zero and whose PSI term is undefined. That is not theoretical — it is the ordinary shape of any feature that is zero for most rows, which is most counts and most amounts. Missing values are counted separately instead of binned, because a feature that becomes 40% NaN is a serious problem and folding those rows into a bucket would both hide it and shift the value distribution as the missing rate changed, reporting a broken pipeline as a change in the values.

The suite requires a real Postgres and fails rather than skips when it is missing, because a suite that skips its own dependency keeps CI green while testing nothing, and CI greps its own output for skip markers to make sure that cannot regress silently. A second CI job reinstalls XGBoost, regenerates the fixtures from scratch and re-runs the parity tests, comparing predictions rather than files — retraining produces different trees, and the claim under test is that the Go scorer agrees with XGBoost, not that training is reproducible. Coverage is 91.6% of internal packages, and every command and number in the README, including the drift table and the batching figures, was run against a live server before being written down. So is the list of known limitations: only gbtree models, no eviction so the working set must fit in memory, drift on the first output only for multi-class models, a guard that catches errors rather than quality, static tokens with no revocation list, a rate limit keyed on client address so a NAT shares one bucket, and no volumetric defence, which still belongs at a gateway.

The API is authenticated with scoped bearer tokens, and the two decisions I would defend in review are about what the server stores and when it refuses to start. It holds SHA-256 digests rather than the tokens themselves, hashed with plain SHA-256 rather than bcrypt or argon2 — password hashes are slow to make brute force expensive over the small guessable space human-chosen passwords occupy, and a 256-bit random token has no such space, so a slow hash would buy nothing and would put its cost on every request. The comparison is timing-safe because the caller's guess is hashed before the lookup: the attack a constant-time compare stops is an early-exit byte-by-byte comparison leaking how many leading bytes were right, and hashing first means one flipped bit changes the whole key, so a near miss and a wild miss are indistinguishable. I wrote a constant-time compare after that lookup and then removed it, because it compared a value against itself and only looked like diligence. Starting with no tokens and no explicit opt-out is refused rather than defaulted to open, since that failure is silent in the worst way — the server serves, looks healthy, and has an open control plane. Three scopes keep the credential shipped to a high-volume caller able to score and only score. Adding all this introduced a bug the smoke run caught: audit logging keyed on the HTTP method, and scoring is a POST, so every prediction was recorded as an authorised change — millions of entries a day burying the few that matter. It keys on the admin scope now, with a regression test asserting predictions produce no audit lines.

Clients that keep failing authentication are throttled, and the interesting part of that was scoping the claim. It is not brute-force protection — the tokens are 256 bits of randomness, so a rate limit does not change that arithmetic, and saying otherwise would be the theatre worth avoiding. What it bounds is the cost of failures: every rejection runs the HTTP stack, a hash, and a log line full of attacker-controlled data, which unbounded is a free way to fill a disk and bury whatever an operator needs during an incident. Measured live, two hundred requests with a bad token now produce six log lines instead of two hundred. I first checked the limit before authenticating, which is marginally cheaper, and writing the test made the flaw obvious: an address is a shared resource, so behind a NAT that refuses a correct credential because a neighbour is failing — an outage for somebody who did nothing wrong, bought with a saving too small to measure. Authentication runs first now and a valid credential is never throttled. The tracking table is capped, sweeps refilled buckets, and fails open when saturated, because refusing to track a new client and denying it instead would let an attacker fill the table and lock everybody out — the limiter becoming the outage it exists to prevent.`,
    stack: [
      "Go",
      "XGBoost",
      "Model Serving",
      "MLOps",
      "Canary Deployments",
      "Shadow Traffic",
      "Dynamic Batching",
      "Drift Detection",
      "PSI",
      "PostgreSQL",
      "Prometheus",
      "Grafana",
      "Content-Addressed Storage",
      "Differential Testing",
      "Bearer Token Auth",
      "RBAC Scopes",
      "Rate Limiting",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/modelforge",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "queryforge",
    title: "queryforge",
    summary:
      "A columnar SQL query engine written from the wire up in Rust — hand-written lexer, parser and binder, a cost-based optimiser, a vectorised execution engine, and its own on-disk format whose zone maps let a selective query skip most of the file without reading it.",
    description: `I wanted to know what actually happens between typing a SQL query and getting rows back, so I wrote every stage of it: the lexer, the parser, the binder, a cost-based optimiser, a vectorised execution engine, and the columnar file format underneath all of it. Nothing is delegated. There is no sqlparser, no DataFusion, no Arrow, no Parquet — in fact no external crates at all, the whole workspace builds against the standard library — because an engine that wraps someone else's parser and someone else's columnar format has skipped the two places where the interesting decisions live.

The format is where most of the performance comes from. A \`.qfc\` file groups column chunks into row groups and puts a footer at the end holding, for each chunk, its byte range, its encoding, and a zone map: the min, max, null count and distinct count of the values it holds. The footer's length is the last field before the trailing magic, so a reader seeks to \`len - 8\`, learns the entire layout in one more seek, and has not touched a byte of data yet. That is what turns predicate pushdown from a plan rewrite into skipped I/O — a query whose predicate falls outside a row group's range never reads that group's chunks, and a query touching two of forty columns reads two chunks per group. Measured on 500,000 rows in 8,192-row groups, a selective range comes back 155x faster than the same query on the unoptimised plan, reading 3 row groups out of 62; a full aggregate is 4.5x faster on projection pushdown alone.

Each chunk chooses its own encoding by measuring the data rather than guessing from its type, because the right answer changes between row groups of the same column — an order_status column can hold two distinct values in one group and forty in the next. Two cheap signals decide it: average run length picks RLE, a low distinct-to-rows ratio picks a dictionary, and anything else stays plain. On the test fixtures RLE comes out more than 10x smaller than plain on a sorted column and a dictionary 4x smaller on a shuffled four-value string column, and both ratios are asserted in the suite rather than estimated.

The optimiser runs four rules, and each has to preserve not just the rows a plan produces but the schema it produces them in — the second half is what makes them composable, since a rule may move a filter or reorder a join but the node above it must not be able to tell. The decisions I would defend in review are the ones where the rule deliberately declines to fire. Constant folding stops at division by zero and integer overflow, because folding those would let the plan-time answer differ from the run-time one, which is worse than not folding. A predicate is never pushed into the padded side of an outer join, since pushing a condition on the right side of a LEFT JOIN deletes rows that should have come back NULL-padded. Join reordering prefers a relation that has a join key to what is already joined over a smaller unrelated one, because an accidental cross product is not something a later choice recovers from, and it wraps the reordered join in a projection restoring the original column order so nothing above notices. Projection pushdown narrows every scan and renumbers every expression above it, which is the part that has to be exactly right — getting it wrong reads the wrong column and reports a plausible wrong answer.

Execution is pull-based, which is not a style preference: it is what lets a LIMIT stop a scan after the first row group instead of running it to completion and discarding the rest. Expression kernels take whole columns with the operator resolved once outside the loop, and comparing a column against a literal has its own path so no constant column is materialised. Sorting has three modes — top-k when it feeds a LIMIT, so memory is bounded by the limit rather than the table; in-memory when everything fits; and an external merge over spilled runs when it does not, with a test asserting both paths return identical output because the answer must not depend on whether the input fitted in memory. The hash join builds the smaller side for inner joins, but on an outer join the choice is forced: the side that may be NULL-padded has to be the one that can be scanned for non-matches at the end.

Three-valued logic is implemented properly throughout, because getting it wrong silently changes which rows come back rather than failing loudly. \`false AND NULL\` is false, since the row cannot match whatever the unknown turns out to be. \`5 IN (1, NULL)\` is unknown rather than false, since the NULL might have been 5. A NULL join key never matches, including against another NULL. \`sum\` over no rows is NULL rather than zero. And \`x / 0\` yields NULL instead of aborting, because one bad row should not kill a scan of a million.

The benchmark measures the optimiser instead of asserting it: every query runs twice against the same data in the same process, once on the bound plan and once on the optimised one, and the run fails outright if the two disagree on the row count — a flattering speedup from a wrong answer is worse than no number at all. Running the example script also found a real bug the 43 end-to-end tests had missed: a LEFT JOIN with a non-equality in its ON clause applied that condition after deciding which rows had matched, so a preserved row whose only candidate failed the condition vanished instead of coming back padded. Every join test either had no residual condition or was an inner join, which is the argument for having an example you actually run. 542 tests at 97% line coverage, and the README records that bug and two others rather than quietly fixing them.`,
    stack: [
      "Rust",
      "SQL",
      "Query Optimisation",
      "Columnar Storage",
      "Vectorised Execution",
      "Zone Maps",
      "Cost-Based Planning",
      "External Sort",
      "Hash Join",
      "Zero Dependencies",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/queryforge",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "tenant-operator",
    title: "tenant-operator",
    summary:
      "A Kubernetes operator that turns \"create a tenant\" into something the cluster API understands — a custom resource, a reconcile loop that provisions a namespace with quota and network isolation, and admission webhooks that catch bad specs before they become bad conditions.",
    description: `I have deployed onto Kubernetes for years, and every other project in this portfolio treats it the same way: as a place to put containers. tenant-operator goes the other direction. It is a controller that extends the cluster — a custom resource, a reconcile loop, admission webhooks, a finalizer — so that "create a tenant" becomes a thing the Kubernetes API itself knows how to do. A \`Tenant\` is one customer's slice of a cluster: eleven lines of YAML become a namespace with pod-security enforcement, a resource quota sized to the customer's tier, a default-deny network policy, a generated API key, a Deployment and a Service. The operator then keeps all of it that way.

Ordering inside the loop is a correctness property rather than a style choice, and I wrote it in the order the failure modes demand. The finalizer is taken and persisted before anything is created, because a crash between "made a namespace" and "recorded that I own it" orphans the namespace with nothing left pointing at it. The quota and the network policy go in before the workload, because if the pods came up first there would be a window in which a tenant ran unquota'd and reachable from every other namespace — a small window, and an entirely avoidable one. And the Deployment is read back before anything is reported, because otherwise a Tenant would claim Ready the moment its Deployment object existed, whether or not a single pod ever started.

I used a finalizer even though owner references would already delete the same objects, and the reason is what deletion is supposed to mean. Garbage collection is asynchronous and unordered: the Tenant would disappear from the API while its namespace was still terminating, and anything scripted around \`kubectl delete tenant\` would be racing the cleanup. With the finalizer, the object survives until the namespace has genuinely left the API, and reports Terminating throughout — a tenant that still reads as Ready halfway through its own teardown is actively misleading. Every write also goes through a single apply helper that refuses to adopt an object this operator did not create. Adoption looks convenient right up to the first time an operator silently rewrites a namespace another team was using, and the teardown path inherits the same rule, so a tenant pointed at somebody else's namespace will never delete it.

Tiers are a table rather than branches in the reconcile loop: replica bounds, per-replica CPU and memory, namespace quota ceilings and delete protection all derive from one map, so adding a tier is a table entry and a test case. The quota deliberately covers the tier's replica ceiling plus one, so a tenant sitting at its maximum can still roll out a new version instead of deadlocking against its own quota mid-deploy. An unrecognised tier falls back to the most restrictive policy, because the CRD's enum makes that unreachable through the API — if one ever appears it came from a bug, and the safe answer to a bug is the smallest slice of the cluster rather than the largest. The credentials secret is the one deliberately non-idempotent piece: the API key is generated only if there is not one already, since rotating it every pass would still converge and would also pull the credential out from under a running workload every time anything about the tenant changed.

The admission webhooks exist so that a mistake surfaces at apply time rather than as a condition someone has to go looking for. A \`:latest\` image is rejected outright — a mutable tag means the spec no longer describes what is running, and no amount of reconciliation can detect or correct that drift. Replicas above the tier ceiling are rejected rather than silently clamped, because running fewer replicas than the manifest says is invisible until it matters. The namespace is immutable, since moving it would orphan everything already provisioned. Reserved namespaces are refused, because the teardown path deletes the namespace it owns and a typo there would take out kube-system. And deleting an enterprise tenant requires a confirmation annotation, since that delete destroys somebody's data. The controller still applies its own defaults, so a cluster whose webhook is temporarily unavailable converges rather than reconciling an empty tier against a nil replica count.

The control loop is tested against a real API server. envtest starts an actual kube-apiserver and etcd, and the suite drives the real reconciler through it: provisioning with guard rails, drift correction, tier upgrades, suspension, teardown, and the refusal to adopt. A fake client would happily accept objects a real API server rejects — an owner reference from a cluster-scoped Tenant to a namespaced Deployment, a second update to a Deployment whose immutable selector had been quietly rewritten — and those are exactly the mistakes worth catching. The drift cases are the ones that prove this is a controller rather than a provisioning script: hand-scale the Deployment, edit its image, delete the Service outright, and all three come back. envtest runs no kubelet and no deployment controller, so the tests stand in for those explicitly rather than papering over the gap, which keeps it obvious which behaviour belongs to the operator and which belongs to the cluster.`,
    stack: [
      "Go",
      "Kubernetes",
      "controller-runtime",
      "Custom Resource Definitions",
      "Admission Webhooks",
      "Finalizers",
      "Kustomize",
      "cert-manager",
      "envtest",
      "Distroless",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/tenant-operator",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "trust-platform",
    title: "trust-platform",
    summary:
      "A multi-tenant identity and entitlements platform written from the protocol up — an OpenID Connect provider, a Zanzibar-style relationship-based authorization service, and an audit log that cannot be quietly edited.",
    description: `I build identity and entitlements infrastructure at work, and I wanted a version of that I could actually hand to someone. So nothing here wraps Spring Security's OAuth support or an authorization SDK: the authorization code flow, PKCE verification, refresh-token rotation, JWT signing and verification, the permission engine and the audit hash chain are all written directly. The interesting part of this domain is the reasoning behind each rule, and you cannot demonstrate that by configuring somebody else's library.

The identity service is an OpenID Connect provider with per-tenant RS256 signing keys, rotatable without invalidating tokens already in flight, and private halves wrapped in AES-256-GCM before they reach Postgres. The decision I care most about is refresh-token rotation: every refresh consumes the presented token and issues a new one carrying the same family id, and presenting an already-rotated token revokes the entire family. A stolen token therefore works only until the legitimate client refreshes once — after that, one of the two parties presents a consumed token. The provider cannot tell the thief from the victim, so it stops trusting the lineage rather than guessing. The legitimate user gets logged out, which is a real cost and the right one, because the alternative lets an attacker refresh indefinitely while the victim notices nothing.

The authorization service follows Google's Zanzibar paper: permissions are not stored, they are derived. A namespace declares that a document's viewers are whoever holds viewer directly, plus everyone who is an editor, plus everyone who can view the parent folder — and a check walks that definition at query time over the relationship tuples. Move a document into a different folder and its access changes with it, because nothing about the document was ever written down. It supports usersets and nested groups, unions, intersections and exclusions, an expand API that renders the same rules as a tree (check answers yes or no, and "why" is the question an operator actually has at 3am), a Redis cache keyed by storage revision so any write invalidates everything earlier at once, and Zanzibar's consistency tokens for the read-your-own-writes problem. It never takes a tenant id from a URL: it reads the tid claim out of a token the identity service signed and uses that, so a caller cannot reach another tenant's data by editing a path.

Both services publish security events through a transactional outbox — writing to a table in the same transaction as the thing being audited makes the record exactly as durable as the event, and turns a Kafka outage into latency rather than loss. The audit service consumes them and chains them with SHA-256 per tenant, and its verifier checks four distinct things, because there are four distinct ways to interfere with a log: rewriting a record breaks its hash; rewriting it and recomputing that hash breaks the next record's link; deleting a record leaves a gap the hashes alone would not notice; and editing only an indexed column is caught by comparing those columns against the signed payload. It is tamper-evidence, not tamper-proofing — someone who can rewrite the whole table can recompute the whole chain — which is why the chain head is its own endpoint, meant to be recorded somewhere the database cannot reach.

Multi-tenancy is enforced in the generated SQL through Hibernate's tenant discriminator rather than in service code, and when no tenant is bound the resolver returns the nil UUID: the query still runs, and matches nothing. The isolation suite gives two tenants the same client id and the same user email on purpose, so any query that lost its predicate would return the other tenant's row and a test expecting a rejection would pass instead.

431 tests at 92% line and 86% branch coverage. A large share are adversarial, and each is a published attack rather than an invented one — alg:none, HS256 forgery using the public key as the HMAC secret, PKCE downgrade, confused-deputy code redemption, stolen-token replay, open redirect, cross-tenant replay — and every one of them produces a request that parses. Two bugs only end-to-end testing could find: a revocation that rolled back with the very exception that rejected the replay, and audit timestamps hashed at nanosecond precision but stored at microsecond precision, which made an untampered chain fail verification.`,
    stack: [
      "Java 21",
      "Spring Boot",
      "OAuth 2.0",
      "OpenID Connect",
      "Zanzibar",
      "PostgreSQL",
      "Hibernate Multi-Tenancy",
      "Flyway",
      "Redis",
      "Apache Kafka",
      "Nimbus JOSE+JWT",
      "Testcontainers",
      "Docker Compose",
      "GitHub Actions",
    ],
    repoUrl: "https://github.com/sahilkalgutkar/trust-platform",
    liveUrl: null,
    featured: true,
  },
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
