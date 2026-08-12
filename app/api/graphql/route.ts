import type { NextRequest } from "next/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { apolloServer } from "@/graphql/server";

// @as-integrations/next's handler has an overloaded signature (Pages Router
// req/res + App Router req) that confuses Next 16's generated route types.
// Wrapping it in single-signature functions disambiguates for the type checker.
const handler = startServerAndCreateNextHandler(apolloServer);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
