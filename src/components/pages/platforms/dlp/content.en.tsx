import type { Locale } from "@/constants/i18n";
import DlpSolutionContent from "./DlpSolutionContent";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie Data Loss Prevention (DLP)",
  description:
    "QueryPie's multilingual DLP research combines rule checks, lightweight AI screening, and precise source-phrase extraction to identify sensitive-data risk in AI inputs.",
  keywords: ["QueryPie DLP", "multilingual DLP", "Data Loss Prevention", "sensitive data detection", "AI security"],
} as const;

export default function DlpENSolutionContent({ locale }: Props) {
  return (
    <DlpSolutionContent
      locale={locale}
      copy={{
        benefitItems: [
          {
            title: "Screen quickly with rules and lightweight AI",
            body: "Regular-expression and keyword rules check predictable values first. For unmatched inputs, an ELECTRA-based lightweight model assigns a risk score and supports high-throughput screening on CPUs.",
          },
          {
            title: "Extract types and source phrases precisely",
            body: "A precision small language model identifies the sensitive-data type and the phrase as it appears in the source. A separate program verifies the original text and calculates exact positions for downstream policy actions.",
          },
          {
            title: "Research for multilingual business data",
            body: "The research covers Korean, English, and Japanese business text, code, and altered formats across 21 sensitive-data types. In internal evaluation, the Korean lightweight model reached approximately 94% F1 with a 17.3 ms average response time.",
          },
        ],
        demoDescription:
          "Open the multilingual sensitive-data detection demo in a dedicated full-screen view to avoid nested scrolling.",
        demoLaunchLabel: "Launch full-screen demo",
        demoTitle: "Try the DLP detection demo",
        description:
          "Generative AI moves information through conversations, documents, code, and prompts—often with sensitive data embedded in ordinary language. QueryPie’s multilingual DLP research separates fast risk screening from precise source-phrase extraction, reserving deeper analysis for the inputs that need it.",
        featureBody:
          "The architecture considers names in context, credentials embedded in code, and known formats altered with spaces or special characters. Low-risk inputs can pass, while high-risk and ambiguous gray-zone inputs proceed to further judgment and precision extraction of data types and exact source phrases.",
        featureImageAlt: "Data loss prevention detection architecture",
        featureImageSrc: "/resources/white-papers/dlp-detection-architecture-en.png",
        featureTitle: "Design fast risk screening and precise source extraction together.",
        heading: "Data Loss Prevention",
        label: "QueryPie DLP Research",
        tutorialTitle: "DLP demo video",
      }}
    />
  );
}
