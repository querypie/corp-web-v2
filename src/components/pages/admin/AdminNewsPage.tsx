import { readContentState } from "@/features/content/contentState.server";
import { stripManagedContentBodies } from "@/features/content/data";
import AdminManagedContentListPage from "./AdminManagedContentListPage";

export default async function AdminNewsPage() {
  const initialItems = await readContentState("news", { includeBodies: false });

  return (
    <AdminManagedContentListPage
      categorySlug="news"
      description="뉴스 보도자료와 외부 링크, 게시 상태를 관리합니다."
      initialItems={initialItems.map(stripManagedContentBodies)}
      key="news:news"
      section="news"
      title="News"
    />
  );
}
