import NewsListSection from "./NewsListSection";
import type { Locale } from "@/constants/i18n";

type HomeNewsItem = {
  href: string;
  imageSrc: string;
  isExternal?: boolean;
  title: string;
};

type HomeNewsListClientSectionProps = {
  fallbackItems: HomeNewsItem[];
  locale: Locale;
  title: string;
};

export default function HomeNewsListClientSection({
  fallbackItems,
  locale: _locale,
  title,
}: HomeNewsListClientSectionProps) {
  return <NewsListSection items={fallbackItems} title={title} />;
}
