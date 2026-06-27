// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/features/content/contentState.server", () => ({
  readContentState: vi.fn(),
}));

vi.mock("@/features/content/authored.server", () => ({
  deleteAuthoredContent: vi.fn(),
  saveAuthoredContent: vi.fn(),
  TiptapHtmlRenderError: class TiptapHtmlRenderError extends Error {
    code = "TIPTAP_HTML_RENDER_FAILED" as const;
    locale: string;
    reason: string;
    suggestions: string[];

    constructor(locale: string, reason: string, suggestions: string[]) {
      super(`Failed to render ${locale} Tiptap JSON to HTML.`);
      this.name = "TiptapHtmlRenderError";
      this.locale = locale;
      this.reason = reason;
      this.suggestions = suggestions;
    }
  },
  updateAuthoredContentMeta: vi.fn(),
}));

import {
  readContentState,
} from "@/features/content/contentState.server";
import {
  deleteAuthoredContent,
  saveAuthoredContent,
  TiptapHtmlRenderError,
  updateAuthoredContentMeta,
} from "@/features/content/authored.server";
import { createLocalizedContent, type ManagedContentEntry } from "@/features/content/data";
import { DELETE, GET, PATCH, POST, PUT } from "./route";

const mockReadContentState = vi.mocked(readContentState);
const mockSaveAuthoredContent = vi.mocked(saveAuthoredContent);
const mockDeleteAuthoredContent = vi.mocked(deleteAuthoredContent);
const mockUpdateAuthoredContentMeta = vi.mocked(updateAuthoredContentMeta);

function makeEntry(overrides: Partial<ManagedContentEntry> = {}): ManagedContentEntry {
  return {
    authorName: "Author",
    authorRole: "",
    bodyHtml: createLocalizedContent("<p>body</p>"),
    bodyRichText: createLocalizedContent("{}"),
    categorySlug: "use-cases",
    contentType: "content",
    dateIso: "2026-01-01",
    downloadCoverImageSrc: "",
    downloadPdfFileName: "",
    downloadPdfSrc: "",
    enableDownloadButton: false,
    externalUrl: "",
    gatingLevel: "none",
    hideHeroImage: false,
    id: "item-1",
    imageSrc: "",
    relatedIds: [],
    section: "demo",
    sortOrder: 0,
    status: "published",
    summary: createLocalizedContent(),
    title: createLocalizedContent("Test Title"),
    visibleLocales: ["en", "ko", "ja"],
    ...overrides,
  };
}

function makeRequest(url: string, options?: RequestInit) {
  return new Request(url, options);
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/admin/content/state", () => {
  it("전체 아이템 목록을 반환한다", async () => {
    const items = [makeEntry({ id: "a" }), makeEntry({ id: "b" })];
    mockReadContentState.mockResolvedValue(items);

    const response = await GET(makeRequest("http://localhost/api/admin/content/state"));
    const data = await response.json() as { items: ManagedContentEntry[] };

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(2);
    expect(data.items[0].id).toBe("a");
  });

  it("section 쿼리파라미터로 필터링하여 readContentState를 호출한다", async () => {
    mockReadContentState.mockResolvedValue([]);

    await GET(makeRequest("http://localhost/api/admin/content/state?section=demo"));

    expect(mockReadContentState).toHaveBeenCalledWith("demo", expect.objectContaining({}));
  });

  it("잘못된 section 쿼리파라미터는 400을 반환한다", async () => {
    const response = await GET(makeRequest("http://localhost/api/admin/content/state?section=invalid"));

    expect(response.status).toBe(400);
    expect(mockReadContentState).not.toHaveBeenCalled();
  });

  it("section에 맞지 않는 categorySlug는 400을 반환한다", async () => {
    const response = await GET(makeRequest("http://localhost/api/admin/content/state?section=demo&categorySlug=blogs"));

    expect(response.status).toBe(400);
    expect(mockReadContentState).not.toHaveBeenCalled();
  });

  it("id 쿼리파라미터가 있으면 단일 아이템을 반환한다", async () => {
    const items = [makeEntry({ id: "target" }), makeEntry({ id: "other" })];
    mockReadContentState.mockResolvedValue(items);

    const response = await GET(makeRequest("http://localhost/api/admin/content/state?id=target"));
    const data = await response.json() as { item: ManagedContentEntry };

    expect(data.item?.id).toBe("target");
  });

  it("storageId 쿼리파라미터가 있으면 storageId로 단일 아이템을 반환한다", async () => {
    const wrongIdItem = makeEntry({ id: "same-slug", storageId: "cnt_000001" });
    const targetItem = makeEntry({
      bodyHtml: {
        en: "<p>English</p>",
        ja: "<p>日本語</p>",
        ko: "<p>한국어</p>",
      },
      categorySlug: "blogs",
      id: "same-slug",
      section: "documentation",
      storageId: "cnt_000002",
    });
    mockReadContentState.mockResolvedValue([wrongIdItem, targetItem]);

    const response = await GET(makeRequest("http://localhost/api/admin/content/state?section=documentation&id=same-slug&storageId=cnt_000002"));
    const data = await response.json() as { item: ManagedContentEntry };

    expect(data.item.storageId).toBe("cnt_000002");
    expect(data.item.bodyHtml.ko).toBe("<p>한국어</p>");
  });

  it("id가 없는 아이템을 조회하면 null을 반환한다", async () => {
    mockReadContentState.mockResolvedValue([]);

    const response = await GET(makeRequest("http://localhost/api/admin/content/state?id=not-found"));
    const data = await response.json() as { item: null };

    expect(data.item).toBeNull();
  });

  it("view=list이면 body를 제거한 목록을 반환한다", async () => {
    const items = [makeEntry({ bodyHtml: createLocalizedContent("<p>content</p>") })];
    mockReadContentState.mockResolvedValue(items);

    const response = await GET(makeRequest("http://localhost/api/admin/content/state?view=list"));
    const data = await response.json() as { items: ManagedContentEntry[] };

    expect(data.items[0].bodyHtml).toEqual(createLocalizedContent(""));
  });
});

describe("POST /api/admin/content/state", () => {
  it("items가 없으면 400을 반환한다", async () => {
    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("items가 배열이 아니면 400을 반환한다", async () => {
    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "POST",
      body: JSON.stringify({ items: "not-an-array" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("유효한 items를 저장하고 반환한다", async () => {
    const item = makeEntry({ id: "new-item", storageId: "cnt_000001" });
    mockReadContentState.mockResolvedValueOnce([]).mockResolvedValueOnce([item]);
    mockSaveAuthoredContent.mockResolvedValue({ ...item, storageId: "cnt_000001" });

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "POST",
      body: JSON.stringify({ items: [item] }),
    });
    const response = await POST(request);
    const data = await response.json() as { items: ManagedContentEntry[] };

    expect(response.status).toBe(200);
    expect(data.items).toHaveLength(1);
    expect(mockSaveAuthoredContent).toHaveBeenCalled();
  });

  it("동일한 아이템이면 saveAuthoredContent를 호출하지 않는다", async () => {
    const item = makeEntry({ id: "same-item" });
    mockReadContentState.mockResolvedValue([item]);

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "POST",
      body: JSON.stringify({ items: [item] }),
    });
    await POST(request);

    expect(mockSaveAuthoredContent).not.toHaveBeenCalled();
  });

  it("payload에 없는 같은 카테고리 아이템을 삭제하지 않는다", async () => {
    const existingItem = makeEntry({ id: "existing", storageId: "cnt_000001" });
    const payloadItem = makeEntry({ id: "payload", storageId: "cnt_000002" });
    mockReadContentState.mockResolvedValueOnce([existingItem]).mockResolvedValueOnce([existingItem, payloadItem]);
    mockSaveAuthoredContent.mockResolvedValue({ ...payloadItem, storageId: "cnt_000002" });

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "POST",
      body: JSON.stringify({ items: [payloadItem] }),
    });
    await POST(request);

    expect(mockDeleteAuthoredContent).not.toHaveBeenCalled();
  });

  it("서버 오류 발생 시 500을 반환한다", async () => {
    mockReadContentState.mockRejectedValue(new Error("disk error"));

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "POST",
      body: JSON.stringify({ items: [makeEntry()] }),
    });
    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  it("Tiptap HTML 변환 실패 시 원인과 수정 방법을 반환한다", async () => {
    const item = makeEntry({ id: "my-item", storageId: "cnt_000001" });
    mockReadContentState.mockResolvedValue([]);
    mockSaveAuthoredContent.mockRejectedValue(
      new TiptapHtmlRenderError("ko", "Tiptap JSON 문법이 깨져 있습니다.", [
        "에디터 본문을 다시 열어 내용을 한 번 수정한 뒤 저장하세요.",
      ]),
    );

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PUT",
      body: JSON.stringify({ item }),
    });
    const response = await PUT(request);
    const data = await response.json() as {
      code: string;
      detail: string;
      locale: string;
      suggestions: string[];
    };

    expect(response.status).toBe(422);
    expect(data.code).toBe("TIPTAP_HTML_RENDER_FAILED");
    expect(data.locale).toBe("ko");
    expect(data.detail).toContain("Tiptap JSON");
    expect(data.suggestions[0]).toContain("에디터 본문");
  });
});

describe("PUT /api/admin/content/state", () => {
  it("item이 없으면 400을 반환한다", async () => {
    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PUT",
      body: JSON.stringify({}),
    });
    const response = await PUT(request);

    expect(response.status).toBe(400);
  });

  it("아이템을 저장하고 upsert한다", async () => {
    const item = makeEntry({ id: "my-item", storageId: "cnt_000001" });
    mockReadContentState.mockResolvedValue([]);
    mockSaveAuthoredContent.mockResolvedValue({ ...item, storageId: "cnt_000001" });

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PUT",
      body: JSON.stringify({ item }),
    });
    const response = await PUT(request);
    const data = await response.json() as { item: ManagedContentEntry };

    expect(response.status).toBe(200);
    expect(data.item.id).toBe("my-item");
    expect(mockSaveAuthoredContent).toHaveBeenCalled();
  });

  it("storageId가 있으면 기존 id가 바뀌어도 같은 아이템으로 병합한다", async () => {
    const existingItem = makeEntry({ id: "old-slug", storageId: "cnt_000001" });
    const nextItem = makeEntry({ id: "new-slug", storageId: "cnt_000001" });
    mockReadContentState.mockResolvedValue([existingItem]);
    mockSaveAuthoredContent.mockResolvedValue({ ...nextItem, storageId: "cnt_000001" });

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PUT",
      body: JSON.stringify({ item: nextItem, preserveExistingBodies: true }),
    });
    const response = await PUT(request);

    expect(response.status).toBe(200);
    expect(mockSaveAuthoredContent).toHaveBeenCalledWith(expect.objectContaining({
      id: "new-slug",
      storageId: "cnt_000001",
    }));
  });

  it("section과 categorySlug 조합이 맞지 않으면 400을 반환한다", async () => {
    const item = makeEntry({ categorySlug: "blogs", section: "demo" });

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PUT",
      body: JSON.stringify({ item }),
    });
    const response = await PUT(request);

    expect(response.status).toBe(400);
    expect(mockSaveAuthoredContent).not.toHaveBeenCalled();
  });

  it("신규 아이템 저장 옵션이 있으면 같은 카테고리 형제 순서를 뒤로 민다", async () => {
    const existingItem = makeEntry({ id: "existing", sortOrder: 1, storageId: "cnt_000001" });
    const newItem = makeEntry({ id: "new-item", sortOrder: 1, storageId: undefined });
    mockReadContentState.mockResolvedValue([existingItem]);
    mockSaveAuthoredContent.mockResolvedValue({ ...newItem, storageId: "cnt_000002" });
    mockUpdateAuthoredContentMeta.mockResolvedValue({} as never);

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PUT",
      body: JSON.stringify({ item: newItem, shiftSiblingsForNew: true }),
    });
    const response = await PUT(request);

    expect(response.status).toBe(200);
    expect(mockUpdateAuthoredContentMeta).toHaveBeenCalledWith(expect.objectContaining({
      id: "existing",
      updates: { sortOrder: 2 },
    }));
  });
});

describe("PATCH /api/admin/content/state", () => {
  it("id 또는 status가 없으면 400을 반환한다", async () => {
    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PATCH",
      body: JSON.stringify({ id: "some-id" }),
    });
    const response = await PATCH(request);

    expect(response.status).toBe(400);
  });

  it("storageId와 status가 있으면 상태를 업데이트한다", async () => {
    const wrongIdItem = makeEntry({ id: "same-slug", storageId: "cnt_000001", status: "hidden" });
    const targetItem = makeEntry({ categorySlug: "blogs", id: "same-slug", section: "documentation", storageId: "cnt_000002" });
    mockReadContentState.mockResolvedValue([wrongIdItem, targetItem]);
    mockUpdateAuthoredContentMeta.mockResolvedValue({} as never);

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PATCH",
      body: JSON.stringify({ id: "same-slug", status: "published", storageId: "cnt_000002" }),
    });
    const response = await PATCH(request);
    const data = await response.json() as { ok: boolean };

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(mockUpdateAuthoredContentMeta).toHaveBeenCalledWith(expect.objectContaining({
      id: "same-slug",
      section: "documentation",
      storageId: "cnt_000002",
      updates: { status: "published" },
    }));
  });

  it("잘못된 status는 400을 반환한다", async () => {
    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PATCH",
      body: JSON.stringify({ id: "my-item", status: "invalid" }),
    });
    const response = await PATCH(request);

    expect(response.status).toBe(400);
    expect(mockUpdateAuthoredContentMeta).not.toHaveBeenCalled();
  });

  it("id에 해당하는 서버 아이템이 없으면 404를 반환한다", async () => {
    mockReadContentState.mockResolvedValue([]);

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PATCH",
      body: JSON.stringify({ id: "my-item", status: "hidden" }),
    });
    const response = await PATCH(request);

    expect(response.status).toBe(404);
    expect(mockUpdateAuthoredContentMeta).not.toHaveBeenCalled();
  });

  it("sortOrders가 있으면 순서를 업데이트한다", async () => {
    const wrongIdItem = makeEntry({ id: "item-a", sortOrder: 1, storageId: "cnt_000001" });
    const item = makeEntry({ categorySlug: "blogs", id: "item-a", section: "documentation", sortOrder: 1, storageId: "cnt_000002" });
    mockReadContentState.mockResolvedValue([wrongIdItem, item]);
    mockUpdateAuthoredContentMeta.mockResolvedValue({} as never);

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PATCH",
      body: JSON.stringify({ sortOrders: [{ id: "item-a", sortOrder: 2, storageId: "cnt_000002" }] }),
    });
    const response = await PATCH(request);

    expect(response.status).toBe(200);
    expect(mockUpdateAuthoredContentMeta).toHaveBeenCalledWith(expect.objectContaining({
      id: "item-a",
      section: "documentation",
      storageId: "cnt_000002",
      updates: { sortOrder: 2 },
    }));
  });
});

describe("DELETE /api/admin/content/state", () => {
  it("id가 없으면 400을 반환한다", async () => {
    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "DELETE",
      body: JSON.stringify({}),
    });
    const response = await DELETE(request);

    expect(response.status).toBe(400);
  });

  it("storageId가 있으면 해당 콘텐츠를 삭제한다", async () => {
    const wrongIdItem = makeEntry({ id: "to-delete", storageId: "cnt_000001" });
    const item = makeEntry({ categorySlug: "blogs", id: "to-delete", section: "documentation", storageId: "cnt_000002" });
    mockReadContentState.mockResolvedValue([wrongIdItem, item]);
    mockDeleteAuthoredContent.mockResolvedValue({ deleted: true });

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "DELETE",
      body: JSON.stringify({ id: "to-delete", storageId: "cnt_000002" }),
    });
    const response = await DELETE(request);
    const data = await response.json() as { ok: boolean };

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(mockDeleteAuthoredContent).toHaveBeenCalledWith(expect.objectContaining({
      id: "to-delete",
      section: "documentation",
      storageId: "cnt_000002",
    }));
  });

  it("id에 해당하는 서버 아이템이 없으면 404를 반환한다", async () => {
    mockReadContentState.mockResolvedValue([]);

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "DELETE",
      body: JSON.stringify({ id: "to-delete" }),
    });
    const response = await DELETE(request);

    expect(response.status).toBe(404);
    expect(mockDeleteAuthoredContent).not.toHaveBeenCalled();
  });
});
