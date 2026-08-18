import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile, stats } from "@/lib/profile";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the real profile name, title, and location", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeInTheDocument();
    expect(screen.getByText(`${profile.title} · ${profile.location}`)).toBeInTheDocument();
  });

  it("renders every stat value and label", () => {
    render(<Hero />);

    for (const stat of stats) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    }
  });

  it("links the resume download, email, GitHub, and LinkedIn to the real profile data", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: "Download Resume" })).toHaveAttribute(
      "href",
      profile.resume
    );
    expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", profile.github);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      profile.linkedin
    );
  });
});
