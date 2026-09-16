import type { Metadata } from "next";
import AiChatStatusPage from "@/components/internal/AiChatStatusPage";
import { aiChatStatusCopy } from "@/copy/aiChatStatus";
import { getAiChatStatusConfig } from "@/features/ai-chat/status.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: aiChatStatusCopy.metadataTitle,
  robots: {
    follow: false,
    index: false,
  },
};

export default async function InternalAiChatStatusRoute() {
  const config = getAiChatStatusConfig();
  return <AiChatStatusPage config={config} />;
}
