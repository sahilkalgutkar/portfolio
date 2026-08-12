import gql from "graphql-tag";

export const typeDefs = gql`
  type Project {
    slug: String!
    title: String!
    summary: String!
    description: String!
    stack: [String!]!
    repoUrl: String!
    liveUrl: String
    featured: Boolean!
  }

  type Query {
    projects: [Project!]!
    project(slug: String!): Project
  }
`;
