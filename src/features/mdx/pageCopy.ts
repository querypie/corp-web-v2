import type { Locale } from "@/constants/i18n";
import type { MdxListCategory } from "./types";

type MdxListPageCopy = {
  metadataTitle: string;
  title: string;
};

const MDX_LIST_PAGE_COPY: Record<MdxListCategory, Record<Locale, MdxListPageCopy>> = {
  blog: {
    en: { metadataTitle: "Blog", title: "Blog" },
    ja: { metadataTitle: "ブログ", title: "ブログ" },
    ko: { metadataTitle: "블로그", title: "블로그" },
  },
  "white-paper": {
    en: { metadataTitle: "White Papers", title: "White Papers" },
    ja: { metadataTitle: "ホワイトペーパー", title: "ホワイトペーパー" },
    ko: { metadataTitle: "화이트페이퍼", title: "화이트페이퍼" },
  },
};

export function getMdxListPageCopy(category: MdxListCategory, locale: Locale): MdxListPageCopy {
  return MDX_LIST_PAGE_COPY[category][locale];
}
