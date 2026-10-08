// @vitest-environment node
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { getPublicDetailHref, isPublishedContentVisible, sortPublicContentItems } from "./data";

vi.mock("server-only", () => ({}));

const expectedIds = [
  "dac-ai-account-review",
  "sac-ai-server-health-check",
  "kac-acp-mcp-cluster-query",
  "mac-mcp-access-control-audit",
];
const youtubeVideoIds: Record<string, string> = {
  "dac-ai-account-review": "endkPbWZsuI",
  "sac-ai-server-health-check": "ku3sydckiZw",
  "kac-acp-mcp-cluster-query": "wsOqAWaLL2Q",
  "mac-mcp-access-control-audit": "lFX8ovpRGqc",
};

describe("ACP 활용 관리형 콘텐츠", () => {
  it.each(["en", "ko"] as const)("%s에서 DAC → SAC → KAC → MAC 순서로 공개하며 Admin과 같은 본문을 읽는다", async (locale) => {
    const { readContentState, readContentItem } = await import("./contentState.server");
    const { readAuthoredManagedContentItem } = await import("./authored.server");
    const list = await readContentState("demo", { categorySlug: "acp-features", includeBodies: false });
    const items = sortPublicContentItems(
      list.filter((item) => isPublishedContentVisible(item, locale)),
      { preferManualOrder: true },
    );
    expect(items.map((item) => item.id)).toEqual(expectedIds);

    for (const item of items) {
      expect(getPublicDetailHref("demo", locale, item.id, item.categorySlug)).toBe(`/${locale}/demo/acp/${item.id}`);
      const options = { categorySlug: "acp-features", includeBodies: true } as const;
      const publicItem = await readContentItem("demo", item.id, options);
      const authoredItem = await readAuthoredManagedContentItem("demo", item.id, options);
      expect(publicItem).not.toBeNull();
      expect(authoredItem).not.toBeNull();
      expect(publicItem?.bodyHtml[locale]).toEqual(authoredItem?.bodyHtml[locale]);
      expect(publicItem?.bodyHtml[locale]).toContain("<iframe");
      expect(publicItem?.bodyHtml[locale]).toContain(`/embed/${youtubeVideoIds[item.id]}`);
      expect(publicItem?.bodyHtml[locale]).not.toContain("<video");
      const doc = JSON.parse(publicItem!.bodyRichText[locale]);
      const video = doc.content.find((node: { type: string }) => node.type === "youtube");
      expect(video.attrs.src).toBe(`https://www.youtube.com/embed/${youtubeVideoIds[item.id]}`);
      expect(existsSync(path.join(process.cwd(), "public", item.imageSrc))).toBe(true);
    }
  });

  it("일본어 목록에는 새 활용 콘텐츠를 노출하지 않는다", async () => {
    const { readContentState } = await import("./contentState.server");
    const items = await readContentState("demo", { categorySlug: "acp-features", includeBodies: false });
    expect(items.filter((item) => expectedIds.includes(item.id) && isPublishedContentVisible(item, "ja"))).toEqual([]);
  });
});
