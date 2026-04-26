import type { Metadata } from "next";
import { generateDemoMdxPageMetadata, renderDemoMdxPage } from "@/features/demo/page";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateDemoMdxPageMetadata(params, "webinars");
}

export default async function WebinarPage({ params }: Props) {
  return renderDemoMdxPage(params, "webinars");
}
