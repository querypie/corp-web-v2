import DocsDetailPage, { type DocsDetailPageProps } from "../documentation/DocumentationDetailPage";

export default function NewsDetailPage(props: DocsDetailPageProps) {
  return <DocsDetailPage parentLabel="News" {...props} />;
}
