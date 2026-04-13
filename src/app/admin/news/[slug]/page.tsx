import { notFound } from "next/navigation";
import { stripManagedContentBodies } from "@/features/content/data";
import { readContentItem, readContentState } from "@/features/content/contentState.server";
import AdminManagedContentDetailPage from "../../../../components/pages/admin/AdminManagedContentDetailPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminNewsDetailRoute({ params }: Props) {
  const { slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);
  const [initialItem, initialItems] = await Promise.all([
    readContentItem("news", resolvedSlug, { categorySlug: "news" }),
    readContentState("news"),
  ]);

  if (!initialItem) notFound();

  return <AdminManagedContentDetailPage categorySlug="news" initialItem={initialItem} initialItems={initialItems.map(stripManagedContentBodies)} itemId={resolvedSlug} section="news" />;
}
