import ResourcesPage, { generateMetadata as generateResourcesMetadata } from "@/app/[locale]/features/resources/page";

type Props = {
  params: Promise<{ locale: string }>;
};

const searchParams = Promise.resolve({ category: "white-papers" });

export default function WhitepapersPage({ params }: Props) {
  return ResourcesPage({ params, searchParams });
}

export function generateMetadata({ params }: Props) {
  return generateResourcesMetadata({ params, searchParams });
}
