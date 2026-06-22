import LegalContentBody from "./LegalContentBody";

type PrivacyPolicyBodyProps = {
  bodyHtml: string;
};

export default function PrivacyPolicyBody({
  bodyHtml,
}: PrivacyPolicyBodyProps) {
  return <LegalContentBody bodyHtml={bodyHtml} tableTone="deep" />;
}
