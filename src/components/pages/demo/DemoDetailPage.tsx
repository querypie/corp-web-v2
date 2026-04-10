import DocsDetailPage, { type DocsDetailPageProps } from "../documentation/DocumentationDetailPage";

export default function DemoDetailPage(props: DocsDetailPageProps) {
  return <DocsDetailPage parentLabel="Demo" {...props} />;
}
