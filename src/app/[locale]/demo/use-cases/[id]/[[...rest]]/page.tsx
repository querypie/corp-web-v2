import type { Metadata } from "next";
import { generateDemoMdxPageMetadata, renderDemoMdxPage } from "@/features/demo/page";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateDemoMdxPageMetadata(params, "use-cases");
}

export default async function UseCaseDemoMdxPage({ params }: Props) {
  return renderDemoMdxPage(params, "use-cases");
}
