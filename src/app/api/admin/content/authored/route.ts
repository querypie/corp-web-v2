import { NextResponse } from "next/server";
import {
  deleteAuthoredContent,
  saveAuthoredContent,
  updateAuthoredContentMeta,
} from "@/features/content/authored.server";
import type { ManagedContentEntry } from "@/features/content/data";

type SaveAuthoredRequest = {
  item?: ManagedContentEntry;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SaveAuthoredRequest;
  const item = payload.item;

  if (!item) {
    return NextResponse.json({ error: "item is required" }, { status: 400 });
  }

  if (item.section === "news") {
    return NextResponse.json(
      { error: "News content is not stored in the authored TipTap store." },
      { status: 400 },
    );
  }

  try {
    const savedItem = await saveAuthoredContent(item);
    return NextResponse.json({ item: savedItem });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save authored content.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const payload = (await request.json()) as SaveAuthoredRequest;
  const item = payload.item;

  if (!item) {
    return NextResponse.json({ error: "item is required" }, { status: 400 });
  }

  if (item.section === "news") {
    return NextResponse.json(
      { error: "News content is not stored in the authored TipTap store." },
      { status: 400 },
    );
  }

  try {
    const result = await deleteAuthoredContent({
      categorySlug: item.categorySlug,
      id: item.id,
      section: item.section,
      storageId: item.storageId,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete authored content.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const payload = (await request.json()) as SaveAuthoredRequest & {
    updates?: { sortOrder?: number; status?: "hidden" | "published" };
  };
  const item = payload.item;
  const updates = payload.updates;

  if (!item || !updates) {
    return NextResponse.json({ error: "item and updates are required" }, { status: 400 });
  }

  try {
    const meta = await updateAuthoredContentMeta({
      categorySlug: item.categorySlug,
      id: item.id,
      section: item.section,
      storageId: item.storageId,
      updates,
    });
    return NextResponse.json({ meta });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update authored content.",
      },
      { status: 500 },
    );
  }
}
