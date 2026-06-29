import DemoPage, { generateMetadata as generateDemoMetadata } from "@/app/[locale]/features/demo/page";

type Props = {
  params: Promise<{ locale: string }>;
};

const searchParams = Promise.resolve({ category: "acp-features" });

export default function AcpDemoPage({ params }: Props) {
  return DemoPage({ params, searchParams });
}

export function generateMetadata({ params }: Props) {
  return generateDemoMetadata({ params, searchParams });
}
