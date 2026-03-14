import DocsDetailPage, { type DocsDetailPageProps } from "../docs/DocsDetailPage";

export default function DemoDetailPage(props: DocsDetailPageProps) {
  return <DocsDetailPage parentLabel="Demo" {...props} />;
}
