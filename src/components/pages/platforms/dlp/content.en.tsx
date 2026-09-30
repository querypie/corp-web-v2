import type { Locale } from "@/constants/i18n";
import DlpSolutionContent from "./DlpSolutionContent";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie Data Loss Prevention (DLP)",
  description:
    "QueryPie DLP uses rules and lightweight AI to screen multilingual inputs for sensitive-data risk, then identifies what kind of sensitive information appears and its exact text where deeper analysis is needed.",
  keywords: ["QueryPie DLP", "multilingual DLP", "Data Loss Prevention", "sensitive data detection", "AI security"],
} as const;

export default function DlpENSolutionContent({ locale }: Props) {
  return (
    <DlpSolutionContent
      locale={locale}
      copy={{
        demoItems: [
          {
            title: "ELECTRA-based risk screening demo",
            description: "Enter a sentence to see the lightweight model's risk score and block decision.",
            imageSrc: "/demo/dlp-electra-thumbnail-en.png",
          },
          {
            title: "SLM-based sensitive-data extraction demo",
            description: "Enter a sentence to see the kinds of sensitive data found and the exact text for names, email addresses, phone numbers, and more.",
            imageSrc: "/demo/dlp-demo-thumbnail-en.png",
          },
        ],
        demoLinkLabel: "Try the demo",
        demoTitle: "DLP detection demo",
        description:
          "Generative AI moves information through conversations, documents, code, and prompts—often with sensitive data embedded in ordinary language. QueryPie DLP quickly screens Korean, English, and Japanese inputs for risk, then identifies what kind of sensitive information appears and its exact text in the inputs that need deeper analysis.",
        heading: "Data Loss Prevention",
        huggingFaceDescription:
          "Explore QueryPie's multilingual sensitive-data detection models, model cards, and usage resources on Hugging Face.",
        huggingFaceLabel: "Open Hugging Face",
        huggingFaceTitle: "Use the DLP models on Hugging Face",
        label: "QueryPie DLP",
        modelSections: [
          {
            role: "Fast risk screening",
            title: "Quickly filters risk signals from high-volume inputs.",
            description:
              "QueryPie DLP uses a lightweight ELECTRA-based model to quickly evaluate sensitive-data risk in text that rules alone cannot resolve. It helps identify the inputs that need closer attention, even at high volume.",
            flowTitle: "Fast risk-screening capabilities",
            flow: [
              { label: "Understand context", value: "Examines text that patterns and formats alone cannot classify." },
              { label: "Show risk", value: "Scores the likelihood that the input contains sensitive data." },
              { label: "Select for review", value: "Identifies high-risk or ambiguous inputs for closer review." },
            ],
          },
          {
            role: "Precise sensitive-data extraction",
            title: "Finds the kind of sensitive data and its exact text.",
            description:
              "QueryPie DLP uses an SLM-based precision model to analyze context and identify what kind of sensitive information appears and the text as written in the input, so the content that needs protection is clear.",
            flowTitle: "Precise extraction capabilities",
            flow: [
              { label: "Identify the kind of data", value: "Distinguishes names, account details, credentials, and other sensitive data." },
              { label: "Find the exact text", value: "Shows how the sensitive information is written in the input." },
              { label: "Consider context", value: "Reads the surrounding text to assess whether an expression outside a fixed pattern is sensitive." },
            ],
          },
        ],
        processTitle: "From rule checks to risk screening and sensitive-data extraction",
        processDescription:
          "Rules check clear matches, an ELECTRA-based model screens risk, and an SLM-based model extracts sensitive data.",
        processSteps: [
          {
            title: "Check immediately with rules",
            body: "Regular expressions and keywords find sensitive data with predictable formats first. Clear matches can be decided without waiting for AI analysis.",
          },
          {
            title: "Screen risk with an ELECTRA-based model",
            body: "A lightweight classifier reads text that did not match the rules and calculates a risk score. High-risk and ambiguous inputs are selected for closer review.",
          },
          {
            title: "Extract sensitive data with an SLM-based model",
            body: "For input that needs precision analysis, the model finds what kind of sensitive information appears and its exact text. A separate program checks the source to calculate its position.",
          },
        ],
      }}
    />
  );
}
