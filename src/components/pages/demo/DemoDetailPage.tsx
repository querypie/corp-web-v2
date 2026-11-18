import ContentDetailPage, { type ContentDetailPageProps } from "@/components/content/ContentDetailPage";

export default function DemoDetailPage(props: ContentDetailPageProps) {
  return <ContentDetailPage parentLabel="Demo" {...props} />;
}
