import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { summary } from "@/lib/profile";
import { About } from "./About";

describe("About", () => {
  it("renders every paragraph of the real profile summary", () => {
    render(<About />);

    expect(summary.length).toBeGreaterThan(0);
    for (const paragraph of summary) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("renders the section heading", () => {
    render(<About />);

    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
  });
});
