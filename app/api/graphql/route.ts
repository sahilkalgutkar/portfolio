import type { NextRequest } from "next/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { apolloServer } from "@/graphql/server";

// @as-integrations/next's handler has an overloaded signature (Pages Router
// req/res + App Router req) that confuses Next 16's generated route types.
// Wrapping it in single-signature functions disambiguates for the type checker.
const handler = startServerAndCreateNextHandler(apolloServer);

// Public, read-only project data — no auth, no cookies — so a permissive
// origin is fine. Needed because the GitHub Pages static export
// (lib/graphql-endpoint.ts) queries this endpoint cross-origin.
function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, { status: response.status, headers });
}

export async function GET(request: NextRequest) {
  return withCors(await handler(request));
}

export async function POST(request: NextRequest) {
  return withCors(await handler(request));
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}
