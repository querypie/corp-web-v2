import { defaultLocale, isLocale } from "@/constants/i18n";
import { isAdminPath } from "@/features/admin/access";
import { isJapaneseSiteHostname } from "@/features/routing/siteDomainRouting";

export const DOCUMENT_LOCALE_HEADER = "x-querypie-document-locale";

export function getDocumentLocale(hostname: string, pathname: string) {
  if (isAdminPath(pathname)) return defaultLocale;
  if (isJapaneseSiteHostname(hostname)) return "ja";

  const locale = pathname.split("/")[1];
  return isLocale(locale) ? locale : defaultLocale;
}
