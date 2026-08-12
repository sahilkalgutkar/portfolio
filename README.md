# Portfolio

Personal portfolio site. Project data is served through a self-hosted GraphQL
API (Apollo Server, mounted as a Next.js Route Handler) backed by Supabase,
instead of being hardcoded into components.

## Stack

- **Next.js** (App Router) — SSR, file-based routing, Route Handlers
- **Apollo Server**, mounted at `/api/graphql` via `@as-integrations/next`
- **Supabase** (Postgres) for project data, with a seed-data fallback (see below)
- **Tailwind CSS**
- **GitHub Actions** — lint, typecheck, build on every push/PR
- **Vercel** for hosting, deployed via its GitHub integration

## How the pieces fit together

```
app/api/graphql/route.ts   Apollo Server, mounted as a Route Handler
graphql/schema.ts          typeDefs
graphql/resolvers.ts       resolvers — read from Supabase, fall back to lib/projects.ts
graphql/server.ts          shared ApolloServer instance
lib/supabase.ts            Supabase client (returns null if env vars unset)
lib/graphql-client.ts      runs queries against the ApolloServer instance in-process
app/page.tsx                home page — lists projects
app/projects/[slug]/       per-project case study page
```

Pages run queries in-process against the same `ApolloServer` instance mounted
at `/api/graphql`, rather than making an HTTP round trip to the app's own API
route during server rendering (self-fetching your own route from a server
component is unreliable on serverless platforms). `/api/graphql` itself stays
live as a real HTTP endpoint — hit it directly with any GraphQL client to
explore the schema:

```bash
curl -X POST https://<your-deployment>/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ projects { title } }"}'
```

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase credentials set, the GraphQL
resolvers fall back to the seed data in `lib/projects.ts`, so the site is
fully functional out of the box.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/seed.sql` in the project's SQL editor to create and seed the
   `projects` table.
3. Copy `.env.local.example` to `.env.local` and fill in `SUPABASE_URL` and
   `SUPABASE_ANON_KEY` from the project's API settings.

## Deploying

Push to GitHub and import the repo on [Vercel](https://vercel.com/new) —
Vercel auto-deploys on every push to `main` once connected. Add
`SUPABASE_URL` / `SUPABASE_ANON_KEY` as environment variables in the Vercel
project settings.
