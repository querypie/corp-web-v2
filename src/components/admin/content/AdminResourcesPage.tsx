import { unstable_noStore as noStore } from "next/cache";
import { readContentState } from "@/features/content/contentState.server";
import { stripManagedContentBodies } from "@/features/content/data";
import { type DocsCategorySlug } from "@/features/content/config";
import AdminManagedContentListPage from "./AdminManagedContentListPage";

type AdminResourcesPageProps = {
  categorySlug?: DocsCategorySlug;
};

export default async function AdminResourcesPage({
  categorySlug = "all",
}: AdminResourcesPageProps) {
  noStore();
  const initialItems = await readContentState(
    "resources",
    categorySlug === "all" ? { includeBodies: false } : { categorySlug, includeBodies: false },
  );

  return (
    /* Resources 섹션도 동일한 공통 관리 리스트를 사용한다 */
    <AdminManagedContentListPage
      categorySlug={categorySlug}
      initialItems={initialItems.map(stripManagedContentBodies)}
      key={`resources:${categorySlug}`}
      section="resources"
    />
  );
}
