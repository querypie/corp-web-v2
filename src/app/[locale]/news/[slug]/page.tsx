// Scheduled articles must be evaluated on each request, including pre-release 404s.
export const dynamic = "force-dynamic";

export {
  default,
  generateMetadata,
  generateStaticParams,
} from "../../company/news/[slug]/page";
