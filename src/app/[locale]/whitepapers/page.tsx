import DocumentationPage, { generateMetadata as generateDocumentationMetadata } from "@/app/[locale]/features/documentation/page";

type Props = {
  params: Promise<{ locale: string }>;
};

const searchParams = Promise.resolve({ category: "white-papers" });

export default function WhitepapersPage({ params }: Props) {
  return DocumentationPage({ params, searchParams });
}

export function generateMetadata({ params }: Props) {
  return generateDocumentationMetadata({ params, searchParams });
}
