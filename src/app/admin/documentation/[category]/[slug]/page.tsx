import { notFound } from "next/navigation";
import AdminManagedContentDetailPage from "../../../../../components/pages/admin/AdminManagedContentDetailPage";
import { isAdminSectionCategory } from "@/features/content/config";
import { readContentState } from "@/features/content/contentState.server";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function AdminDocumentationCategoryDetailRoute({ params }: Props) {
  const { category, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isAdminSectionCategory("documentation", category) || category === "all") notFound();

  const initialItems = await readContentState("documentation");

  return <AdminManagedContentDetailPage categorySlug={category as never} initialItems={initialItems} itemId={resolvedSlug} section="documentation" />;
}
