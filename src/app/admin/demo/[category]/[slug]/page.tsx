import { notFound } from "next/navigation";
import AdminManagedContentDetailPage from "../../../../../components/pages/admin/AdminManagedContentDetailPage";
import { isAdminSectionCategory } from "@/features/content/config";
import { stripManagedContentBodies } from "@/features/content/data";
import { readContentItem, readContentState } from "@/features/content/contentState.server";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function AdminDemoCategoryDetailRoute({ params }: Props) {
  const { category, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isAdminSectionCategory("demo", category) || category === "all") notFound();

  const [initialItem, initialItems] = await Promise.all([
    readContentItem("demo", resolvedSlug, { categorySlug: category as never }),
    readContentState("demo"),
  ]);

  if (!initialItem) notFound();

  return <AdminManagedContentDetailPage categorySlug={category as never} initialItem={initialItem} initialItems={initialItems.map(stripManagedContentBodies)} itemId={resolvedSlug} section="demo" />;
}
