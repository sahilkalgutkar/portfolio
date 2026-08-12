// The Vercel deployment's /api/graphql, called cross-origin from the
// statically-exported GitHub Pages build (components/*Client.tsx). Set at
// build time by .github/workflows/deploy-gh-pages.yml — unused on Vercel,
// which calls the resolvers in-process instead (lib/graphql-client.ts).
export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "";
