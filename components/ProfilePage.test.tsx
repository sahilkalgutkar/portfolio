import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "@/lib/profile";
import { ProfilePage } from "./ProfilePage";

describe("ProfilePage", () => {
  it("renders the shared sections plus the given projects slot in the projects section", () => {
    render(ProfilePage({ projects: <div data-testid="projects-slot">projects go here</div> }));

    expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByTestId("projects-slot")).toBeInTheDocument();
  });

  it("places the projects slot inside the #projects section", () => {
    render(ProfilePage({ projects: <div data-testid="projects-slot" /> }));

    const section = document.getElementById("projects");
    expect(section?.querySelector('[data-testid="projects-slot"]')).not.toBeNull();
  });
});
