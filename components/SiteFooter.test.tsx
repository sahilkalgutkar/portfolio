import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "@/lib/profile";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("shows the copyright line with the real profile name", () => {
    render(<SiteFooter />);

    expect(screen.getByText(`© ${profile.name}`)).toBeInTheDocument();
  });

  it("links Email, GitHub, and LinkedIn to the real profile contacts", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
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
