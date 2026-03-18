import { getAdminCategoryPageMeta, type DemoCategorySlug } from "@/features/content/config";
import AdminManagedContentListPage from "./AdminManagedContentListPage";

type AdminDemoPageProps = {
  categorySlug?: DemoCategorySlug;
};

export default function AdminDemoPage({
  categorySlug = "all",
}: AdminDemoPageProps) {
  const { description, title } = getAdminCategoryPageMeta("demo", categorySlug);

  return (
    /* Demo 섹션은 공통 관리 리스트 페이지를 카테고리별로 재사용한다 */
    <AdminManagedContentListPage
      categorySlug={categorySlug}
      description={description}
      section="demo"
      title={title}
    />
  );
}
