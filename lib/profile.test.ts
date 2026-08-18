import { describe, expect, it } from "vitest";
import { tierFill } from "./profile";

describe("tierFill", () => {
  it("maps each skill tier to its expected fill percentage", () => {
    expect(tierFill("Expert")).toBe(95);
    expect(tierFill("Advanced")).toBe(80);
    expect(tierFill("Proficient")).toBe(60);
  });

  it("returns a strictly decreasing fill as tier decreases", () => {
    expect(tierFill("Expert")).toBeGreaterThan(tierFill("Advanced"));
    expect(tierFill("Advanced")).toBeGreaterThan(tierFill("Proficient"));
  });
});
