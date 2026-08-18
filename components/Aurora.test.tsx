import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Aurora } from "./Aurora";

describe("Aurora", () => {
  it("renders as a decorative element hidden from assistive tech", () => {
    const { container } = render(<Aurora />);

    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root?.querySelectorAll(".aurora__blob")).toHaveLength(3);
    expect(root?.querySelector(".aurora__grain")).not.toBeNull();
  });
});
