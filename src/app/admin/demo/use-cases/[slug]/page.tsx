import { notFound } from "next/navigation";
import { readContentItem, readContentState } from "@/features/content/contentState.server";
import { stripManagedContentBodies } from "@/features/content/data";
import AdminManagedContentDetailPage from "../../../../../components/pages/admin/AdminManagedContentDetailPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminDemoUseCaseDetailRoute({ params }: Props) {
  const { slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);
  const [initialItem, initialItems] = await Promise.all([
    readContentItem("demo", resolvedSlug, { categorySlug: "use-cases" }),
    readContentState("demo"),
  ]);

  if (!initialItem) notFound();

  return <AdminManagedContentDetailPage categorySlug="use-cases" initialItem={initialItem} initialItems={initialItems.map(stripManagedContentBodies)} itemId={resolvedSlug} section="demo" />;
}
