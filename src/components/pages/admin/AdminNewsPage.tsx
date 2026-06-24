import { readContentState } from "@/features/content/contentState.server";
import { stripManagedContentBodies } from "@/features/content/data";
import AdminManagedContentListPage from "./AdminManagedContentListPage";

export default async function AdminNewsPage() {
  const initialItems = await readContentState("news", { includeBodies: false });

  return (
    <AdminManagedContentListPage
      categorySlug="news"
      initialItems={initialItems.map(stripManagedContentBodies)}
      key="news:news"
      section="news"
    />
  );
}
