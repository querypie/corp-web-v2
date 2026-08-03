import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationMocks = vi.hoisted(() => ({
  notFound: vi.fn(),
  permanentRedirect: vi.fn(),
}));

vi.mock("next/navigation", () => navigationMocks);
vi.mock("server-only", () => ({}));

import DocumentationPage from "./page";

describe("legacy documentation category queries", () => {
  beforeEach(() => {
    navigationMocks.notFound.mockReset();
    navigationMocks.permanentRedirect.mockReset();
  });

  it.each([
    ["ko", "blog", "/ko/blog"],
    ["en", "whitepaper", "/en/whitepapers"],
    ["ko", "white-paper", "/ko/whitepapers"],
  ])("redirects %s category=%s to the current list route", async (locale, category, destination) => {
    await DocumentationPage({
      params: Promise.resolve({ locale }),
      searchParams: Promise.resolve({ category }),
    });

    expect(navigationMocks.permanentRedirect).toHaveBeenCalledWith(destination);
  });
});
