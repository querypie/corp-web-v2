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
  updateAuthoredContentMeta: vi.fn(),
}));

import {
  readContentState,
} from "@/features/content/contentState.server";
import {
  deleteAuthoredContent,
  saveAuthoredContent,
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

  it("id 쿼리파라미터가 있으면 단일 아이템을 반환한다", async () => {
    const items = [makeEntry({ id: "target" }), makeEntry({ id: "other" })];
    mockReadContentState.mockResolvedValue(items);

    const response = await GET(makeRequest("http://localhost/api/admin/content/state?id=target"));
    const data = await response.json() as { item: ManagedContentEntry };

    expect(data.item?.id).toBe("target");
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

  it("서버 오류 발생 시 500을 반환한다", async () => {
    mockReadContentState.mockRejectedValue(new Error("disk error"));

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "POST",
      body: JSON.stringify({ items: [makeEntry()] }),
    });
    const response = await POST(request);

    expect(response.status).toBe(500);
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

  it("id와 status가 있으면 상태를 업데이트한다", async () => {
    mockReadContentState.mockResolvedValue([]);

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PATCH",
      body: JSON.stringify({ id: "my-item", status: "published" }),
    });
    const response = await PATCH(request);
    const data = await response.json() as { ok: boolean };

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(mockUpdateAuthoredContentMeta).not.toHaveBeenCalled();
  });

  it("item이 있으면 authored meta도 함께 업데이트한다", async () => {
    const item = makeEntry({ id: "my-item" });
    mockUpdateAuthoredContentMeta.mockResolvedValue({} as never);

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "PATCH",
      body: JSON.stringify({ id: "my-item", status: "hidden", item }),
    });
    await PATCH(request);

    expect(mockUpdateAuthoredContentMeta).toHaveBeenCalled();
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

  it("id가 있으면 콘텐츠를 삭제한다", async () => {
    mockReadContentState.mockResolvedValue([]);

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "DELETE",
      body: JSON.stringify({ id: "to-delete" }),
    });
    const response = await DELETE(request);
    const data = await response.json() as { ok: boolean };

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(mockDeleteAuthoredContent).not.toHaveBeenCalled();
  });

  it("item이 있으면 authored content도 함께 삭제한다", async () => {
    const item = makeEntry({ id: "to-delete" });
    mockDeleteAuthoredContent.mockResolvedValue({ deleted: true });

    const request = makeRequest("http://localhost/api/admin/content/state", {
      method: "DELETE",
      body: JSON.stringify({ id: "to-delete", item }),
    });
    await DELETE(request);

    expect(mockDeleteAuthoredContent).toHaveBeenCalled();
  });
});
