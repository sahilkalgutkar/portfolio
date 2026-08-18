# Portfolio

[![CI](https://github.com/sahilkalgutkar/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sahilkalgutkar/portfolio/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/sahilkalgutkar/portfolio/branch/main/graph/badge.svg)](https://codecov.io/gh/sahilkalgutkar/portfolio)
[![patch coverage](https://img.shields.io/badge/patch%20coverage-min%2080%25-blue.svg)](codecov.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

My personal portfolio site. I built it on Next.js (App Router), and instead of hardcoding project data
into components, I serve it through a self-hosted GraphQL API — Apollo Server, mounted as a Next.js Route
Handler at `/api/graphql` via `@as-integrations/next` — backed by Supabase, with a seed-data fallback so
the site still works fully without any Supabase project configured (see below).

Styling is Tailwind CSS. GitHub Actions runs lint, typecheck, and build on every push/PR, and Vercel
hosts the site, deploying automatically via its GitHub integration.

## How the pieces fit together

```
app/api/graphql/route.ts   Apollo Server, mounted as a Route Handler (CORS-enabled)
graphql/schema.ts          typeDefs
graphql/resolvers.ts       resolvers — read from Supabase, fall back to lib/projects.ts
graphql/server.ts          shared ApolloServer instance
lib/supabase.ts            Supabase client (returns null if env vars unset)
lib/graphql-client.ts      runs queries against the ApolloServer instance in-process (Vercel)
lib/graphql-endpoint.ts    the Vercel /api/graphql URL, for the GitHub Pages build
app/page.tsx                home page (Vercel) — force-dynamic, server-rendered
app/projects/[slug]/       per-project case study page (Vercel) — force-dynamic
components/ProjectList*    presentational + server (in-process) + client (fetch) variants
components/ProjectDetail*  same split, for the case study page
deploy/gh-pages/           page.tsx variants swapped in for the GitHub Pages build
```

I run page queries in-process against the same `ApolloServer` instance mounted
at `/api/graphql`, rather than making an HTTP round trip to the app's own API
route during server rendering — self-fetching your own route from a server
component is unreliable on serverless platforms. `/api/graphql` still stays
live as a real HTTP endpoint, though — hit it directly with any GraphQL client
to explore the schema:

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

### Vercel (primary)

Push to GitHub and import the repo on [Vercel](https://vercel.com/new) —
Vercel auto-deploys on every push to `main` once connected. Add
`SUPABASE_URL` / `SUPABASE_ANON_KEY` as environment variables in the Vercel
project settings.

### GitHub Pages (static mirror)

`.github/workflows/deploy-gh-pages.yml` publishes a second copy of the site to
GitHub Pages at `https://<username>.github.io/portfolio/`. GitHub Pages only
serves static files, so I can't run `/api/graphql` on that build — instead:

- `app/api/graphql` is deleted before the build (a POST-based GraphQL route
  can't be statically exported — see `next.config.ts`).
- `app/page.tsx` and `app/projects/[slug]/page.tsx` are swapped for the
  variants in `deploy/gh-pages/`, which fetch project data client-side, in
  the browser, from the live Vercel deployment's `/api/graphql` over CORS
  (see the `withCors` wrapper in `app/api/graphql/route.ts`) instead of
  running the resolvers in-process.

One-time setup:

1. In the repo, go to **Settings → Pages** and set **Source** to **GitHub
   Actions**.
2. Go to **Settings → Secrets and variables → Actions → Variables** and add a
   repository variable named `GRAPHQL_ENDPOINT` set to your Vercel
   deployment's GraphQL URL, e.g. `https://your-app.vercel.app/api/graphql`.
3. Push to `main` (or run the workflow manually) — it builds and deploys
   automatically from there.

`next.config.ts` assumes this repo is named `portfolio` and sets
`basePath: "/portfolio"` accordingly for a project-page URL. If the repo is
ever renamed to `<username>.github.io` (a user/org page, served at the
domain root), remove the `basePath` line.

## License

[MIT](LICENSE)
