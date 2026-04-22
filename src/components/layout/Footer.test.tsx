import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("displays the latest copyright year and office addresses", () => {
    render(<Footer />);

    expect(screen.getByText("© 2017-2026 QueryPie, Inc. All rights reserved.")).toBeInTheDocument();
    expect(
      screen.getByText("Headquarter : 2525 West 8th Street, Suite 300, Los Angeles, CA 90057"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Seoul Magok Office : 7F, 26, Magokjungang 1-ro, Gangseo-gu, Seoul, Republic of Korea"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Seoul Gangnam Office : 3F, 464, Gangnam-daero, Gangnam-gu, Seoul, Republic of Korea"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Japan Office : 15F, 1 Chome-17-1 Toranomon, Minato City, Tokyo 105-6490"),
    ).toBeInTheDocument();
  });

  it("uses the same legal label as the public site", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Terms of Service" })).toBeInTheDocument();
  });
});
