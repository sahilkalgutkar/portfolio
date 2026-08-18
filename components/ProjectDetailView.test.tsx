import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ProjectDetailError,
  ProjectDetailSkeleton,
  ProjectDetailView,
} from "./ProjectDetailView";
import type { Project } from "@/lib/projects";

const project: Project = {
  slug: "spliteasy",
  title: "SplitEasy",
  summary: "Expense splitter for groups.",
  description: "First paragraph.\n\nSecond paragraph.",
  stack: ["NestJS", "Prisma"],
  repoUrl: "https://github.com/sahilkalgutkar/expense-splitter",
  liveUrl: null,
  featured: false,
};

describe("ProjectDetailView", () => {
  it("renders the title, summary, and stack", () => {
    render(<ProjectDetailView project={project} />);

    expect(screen.getByRole("heading", { name: "SplitEasy" })).toBeInTheDocument();
    expect(screen.getByText("Expense splitter for groups.")).toBeInTheDocument();
    expect(screen.getByText("NestJS")).toBeInTheDocument();
  });

  it("splits the description into one paragraph per blank line", () => {
    render(<ProjectDetailView project={project} />);

    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("links to the repository", () => {
    render(<ProjectDetailView project={project} />);

    expect(screen.getByRole("link", { name: /Repository/ })).toHaveAttribute(
      "href",
      "https://github.com/sahilkalgutkar/expense-splitter"
    );
  });

  it("only shows a live demo link when liveUrl is set", () => {
    render(<ProjectDetailView project={project} />);
    expect(screen.queryByRole("link", { name: /Live demo/ })).not.toBeInTheDocument();

    render(<ProjectDetailView project={{ ...project, liveUrl: "https://example.com" }} />);
    expect(screen.getByRole("link", { name: /Live demo/ })).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });
});

describe("ProjectDetailSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<ProjectDetailSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });
});

describe("ProjectDetailError", () => {
  it("shows the error message", () => {
    render(<ProjectDetailError message="not found" />);
    expect(screen.getByText(/not found/)).toBeInTheDocument();
  });
});
