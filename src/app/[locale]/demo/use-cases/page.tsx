import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/constants/i18n";
import {
  buildPublicDemoListMetadata,
  renderPublicDemoListPage,
} from "@/features/demo/listPage";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function UseCasesDemoListPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  return renderPublicDemoListPage(locale, "use-cases", page);
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { page } = await searchParams;

  if (!isLocale(locale)) {
    return {};
  }

  return buildPublicDemoListMetadata(locale, "use-cases", page);
}
