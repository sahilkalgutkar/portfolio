import { describe, expect, it, vi } from "vitest";

const executeOperationMock = vi.fn();
vi.mock("@/graphql/server", () => ({
  apolloServer: { executeOperation: (...args: unknown[]) => executeOperationMock(...args) },
}));

const { fetchGraphQL } = await import("./graphql-client");

describe("fetchGraphQL", () => {
  it("returns the data on a successful single-result response", async () => {
    executeOperationMock.mockResolvedValue({
      body: { kind: "single", singleResult: { data: { projects: [] } } },
    });

    const result = await fetchGraphQL("{ projects { title } }");

    expect(result).toEqual({ projects: [] });
  });

  it("throws when the response is not a single-result kind", async () => {
    executeOperationMock.mockResolvedValue({ body: { kind: "incremental" } });

    await expect(fetchGraphQL("query")).rejects.toThrow("Unexpected GraphQL response kind");
  });

  it("throws with the joined error messages when GraphQL returns errors", async () => {
    executeOperationMock.mockResolvedValue({
      body: {
        kind: "single",
        singleResult: { errors: [{ message: "bad slug" }, { message: "not found" }] },
      },
    });

    await expect(fetchGraphQL("query")).rejects.toThrow("bad slug; not found");
  });

  it("throws when there are no errors but also no data", async () => {
    executeOperationMock.mockResolvedValue({
      body: { kind: "single", singleResult: {} },
    });

    await expect(fetchGraphQL("query")).rejects.toThrow("No data returned from GraphQL API");
  });

  it("passes variables through to executeOperation", async () => {
    executeOperationMock.mockResolvedValue({
      body: { kind: "single", singleResult: { data: { project: null } } },
    });

    await fetchGraphQL("query", { slug: "spliteasy" });

    expect(executeOperationMock).toHaveBeenCalledWith({
      query: "query",
      variables: { slug: "spliteasy" },
    });
  });
});
