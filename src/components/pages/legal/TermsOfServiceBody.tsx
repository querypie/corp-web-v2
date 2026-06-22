import LegalContentBody from "./LegalContentBody";

type TermsOfServiceBodyProps = {
  bodyHtml: string;
};

export default function TermsOfServiceBody({
  bodyHtml,
}: TermsOfServiceBodyProps) {
  return <LegalContentBody bodyHtml={bodyHtml} />;
}
