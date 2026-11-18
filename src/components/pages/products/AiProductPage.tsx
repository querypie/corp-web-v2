import type { Locale } from "@/constants/i18n";
import type { AiProductId } from "@/copy/aiProducts.ja";
import AiGatewayPage from "./ai-gateway/AiGatewayPage";
import QevPage from "./qev/QevPage";
import QlmPage from "./qlm/QlmPage";

export default function AiProductPage({ id, locale }: { id: AiProductId; locale: Locale }) {
  if (id === "ai-gateway") return <AiGatewayPage locale={locale} />;
  if (id === "qev") return <QevPage locale={locale} />;
  return <QlmPage locale={locale} />;
}
