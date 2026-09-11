"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { UnansweredQuestion } from "@/features/ai-chat/unanswered.server";

const products = ["aip", "acp", "lingo", "notepie", "linkpie", "corpnavi"];

type Draft = { product: string; answer: string; sourceUrl: string };

export default function AdminAiChatPage() {
  const [items, setItems] = useState<UnansweredQuestion[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/ai-chat/unanswered", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.items)) throw new Error();
      if (!data.configured) {
        setItems([]);
        setError("AI 상담 DB가 설정되지 않았습니다. AI_CHAT_DATABASE_URL과 스키마 적용 여부를 확인하세요.");
        return;
      }
      setItems(data.items);
      setDrafts(Object.fromEntries(data.items.map((item: UnansweredQuestion) => [item.id, {
        product: item.product ?? "lingo", answer: item.approvedAnswer ?? "", sourceUrl: item.approvedSourceUrl ?? "",
      }])));
    } catch {
      setError("미답변 목록을 불러오지 못했습니다. DB 연결과 스키마 적용 여부를 확인하세요.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function review(id: number, status: "answered" | "ignored") {
    const draft = drafts[id];
    setSavingId(id);
    setError("");
    try {
      const response = await fetch("/api/admin/ai-chat/unanswered", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id, status,
          ...(status === "answered" ? {
            product: draft.product, approvedAnswer: draft.answer, approvedSourceUrl: draft.sourceUrl,
          } : {}),
        }),
      });
      if (!response.ok) throw new Error();
      setItems((current) => current.filter((item) => item.id !== id));
    } catch {
      setError("처리하지 못했습니다. 답변, 제품, 공개 근거 URL을 확인하세요.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 py-8 md:py-10">
      <header className="flex flex-col gap-2">
        <h1 className="m-0 type-h1 text-fg">AI 상담 미답변</h1>
        <p className="m-0 type-body-md text-mute">공식 근거가 부족했던 제품 질문에 답변을 작성하고 승인합니다. 승인한 내용만 RAG 입력 파일에 반영됩니다.</p>
      </header>

      {error ? <p className="m-0 rounded-box bg-error-light px-5 py-4 type-body-md text-error" role="alert">{error}</p> : null}
      {loading ? <p className="m-0 type-body-md text-mute">불러오는 중...</p> : null}
      {!loading && !error && !items.length ? <p className="m-0 rounded-box bg-bg-content px-5 py-8 text-center type-body-md text-mute">검토할 미답변 질문이 없습니다.</p> : null}

      <div className="flex flex-col gap-5">
        {items.map((item) => {
          const draft = drafts[item.id] ?? { product: "lingo", answer: "", sourceUrl: "" };
          return (
            <article className="flex flex-col gap-5 rounded-box bg-bg-content p-5" key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="type-body-sm text-mute">{item.locale.toUpperCase()} · {item.reason}</span>
                  <h2 className="m-0 type-h3 text-fg">{item.question}</h2>
                </div>
                <span className="shrink-0 type-body-sm text-mute">{item.occurrenceCount}회</span>
              </div>

              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <label className="flex flex-col gap-2 type-body-sm text-mute">
                  제품
                  <select className="h-10 rounded-button border border-border bg-bg px-3 type-body-md text-fg" value={draft.product}
                    onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: { ...draft, product: event.target.value } }))}>
                    {products.map((product) => <option key={product} value={product}>{product}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-2 type-body-sm text-mute">
                  공개 근거 URL
                  <input className="h-10 rounded-button border border-border bg-bg px-3 type-body-md text-fg" placeholder="https://aip-docs.app.querypie.com/..." value={draft.sourceUrl}
                    onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: { ...draft, sourceUrl: event.target.value } }))} />
                </label>
              </div>

              <label className="flex flex-col gap-2 type-body-sm text-mute">
                승인할 답변
                <textarea className="min-h-[140px] resize-y rounded-button border border-border bg-bg px-3 py-3 type-body-md text-fg" value={draft.answer}
                  onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: { ...draft, answer: event.target.value } }))} />
              </label>

              <div className="flex flex-wrap justify-end gap-2">
                <Button arrow={false} disabled={savingId === item.id} onClick={() => void review(item.id, "ignored")} variant="outline">제외</Button>
                <Button arrow={false} disabled={savingId === item.id || !draft.answer.trim() || !draft.sourceUrl.trim()} onClick={() => void review(item.id, "answered")} variant="primary">
                  {savingId === item.id ? "처리 중..." : "답변 승인 및 반영"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
