import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

import PlansProductRoute from "./page";

describe("PlansProductRoute", () => {
  it.each(["aip", "acp"] as const)("renders the standard %s plans page", async (product) => {
    const page = await PlansProductRoute({
      params: Promise.resolve({ locale: "en", product }),
    });

    expect(page.props).toEqual({
      locale: "en",
      productKey: product,
    });
  });
});
