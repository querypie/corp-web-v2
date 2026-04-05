import NewsListPage from "./NewsListPage";
import type { Locale } from "@/constants/i18n";

export default function NewsListClientPage({
  fallbackItems,
  locale,
  title,
}: {
  fallbackItems: Array<{
    date: string;
    href: string;
    imageSrc: string;
    isExternal?: boolean;
    summary: string;
    title: string;
  }>;
  locale: Locale;
  title: string;
}) {
  return (
    <NewsListPage
      items={fallbackItems}
      locale={locale}
      title={title}
    />
  );
}
