import type { Locale } from "@/constants/i18n";

export function getDlpDemoUrl(locale: Locale) {
  return `https://querypie--dlp-demo.srv.kpb4r.mlxp.ncloud.com/?lang=${locale}`;
}
