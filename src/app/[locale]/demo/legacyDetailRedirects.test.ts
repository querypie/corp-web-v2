import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationMocks = vi.hoisted(() => ({
  notFound: vi.fn(),
  permanentRedirect: vi.fn(),
}));
const contentMocks = vi.hoisted(() => ({
  readContentItem: vi.fn(),
  readContentState: vi.fn(),
}));

vi.mock("next/navigation", () => navigationMocks);
vi.mock("@/features/content/contentState.server", () => contentMocks);
vi.mock("@/app/[locale]/features/demo/[slug]/page", () => ({
  default: vi.fn(),
  generateMetadata: vi.fn(),
}));

describe("legacy demo detail redirects", () => {
  beforeEach(() => {
    navigationMocks.notFound.mockReset();
    navigationMocks.permanentRedirect.mockReset();
    contentMocks.readContentItem.mockReset();
    contentMocks.readContentState.mockReset();
  });

  it("redirects the retired Okta ACP demo to the current ACP list", async () => {
    const { default: AcpDemoDetailPage } = await import("./acp/[slug]/page");

    await AcpDemoDetailPage({
      params: Promise.resolve({ locale: "en", slug: "integrate-sso-with-okta" }),
    });

    expect(navigationMocks.permanentRedirect).toHaveBeenCalledWith("/en/demo/acp");
  });

  it("redirects the LOVO use-case URL to its current VOC detail", async () => {
    const { default: UseCasesDetailPage } = await import("./use-cases/[slug]/page");

    await UseCasesDetailPage({
      params: Promise.resolve({ locale: "en", slug: "lovo-ai-tom-lee" }),
    });

    expect(navigationMocks.permanentRedirect).toHaveBeenCalledWith("/en/voc/lovo-ai-tom-lee");
  });
});
