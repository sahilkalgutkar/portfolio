import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { certifications, education } from "@/lib/profile";
import { EducationCerts } from "./EducationCerts";

describe("EducationCerts", () => {
  it("renders every degree and school from the real education data", () => {
    render(<EducationCerts />);

    expect(education.length).toBeGreaterThan(0);
    for (const entry of education) {
      expect(screen.getByText(entry.degree)).toBeInTheDocument();
      expect(screen.getByText(entry.school)).toBeInTheDocument();
    }
  });

  it("renders every certification from the real data", () => {
    render(<EducationCerts />);

    expect(certifications.length).toBeGreaterThan(0);
    for (const cert of certifications) {
      expect(screen.getByText(cert)).toBeInTheDocument();
    }
  });
});
