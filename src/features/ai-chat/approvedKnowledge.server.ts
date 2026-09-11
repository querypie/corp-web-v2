import "server-only";
import { writeFile } from "fs/promises";
import path from "path";
import { isChatSourceUrl } from "./types";
import { listApprovedAnswers, type UnansweredQuestion } from "./unanswered.server";

const products = new Set(["aip", "acp", "lingo", "notepie", "linkpie", "corpnavi"]);

export function buildApprovedKnowledgeSnapshot(items: UnansweredQuestion[], generatedAt = new Date()) {
  return {
    generatedAt: generatedAt.toISOString(),
    documents: items.flatMap((item) => {
      if (!item.approvedAnswer || !item.approvedSourceUrl || !item.product ||
          !products.has(item.product) || !isChatSourceUrl(item.approvedSourceUrl)) return [];
      return [{
        id: `approved-question-${item.id}-v${item.answerVersion}`,
        product: item.product,
        locale: item.locale,
        title: item.question,
        url: item.approvedSourceUrl,
        chunks: [{
          heading: "Approved Q&A",
          text: `Question: ${item.question}\nAnswer: ${item.approvedAnswer}`,
        }],
      }];
    }),
  };
}

export async function writeApprovedKnowledgeSnapshot() {
  const snapshot = buildApprovedKnowledgeSnapshot(await listApprovedAnswers());
  const target = path.join(process.cwd(), "src/features/ai-chat/approved-knowledge.json");
  await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  return snapshot.documents.length;
}
