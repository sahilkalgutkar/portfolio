import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { experience } from "@/lib/profile";
import { Experience } from "./Experience";

describe("Experience", () => {
  it("renders every job's role, company, and date range from the real data", () => {
    render(<Experience />);

    expect(experience.length).toBeGreaterThan(0);
    const headings = screen.getAllByRole("heading", { level: 3 });
    for (const job of experience) {
      const heading = headings.find(
        (h) => h.textContent?.includes(job.role) && h.textContent?.includes(job.company)
      );
      expect(heading).toBeTruthy();
      expect(screen.getByText(`${job.start} – ${job.end}`)).toBeInTheDocument();
    }
  });

  it("renders every bullet and tech tag for the first job", () => {
    render(<Experience />);
    const [firstJob] = experience;

    for (const bullet of firstJob.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument();
    }
    for (const tech of firstJob.tech) {
      expect(screen.getAllByText(tech).length).toBeGreaterThan(0);
    }
  });
});
