import { NextResponse } from "next/server";
import {
  deleteAuthoredContent,
  saveAuthoredContent,
  updateAuthoredContentMeta,
} from "@/features/content/authored.server";
import {
  deleteContentState,
  readContentState,
  replaceContentState,
  updateContentStateStatus,
  upsertContentState,
} from "@/features/content/contentState.server";
import { stripManagedContentBodies } from "@/features/content/data";
import type {
  ManagedContentCategorySlug,
  ManagedContentEntry,
  ManagedContentSection,
  ManagedContentStatus,
} from "@/features/content/data";

type ReplaceStateRequest = {
  items?: ManagedContentEntry[];
};

type UpsertStateRequest = {
  currentId?: string;
  item?: ManagedContentEntry;
};

type DeleteStateRequest = {
  id?: string;
};

type UpdateStatusRequest = {
  id?: string;
  status?: ManagedContentStatus;
};

function parseSection(url: string) {
  const section = new URL(url).searchParams.get("section");
  return section as ManagedContentSection | null;
}

function parseCategorySlug(url: string) {
  const categorySlug = new URL(url).searchParams.get("categorySlug");
  return categorySlug as ManagedContentCategorySlug | null;
}

function parseItemId(url: string) {
  return new URL(url).searchParams.get("id");
}

function parseView(url: string) {
  return new URL(url).searchParams.get("view");
}

function isSameItem(left: ManagedContentEntry | undefined, right: ManagedContentEntry) {
  return left ? JSON.stringify(left) === JSON.stringify(right) : false;
}

export async function GET(request: Request) {
  const section = parseSection(request.url) ?? undefined;
  const categorySlug = parseCategorySlug(request.url) ?? undefined;
  const itemId = parseItemId(request.url);
  const view = parseView(request.url);
  const items = await readContentState(section, { categorySlug });

  if (itemId) {
    return NextResponse.json({ item: items.find((entry) => entry.id === itemId) ?? null });
  }

  return NextResponse.json({
    items: view === "list" ? items.map(stripManagedContentBodies) : items,
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ReplaceStateRequest;

    if (!payload.items || !Array.isArray(payload.items)) {
      return NextResponse.json({ error: "items is required" }, { status: 400 });
    }

    const currentItems = await readContentState();
    const currentMap = new Map(currentItems.map((item) => [item.id, item]));
    const payloadSections = new Set(payload.items.map((item) => item.section));
    const nextItems: ManagedContentEntry[] = [];
    for (const item of payload.items) {
      const normalizedItem = item;
      const currentItem = currentMap.get(normalizedItem.id);

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

    const itemsToPersist =
      payloadSections.size === 1
        ? [
            ...nextItems,
            ...currentItems.filter((item) => !payloadSections.has(item.section)),
          ]
        : nextItems;

    const items = await replaceContentState(itemsToPersist);
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to persist content state." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as UpsertStateRequest;
  const item = payload.item;

  if (!item) {
    return NextResponse.json({ error: "item is required" }, { status: 400 });
  }

  const normalizedItem = item;
  const savedItem = await saveAuthoredContent(normalizedItem);

  await upsertContentState(savedItem, payload.currentId);
  return NextResponse.json({ item: savedItem });
}

export async function PATCH(request: Request) {
  const payload = (await request.json()) as UpdateStatusRequest & { item?: ManagedContentEntry };

  if (!payload.id || !payload.status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  }

  if (payload.item) {
    await updateAuthoredContentMeta({
      categorySlug: payload.item.categorySlug,
      id: payload.item.id,
      section: payload.item.section,
      storageId: payload.item.storageId,
      updates: { status: payload.status },
    });
  }

  await updateContentStateStatus(payload.id, payload.status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const payload = (await request.json()) as DeleteStateRequest & { item?: ManagedContentEntry };

  if (!payload.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (payload.item) {
    await deleteAuthoredContent({
      categorySlug: payload.item.categorySlug,
      id: payload.item.id,
      section: payload.item.section,
      storageId: payload.item.storageId,
    });
  }

  await deleteContentState(payload.id);
  return NextResponse.json({ ok: true });
}
