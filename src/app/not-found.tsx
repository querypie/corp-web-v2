import NotFoundPage from "@/components/pages/error/NotFoundPage";
import { isJapaneseSiteHostname } from "@/features/routing/siteDomainRouting";
import { getRequestSiteOrigin } from "@/features/seo/requestUrl.server";

export default async function NotFound() {
  const origin = await getRequestSiteOrigin();
  return <NotFoundPage japaneseSite={isJapaneseSiteHostname(origin.hostname)} />;
}
