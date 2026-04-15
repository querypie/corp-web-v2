import { notFound } from "next/navigation";
import AdminManagedContentDetailPage from "../../../../../components/pages/admin/AdminManagedContentDetailPage";
import { isAdminSectionCategory } from "@/features/content/config";
import { stripManagedContentBodies } from "@/features/content/data";
import { readContentItem, readContentState } from "@/features/content/contentState.server";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function AdminDocumentationCategoryDetailRoute({ params }: Props) {
  const { category, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isAdminSectionCategory("documentation", category) || category === "all") notFound();

  if (resolvedSlug === "new") {
    return (
      <AdminManagedContentDetailPage
        categorySlug={category as never}
        itemId="new"
        section="documentation"
      />
    );
  }

  const [initialItem, initialItems] = await Promise.all([
    readContentItem("documentation", resolvedSlug, { categorySlug: category as never }),
    readContentState("documentation", { includeBodies: false }),
  ]);

  if (!initialItem) notFound();

  return <AdminManagedContentDetailPage categorySlug={category as never} initialItem={initialItem} initialItems={initialItems.map(stripManagedContentBodies)} itemId={resolvedSlug} section="documentation" />;
}
