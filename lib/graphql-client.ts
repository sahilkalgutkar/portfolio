import { apolloServer } from "@/graphql/server";

// Runs the query in-process against the same ApolloServer instance mounted
// at /api/graphql, instead of making an HTTP round trip to our own app.
// A server component fetching its own app's API route over HTTP is
// unreliable on serverless platforms (Vercel isolates the request that's
// still rendering from the one the self-fetch would create) — this avoids
// that entirely while /api/graphql stays live for actual external clients.
export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await apolloServer.executeOperation<T>({ query, variables });

  if (response.body.kind !== "single") {
    throw new Error("Unexpected GraphQL response kind: " + response.body.kind);
  }

  const { data, errors } = response.body.singleResult;

  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join("; "));
  }
  if (!data) {
    throw new Error("No data returned from GraphQL API");
  }

  return data;
}
