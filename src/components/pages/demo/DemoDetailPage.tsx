import DocsDetailPage, { type DocsDetailPageProps } from "../resources/ResourcesDetailPage";

export default function DemoDetailPage(props: DocsDetailPageProps) {
  return <DocsDetailPage parentLabel="Demo" {...props} />;
}
