import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getLocalePath, locales } from "@/constants/i18n";
import {
  deleteAuthoredContent,
  saveAuthoredContent,
  TiptapHtmlRenderError,
  updateAuthoredContentMeta,
} from "@/features/content/authored.server";
import { readContentState } from "@/features/content/contentState.server";
import { stripManagedContentBodies } from "@/features/content/data";
import type {
  ManagedContentCategorySlug,
  ManagedContentEntry,
  ManagedContentSection,
  ManagedContentStatus,
} from "@/features/content/data";

type ReplaceStateRequest = {
  items?: ManagedContentEntry[];
  preserveExistingBodies?: boolean;
};

type UpsertStateRequest = {
  currentId?: string;
  item?: ManagedContentEntry;
  preserveExistingBodies?: boolean;
  shiftSiblingsForNew?: boolean;
};

type DeleteStateRequest = {
  id?: string;
  storageId?: string;
};

type UpdateStatusRequest = {
  id?: string;
  sortOrders?: Array<{
    id: string;
    sortOrder: number;
    storageId?: string;
  }>;
  status?: ManagedContentStatus;
  storageId?: string;
};

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function contentStateErrorResponse(error: unknown) {
  if (error instanceof TiptapHtmlRenderError) {
    return NextResponse.json(
      {
        code: error.code,
        detail: error.reason,
        error: "본문 HTML 변환에 실패했습니다.",
        locale: error.locale,
        suggestions: error.suggestions,
      },
      { status: 422 },
    );
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Failed to persist content state." },
    { status: 500 },
  );
}

function parseSection(url: string) {
  const section = new URL(url).searchParams.get("section");
  return isManagedContentSection(section) ? section : null;
}

function parseCategorySlug(url: string) {
  const categorySlug = new URL(url).searchParams.get("categorySlug");
  return isManagedContentCategorySlug(categorySlug) ? categorySlug : null;
}

function parseItemId(url: string) {
  return new URL(url).searchParams.get("id");
}

function parseStorageId(url: string) {
  return new URL(url).searchParams.get("storageId");
}

function parseView(url: string) {
  return new URL(url).searchParams.get("view");
}

function isManagedContentSection(value: unknown): value is ManagedContentSection {
  return value === "demo" || value === "documentation" || value === "news";
}

function isManagedContentCategorySlug(value: unknown): value is ManagedContentCategorySlug {
  return (
    value === "use-cases" ||
    value === "aip-features" ||
    value === "acp-features" ||
    value === "webinars" ||
    value === "introduction" ||
    value === "glossary" ||
    value === "manuals" ||
    value === "white-papers" ||
    value === "blogs" ||
    value === "news"
  );
}

function isManagedContentStatus(value: unknown): value is ManagedContentStatus {
  return value === "hidden" || value === "published";
}

function isCategorySlugAllowedForSection(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
) {
  if (section === "news") {
    return categorySlug === "news";
  }

  if (section === "demo") {
    return (
      categorySlug === "use-cases" ||
      categorySlug === "aip-features" ||
      categorySlug === "acp-features" ||
      categorySlug === "webinars"
    );
  }

  return (
    categorySlug === "introduction" ||
    categorySlug === "glossary" ||
    categorySlug === "manuals" ||
    categorySlug === "white-papers" ||
    categorySlug === "blogs"
  );
}

function validateManagedContentItem(item: ManagedContentEntry) {
  if (!isManagedContentSection(item.section)) {
    return "Invalid section";
  }

  if (!isManagedContentCategorySlug(item.categorySlug)) {
    return "Invalid categorySlug";
  }

  if (!isCategorySlugAllowedForSection(item.section, item.categorySlug)) {
    return "categorySlug is not allowed for section";
  }

  return null;
}

function findCurrentItem(
  items: ManagedContentEntry[],
  identity: {
    categorySlug?: ManagedContentCategorySlug;
    id?: string;
    section?: ManagedContentSection;
    storageId?: string;
  },
) {
  if (identity.storageId) {
    const item = items.find((entry) => entry.storageId === identity.storageId);

    if (item) {
      return item;
    }
  }

  if (!identity.id) {
    return undefined;
  }

  if (identity.section && identity.categorySlug) {
    const item = items.find((entry) =>
      entry.id === identity.id &&
      entry.section === identity.section &&
      entry.categorySlug === identity.categorySlug,
    );

    if (item) {
      return item;
    }
  }

  return items.find((entry) => entry.id === identity.id);
}

function isSameItem(left: ManagedContentEntry | undefined, right: ManagedContentEntry) {
  return left ? JSON.stringify(left) === JSON.stringify(right) : false;
}

function hasBodyContent(item: Pick<ManagedContentEntry, "bodyHtml" | "bodyRichText"> | undefined) {
  if (!item) return false;

  return Object.values(item.bodyHtml).some((value) => value.trim().length > 0)
    || Object.values(item.bodyRichText).some((value) => value.trim().length > 0);
}

function mergeBodiesFromCurrent(
  item: ManagedContentEntry,
  currentItem: ManagedContentEntry | undefined,
  preserveExistingBodies = false,
) {
  if (!preserveExistingBodies || !currentItem) {
    return item;
  }

  if (hasBodyContent(item) || !hasBodyContent(currentItem)) {
    return item;
  }

  return {
    ...item,
    bodyHtml: currentItem.bodyHtml,
    bodyRichText: currentItem.bodyRichText,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawSection = url.searchParams.get("section");
  const rawCategorySlug = url.searchParams.get("categorySlug");
  const section = parseSection(request.url) ?? undefined;
  const categorySlug = parseCategorySlug(request.url) ?? undefined;
  const itemId = parseItemId(request.url);
  const storageId = parseStorageId(request.url);
  const view = parseView(request.url);

  if (rawSection && !section) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  if (rawCategorySlug && !categorySlug) {
    return NextResponse.json({ error: "Invalid categorySlug" }, { status: 400 });
  }

  if (section && categorySlug && !isCategorySlugAllowedForSection(section, categorySlug)) {
    return NextResponse.json({ error: "categorySlug is not allowed for section" }, { status: 400 });
  }

  const items = await readContentState(section, {
    categorySlug,
    includeBodies: view !== "list",
  });

  if (itemId || storageId) {
    const item = storageId
      ? items.find((entry) => entry.storageId === storageId) ?? null
      : items.find((entry) => entry.id === itemId) ?? null;

    return NextResponse.json(
      { item },
      { headers: NO_STORE_HEADERS },
    );
  }

  return NextResponse.json({
    items: view === "list" ? items.map(stripManagedContentBodies) : items,
  }, {
    headers: NO_STORE_HEADERS,
  });
}

function revalidateAdminPaths(item: Pick<ManagedContentEntry, "section" | "categorySlug" | "id">) {
  revalidatePath(`/admin/${item.section}`);

  if (item.section === "news") {
    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${item.id}`);
    return;
  }

  revalidatePath(`/admin/${item.section}/${item.categorySlug}`);
  revalidatePath(`/admin/${item.section}/${item.categorySlug}/${item.id}`);
}

function revalidatePublicPaths(item: Pick<ManagedContentEntry, "section" | "id">) {
  for (const locale of locales) {
    if (item.section === "documentation") {
      revalidatePath(getLocalePath(locale, "/features/documentation"));
      revalidatePath(getLocalePath(locale, `/features/documentation/${item.id}`));
      revalidatePath(getLocalePath(locale, `/features/documentation/${item.id}/download`));
      continue;
    }

    if (item.section === "demo") {
      revalidatePath(getLocalePath(locale, "/features/demo"));
      revalidatePath(getLocalePath(locale, `/features/demo/${item.id}`));
      revalidatePath(getLocalePath(locale, `/features/demo/${item.id}/download`));
      continue;
    }

    revalidatePath(getLocalePath(locale, "/company/news"));
    revalidatePath(getLocalePath(locale, `/company/news/${item.id}`));
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ReplaceStateRequest;

    if (!payload.items || !Array.isArray(payload.items)) {
      return NextResponse.json({ error: "items is required" }, { status: 400 });
    }

    const currentItems = await readContentState();
    const nextItems: ManagedContentEntry[] = [];
    for (const item of payload.items) {
      const validationError = validateManagedContentItem(item);

      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      const currentItem = findCurrentItem(currentItems, {
        categorySlug: item.categorySlug,
        id: item.id,
        section: item.section,
        storageId: item.storageId,
      });
      const normalizedItem = mergeBodiesFromCurrent(
        item,
        currentItem,
        payload.preserveExistingBodies,
      );

      if (isSameItem(currentItem, normalizedItem)) {
        nextItems.push(normalizedItem);
        continue;
      }

      const savedItem = await saveAuthoredContent(
        normalizedItem.storageId || currentItem?.storageId
          ? {
              ...normalizedItem,
              storageId: normalizedItem.storageId ?? currentItem?.storageId,
            }
          : normalizedItem,
      );

      nextItems.push(savedItem);
    }

    nextItems.forEach((item) => {
      revalidateAdminPaths(item);
      revalidatePublicPaths(item);
    });

    const items = await readContentState();
    return NextResponse.json({ items });
  } catch (error) {
    return contentStateErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as UpsertStateRequest;
    const item = payload.item;

    if (!item) {
      return NextResponse.json({ error: "item is required" }, { status: 400 });
    }

    const validationError = validateManagedContentItem(item);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const currentItems = await readContentState();
    const currentItem = findCurrentItem(currentItems, {
      categorySlug: item.categorySlug,
      id: payload.currentId ?? item.id,
      section: item.section,
      storageId: item.storageId,
    });
    const normalizedItem = mergeBodiesFromCurrent(
      item,
      currentItem,
      payload.preserveExistingBodies,
    );
    const savedItem = await saveAuthoredContent(normalizedItem);

    if (payload.shiftSiblingsForNew && !currentItem) {
      const siblingItems = currentItems.filter(
        (entry) =>
          entry.section === savedItem.section &&
          entry.categorySlug === savedItem.categorySlug &&
          entry.id !== savedItem.id,
      );

      await Promise.all(
        siblingItems.map((entry) =>
          updateAuthoredContentMeta({
            categorySlug: entry.categorySlug,
            id: entry.id,
            section: entry.section,
            storageId: entry.storageId,
            updates: { sortOrder: entry.sortOrder + 1 },
          }),
        ),
      );

      siblingItems.forEach((entry) => {
        revalidateAdminPaths(entry);
        revalidatePublicPaths(entry);
      });
    }

    revalidateAdminPaths(savedItem);
    revalidatePublicPaths(savedItem);

    return NextResponse.json({ item: savedItem });
  } catch (error) {
    return contentStateErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  const payload = (await request.json()) as UpdateStatusRequest & { item?: ManagedContentEntry };

  if (payload.sortOrders) {
    if (!Array.isArray(payload.sortOrders) || payload.sortOrders.length === 0) {
      return NextResponse.json({ error: "sortOrders must be a non-empty array" }, { status: 400 });
    }

    const currentItems = await readContentState();
    const missingUpdate = payload.sortOrders.find((update) => !findCurrentItem(currentItems, update));

    if (missingUpdate) {
      return NextResponse.json({ error: `Content item not found: ${missingUpdate.storageId ?? missingUpdate.id}` }, { status: 404 });
    }

    await Promise.all(
      payload.sortOrders.map((update) => {
        const currentItem = findCurrentItem(currentItems, update)!;

        return updateAuthoredContentMeta({
          categorySlug: currentItem.categorySlug,
          id: currentItem.id,
          section: currentItem.section,
          storageId: currentItem.storageId,
          updates: { sortOrder: update.sortOrder },
        });
      }),
    );

    payload.sortOrders.forEach((update) => {
      const currentItem = findCurrentItem(currentItems, update)!;

      revalidateAdminPaths(currentItem);
      revalidatePublicPaths(currentItem);
    });

    return NextResponse.json({ ok: true });
  }

  if ((!payload.id && !payload.storageId) || !payload.status) {
    return NextResponse.json({ error: "id or storageId and status are required" }, { status: 400 });
  }

  if (!isManagedContentStatus(payload.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const currentItem = findCurrentItem(await readContentState(), payload);

  if (!currentItem) {
    return NextResponse.json({ error: "Content item not found" }, { status: 404 });
  }

  await updateAuthoredContentMeta({
    categorySlug: currentItem.categorySlug,
    id: currentItem.id,
    section: currentItem.section,
    storageId: currentItem.storageId,
    updates: { status: payload.status },
  });
  revalidateAdminPaths(currentItem);
  revalidatePublicPaths(currentItem);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const payload = (await request.json()) as DeleteStateRequest & { item?: ManagedContentEntry };

  if (!payload.id && !payload.storageId) {
    return NextResponse.json({ error: "id or storageId is required" }, { status: 400 });
  }

  const currentItem = findCurrentItem(await readContentState(), payload);

  if (!currentItem) {
    return NextResponse.json({ error: "Content item not found" }, { status: 404 });
  }

  await deleteAuthoredContent({
    categorySlug: currentItem.categorySlug,
    id: currentItem.id,
    section: currentItem.section,
    storageId: currentItem.storageId,
  });
  revalidateAdminPaths(currentItem);
  revalidatePublicPaths(currentItem);

  return NextResponse.json({ ok: true });
}
