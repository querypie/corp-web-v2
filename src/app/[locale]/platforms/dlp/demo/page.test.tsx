import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationMocks = vi.hoisted(() => ({
  notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }),
  redirect: vi.fn(() => { throw new Error("NEXT_REDIRECT"); }),
}));

vi.mock("next/navigation", () => navigationMocks);

import DlpDemoRoute from "./page";

describe("기존 DLP 데모 URL", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each(["en", "ko", "ja"] as const)("%s 데모에 맞는 언어로 외부 이동한다", async (locale) => {
    await expect(DlpDemoRoute({ params: Promise.resolve({ locale }) })).rejects.toThrow("NEXT_REDIRECT");
    expect(navigationMocks.redirect).toHaveBeenCalledWith(
      `https://querypie--dlp-demo.srv.kpb4r.mlxp.ncloud.com/?lang=${locale}`,
    );
  });

  it("지원하지 않는 언어는 404로 처리한다", async () => {
    await expect(DlpDemoRoute({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(navigationMocks.redirect).not.toHaveBeenCalled();
  });
});
