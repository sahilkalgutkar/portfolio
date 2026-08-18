import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectList, ProjectListError, ProjectListSkeleton, type ProjectListItem } from "./ProjectList";

const projects: ProjectListItem[] = [
  {
    slug: "pipelineops",
    title: "PipelineOps",
    summary: "Job-monitoring platform.",
    stack: ["React", "Django", "Go"],
    repoUrl: "https://github.com/sahilkalgutkar/PipelineOps",
    liveUrl: null,
    featured: true,
  },
  {
    slug: "spliteasy",
    title: "SplitEasy",
    summary: "Expense splitter.",
    stack: ["NestJS"],
    repoUrl: "https://github.com/sahilkalgutkar/expense-splitter",
    liveUrl: null,
    featured: false,
  },
];

describe("ProjectList", () => {
  it("renders every project's title, summary, and stack", () => {
    render(<ProjectList projects={projects} />);

    expect(screen.getByText("PipelineOps")).toBeInTheDocument();
    expect(screen.getByText("Job-monitoring platform.")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("SplitEasy")).toBeInTheDocument();
  });

  it("shows a Featured badge only for featured projects", () => {
    render(<ProjectList projects={projects} />);

    expect(screen.getAllByText("Featured")).toHaveLength(1);
  });

  it("links each project to its detail page by slug", () => {
    render(<ProjectList projects={projects} />);

    expect(screen.getByRole("link", { name: /PipelineOps/ })).toHaveAttribute(
      "href",
      "/projects/pipelineops"
    );
    expect(screen.getByRole("link", { name: /SplitEasy/ })).toHaveAttribute(
      "href",
      "/projects/spliteasy"
    );
  });

  it("renders nothing when given an empty list", () => {
    render(<ProjectList projects={[]} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("ProjectListSkeleton", () => {
  it("renders a loading placeholder", () => {
    render(<ProjectListSkeleton />);

    expect(screen.getByLabelText("Loading projects")).toBeInTheDocument();
  });
});

describe("ProjectListError", () => {
  it("shows the error message", () => {
    render(<ProjectListError message="network down" />);

    expect(screen.getByText(/network down/)).toBeInTheDocument();
  });
});
