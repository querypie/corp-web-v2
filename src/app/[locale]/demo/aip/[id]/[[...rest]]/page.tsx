import type { Metadata } from "next";
import { generateDemoMdxPageMetadata, renderDemoMdxPage } from "@/features/demo/page";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateDemoMdxPageMetadata(params, "aip");
}

export default async function AipDemoMdxPage({ params }: Props) {
  return renderDemoMdxPage(params, "aip");
}
