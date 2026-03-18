import { notFound } from "next/navigation";
import AdminManagedContentDetailPage from "../../../../../components/pages/admin/AdminManagedContentDetailPage";
import { isAdminSectionCategory } from "@/features/content/config";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function AdminDocumentationCategoryDetailRoute({ params }: Props) {
  const { category, slug } = await params;

  if (!isAdminSectionCategory("documentation", category) || category === "all") notFound();

  return <AdminManagedContentDetailPage categorySlug={category as never} itemId={slug} section="documentation" />;
}
