import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it("renders the eyebrow text and the title as a heading", () => {
    render(<SectionHeading eyebrow="01 — Summary" title="About" />);

    expect(screen.getByText("01 — Summary")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
  });
});
