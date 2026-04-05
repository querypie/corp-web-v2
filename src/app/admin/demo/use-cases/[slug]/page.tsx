import { readContentState } from "@/features/content/contentState.server";
import AdminManagedContentDetailPage from "../../../../../components/pages/admin/AdminManagedContentDetailPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminDemoUseCaseDetailRoute({ params }: Props) {
  const { slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);
  const initialItems = await readContentState("demo");

  return <AdminManagedContentDetailPage categorySlug="use-cases" initialItems={initialItems} itemId={resolvedSlug} section="demo" />;
}
