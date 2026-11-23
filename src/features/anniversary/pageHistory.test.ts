import { describe, expect, it, vi } from "vitest";
import { readContentState } from "@/features/content/contentState.server";
import { createEmptyManagedContentDraft, type ManagedContentEntry } from "@/features/content/data";
import { getAnniversaryPageHistory } from "./pageHistory.server";

vi.mock("server-only", () => ({}));
vi.mock("@/features/content/contentState.server", () => ({ readContentState: vi.fn() }));

function newsItem(item: Partial<ManagedContentEntry>) {
  return {
    ...createEmptyManagedContentDraft("news", "news"),
    status: "published" as const,
    visibleLocales: ["en" as const],
    ...item,
  };
}

describe("10주년 연혁 뉴스 썸네일", () => {
  it("관련 공개 뉴스의 최신 썸네일을 사용하고 미공개·무관한 뉴스는 적용하지 않는다", async () => {
    vi.mocked(readContentState).mockResolvedValue([
      newsItem({ id: "querypie-becomes-okta-integration-network-partner-in-korea", imageSrc: "/news/updated-okta.webp" }),
      newsItem({ id: "lingo-launch", imageSrc: "/news/unpublished-lingo.webp", status: "hidden" }),
      newsItem({ id: "notepie-launch", imageSrc: "/news/scheduled-notepie.webp", publishAt: "2099-01-01T00:00:00Z" }),
      newsItem({ id: "yanolja-taps-querypie-to-firm-up-data-governance", imageSrc: "/news/unrelated.webp" }),
    ]);

    const history = (await getAnniversaryPageHistory("ja")).flatMap(({ milestones }) => milestones);
    const photoFor = (id: string) => history.find((milestone) => milestone.id === id)?.photo?.src;
    expect(photoFor("Okta Integration Network 합류")).toBe("/news/updated-okta.webp");
    expect(photoFor("실시간 통역 서비스 Lingo 공개")).toBeUndefined();
    expect(photoFor("문서 기반 AI 어시스턴트 NotePie 공개")).toBeUndefined();
    expect(photoFor("데이터 거버넌스 솔루션 출시")).toBeUndefined();
    expect(photoFor("메가존클라우드와 데이터 보안 업무협약")).toBe("/news/anniversary-megazone-agreement.webp");
  });
});
