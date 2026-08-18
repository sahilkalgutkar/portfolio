import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectDetailClient } from "./ProjectDetailClient";

describe("ProjectDetailClient", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows a skeleton before the fetch resolves", () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    const { container } = render(<ProjectDetailClient slug="spliteasy" />);

    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("renders the project once the fetch resolves", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: {
            project: {
              slug: "spliteasy",
              title: "SplitEasy",
              summary: "Expense splitter",
              description: "Some description.",
              stack: ["NestJS"],
              repoUrl: "https://github.com/sahilkalgutkar/expense-splitter",
              liveUrl: null,
              featured: false,
            },
          },
        }),
    } as Response);

    render(<ProjectDetailClient slug="spliteasy" />);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "SplitEasy" })).toBeInTheDocument()
    );
  });

  it("shows a not-found error when the project is null", async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve({ data: { project: null } }),
    } as Response);

    render(<ProjectDetailClient slug="does-not-exist" />);

    await waitFor(() => expect(screen.getByText(/project not found/)).toBeInTheDocument());
  });

  it("shows an error message when the fetch itself rejects", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));

    render(<ProjectDetailClient slug="spliteasy" />);

    await waitFor(() => expect(screen.getByText(/network down/)).toBeInTheDocument());
  });
});
