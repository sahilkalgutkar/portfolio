export const PROJECTS_QUERY = /* GraphQL */ `
  query Projects {
    projects {
      slug
      title
      summary
      stack
      repoUrl
      liveUrl
      featured
    }
  }
`;

export const PROJECT_QUERY = /* GraphQL */ `
  query Project($slug: String!) {
    project(slug: $slug) {
      slug
      title
      summary
      description
      stack
      repoUrl
      liveUrl
      featured
    }
  }
`;
