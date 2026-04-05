import DocsDetailPage, { type DocsDetailPageProps } from "../docs/DocsDetailPage";

export default function NewsDetailPage(props: DocsDetailPageProps) {
  return <DocsDetailPage parentLabel="News" {...props} />;
}
