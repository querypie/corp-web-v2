import DocumentationPage, { generateMetadata as generateDocumentationMetadata } from "@/app/[locale]/features/documentation/page";

type Props = {
  params: Promise<{ locale: string }>;
};

const searchParams = Promise.resolve({ category: "glossary" });

export default function GlossaryPage({ params }: Props) {
  return DocumentationPage({ params, searchParams });
}

export function generateMetadata({ params }: Props) {
  return generateDocumentationMetadata({ params, searchParams });
}
