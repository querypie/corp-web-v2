import { readContentState } from "@/features/content/contentState.server";
import AdminManagedContentDetailPage from "../../../../components/pages/admin/AdminManagedContentDetailPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminNewsDetailRoute({ params }: Props) {
  const { slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);
  const initialItems = await readContentState("news");

  return <AdminManagedContentDetailPage categorySlug="news" initialItems={initialItems} itemId={resolvedSlug} section="news" />;
}
