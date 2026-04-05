import { readContentState } from "@/features/content/contentState.server";
import { getAdminCategoryPageMeta, type DocsCategorySlug } from "@/features/content/config";
import AdminManagedContentListPage from "./AdminManagedContentListPage";

type AdminDocumentationPageProps = {
  categorySlug?: DocsCategorySlug;
};

export default async function AdminDocumentationPage({
  categorySlug = "all",
}: AdminDocumentationPageProps) {
  const initialItems = await readContentState("documentation");
  const { description, title } = getAdminCategoryPageMeta("documentation", categorySlug);

  return (
    /* Documentation 섹션도 동일한 공통 관리 리스트를 사용한다 */
    <AdminManagedContentListPage
      categorySlug={categorySlug}
      description={description}
      initialItems={initialItems}
      key={`documentation:${categorySlug}`}
      section="documentation"
      title={title}
    />
  );
}
