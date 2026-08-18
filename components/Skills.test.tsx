import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { coreSkills, skillGroups, tierFill } from "@/lib/profile";
import { Skills } from "./Skills";

describe("Skills", () => {
  it("renders every core skill's name, tier, and years", () => {
    const { container } = render(<Skills />);

    expect(coreSkills.length).toBeGreaterThan(0);
    const rows = container.querySelectorAll(".grid.gap-x-8 > div");
    expect(rows).toHaveLength(coreSkills.length);
    rows.forEach((row, i) => {
      const skill = coreSkills[i];
      expect(row.textContent).toContain(skill.name);
      expect(row.textContent).toContain(`${skill.tier} · ${skill.years}`);
    });
  });

  it("sizes each core skill's progress bar using tierFill", () => {
    const { container } = render(<Skills />);

    const bars = container.querySelectorAll<HTMLDivElement>(
      ".bg-gradient-to-r.from-zinc-700"
    );
    expect(bars).toHaveLength(coreSkills.length);
    bars.forEach((bar, i) => {
      expect(bar.style.width).toBe(`${tierFill(coreSkills[i].tier)}%`);
    });
  });

  it("renders every skill group label and item", () => {
    render(<Skills />);

    expect(skillGroups.length).toBeGreaterThan(0);
    for (const group of skillGroups) {
      expect(screen.getByText(group.label)).toBeInTheDocument();
      for (const item of group.items) {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0);
      }
    }
  });
});
