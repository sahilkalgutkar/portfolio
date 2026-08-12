import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

// Single ApolloServer instance, shared by:
// - app/api/graphql/route.ts (mounted as an HTTP endpoint for external clients)
// - lib/graphql-client.ts (called in-process for server-rendered pages)
export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
