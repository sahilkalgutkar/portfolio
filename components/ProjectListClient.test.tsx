import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectListClient } from "./ProjectListClient";

describe("ProjectListClient", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows a skeleton before the fetch resolves", () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    render(<ProjectListClient />);

    expect(screen.getByLabelText("Loading projects")).toBeInTheDocument();
  });

  it("renders the projects once the fetch resolves", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: {
            projects: [
              {
                slug: "spliteasy",
                title: "SplitEasy",
                summary: "Expense splitter",
                stack: ["NestJS"],
                repoUrl: "https://github.com/sahilkalgutkar/expense-splitter",
                liveUrl: null,
                featured: false,
              },
            ],
          },
        }),
    } as Response);

    render(<ProjectListClient />);

    await waitFor(() => expect(screen.getByText("SplitEasy")).toBeInTheDocument());
  });

  it("shows an error message when the GraphQL response contains errors", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve({ errors: [{ message: "boom" }] }),
    } as Response);

    render(<ProjectListClient />);

    await waitFor(() => expect(screen.getByText(/boom/)).toBeInTheDocument());
  });

  it("shows an error message when the fetch itself rejects", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));

    render(<ProjectListClient />);

    await waitFor(() => expect(screen.getByText(/network down/)).toBeInTheDocument());
  });
});
