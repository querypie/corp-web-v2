import { unstable_noStore as noStore } from "next/cache";
import { readContentState } from "@/features/content/contentState.server";
import { stripManagedContentBodies } from "@/features/content/data";
import { getAdminCategoryPageMeta, type DocsCategorySlug } from "@/features/content/config";
import AdminManagedContentListPage from "./AdminManagedContentListPage";

type AdminDocumentationPageProps = {
  categorySlug?: DocsCategorySlug;
};

export default async function AdminDocumentationPage({
  categorySlug = "all",
}: AdminDocumentationPageProps) {
  noStore();
  const initialItems = await readContentState(
    "documentation",
    categorySlug === "all" ? { includeBodies: false } : { categorySlug, includeBodies: false },
  );
  const { description, title } = getAdminCategoryPageMeta("documentation", categorySlug);

  return (
    /* Documentation 섹션도 동일한 공통 관리 리스트를 사용한다 */
    <AdminManagedContentListPage
      categorySlug={categorySlug}
      description={description}
      initialItems={initialItems.map(stripManagedContentBodies)}
      key={`documentation:${categorySlug}`}
      section="documentation"
      title={title}
    />
  );
}
