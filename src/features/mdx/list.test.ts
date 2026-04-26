import { beforeEach, describe, expect, it, vi } from "vitest";
import * as fsModule from "fs";

vi.mock("server-only", () => ({}));

import { loadMdxListItems } from "./list";
import { loadMdxSource } from "./loader";
import { renderMdx } from "./renderer";

vi.mock("./loader", () => ({
  loadMdxSource: vi.fn(),
}));

vi.mock("./renderer", () => ({
  renderMdx: vi.fn(),
}));

describe("loadMdxListItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("디렉터리 목록을 읽어 MDX 목록 아이템을 날짜 내림차순으로 반환한다", async () => {
    vi.spyOn(fsModule.promises, "readdir").mockResolvedValueOnce([
      { isDirectory: () => true, name: "1" },
      { isDirectory: () => true, name: "2" },
      { isDirectory: () => false, name: "ignore.txt" },
    ] as any);

    vi.mocked(loadMdxSource)
      .mockResolvedValueOnce("source-1")
      .mockResolvedValueOnce("source-2");

    vi.mocked(renderMdx)
      .mockResolvedValueOnce({
        frontmatter: {
          category: "blog",
          date: "2024-01-01",
          description: "Older post",
          ogImage: "public/blog/1/thumbnail.png",
          title: "Older",
        },
      } as any)
      .mockResolvedValueOnce({
        frontmatter: {
          category: "blog",
          date: "2024-05-01",
          description: "Newer post",
          ogImage: "public/blog/2/thumbnail.png",
          title: "Newer",
        },
      } as any);

    const items = await loadMdxListItems("blog", "ko");

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      dateIso: "2024-05-01",
      description: "Newer post",
      href: "/ko/blog/2",
      id: "2",
      imageSrc: "/blog/2/thumbnail.png",
      title: "Newer",
    });
    expect(items[1]).toMatchObject({
      dateIso: "2024-01-01",
      href: "/ko/blog/1",
      id: "1",
      imageSrc: "/blog/1/thumbnail.png",
      title: "Older",
    });
  });

  it("소스를 읽지 못한 항목은 목록에서 제외한다", async () => {
    vi.spyOn(fsModule.promises, "readdir").mockResolvedValueOnce([
      { isDirectory: () => true, name: "1" },
      { isDirectory: () => true, name: "2" },
    ] as any);

    vi.mocked(loadMdxSource)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce("source-2");

    vi.mocked(renderMdx).mockResolvedValueOnce({
      frontmatter: {
        category: "whitepaper",
        date: "2024-03-10",
        description: "White paper",
        ogImage: "public/white-papers/2/thumbnail.png",
        title: "Only item",
      },
    } as any);

    const items = await loadMdxListItems("white-paper", "en");

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      href: "/white-papers/2",
      id: "2",
      imageSrc: "/white-papers/2/thumbnail.png",
      title: "Only item",
    });
  });
});
