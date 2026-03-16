import type { Locale } from "@/constants/i18n";

export type UseCaseStatus = "draft" | "hidden" | "published";

export type UseCaseEntry = {
  authorName: string;
  authorRole: string;
  bodyMarkdown: string;
  categorySlug: "use-cases";
  dateIso: string;
  id: string;
  imageSrc: string;
  status: UseCaseStatus;
  title: string;
};

export const USE_CASE_STORAGE_KEY = "querypie-admin-use-cases";
export const USE_CASE_STORE_EVENT = "querypie:use-cases:changed";

const defaultBody = `AIP 기반 자동화는 반복적인 운영 작업을 짧은 실행 루프로 전환합니다.

## 해결한 문제

- 사람이 직접 검토하던 업무를 자동화해야 했습니다.
- 운영 품질을 해치지 않으면서 속도를 높여야 했습니다.
- 팀이 같은 기준으로 결과를 검증할 수 있어야 했습니다.

## 적용 방식

1. 워크플로우를 가장 작은 실행 단위로 나눕니다.
2. 각 단계에 필요한 컨텍스트와 승인 규칙을 연결합니다.
3. 결과를 운영 지표와 함께 검토하고 반복 개선합니다.

### 결과

실행 속도는 빨라졌고, 품질 검증은 더 명확해졌습니다.`;

export const initialUseCases: UseCaseEntry[] = [
  {
    authorName: "QueryPie Team",
    authorRole: "Product Marketing",
    bodyMarkdown: defaultBody,
    categorySlug: "use-cases",
    dateIso: "2026-03-15",
    id: "seo-analysis",
    imageSrc: "/images/content/article-01.png",
    status: "published",
    title:
      "SEO analysis, once considered the domain of specialists, can now be handled by an AIP agent.",
  },
  {
    authorName: "QueryPie Team",
    authorRole: "AI Strategy",
    bodyMarkdown: `AI 에이전트 시대에는 가드레일이 나중 단계의 보안 장치가 아니라 제품 경험의 일부가 됩니다.

## 왜 중요한가

- 사용자는 빠른 답변만이 아니라 예측 가능한 답변을 기대합니다.
- 운영팀은 실패 조건을 먼저 정의해야 합니다.
- 정책과 실행이 분리되면 관리 비용이 크게 늘어납니다.

## 설계 원칙

1. 금지보다 허용 범위를 먼저 정의합니다.
2. 에이전트가 판단한 이유를 추적 가능하게 남깁니다.
3. 사람 승인 지점을 제품 플로우와 자연스럽게 연결합니다.`,
    categorySlug: "use-cases",
    dateIso: "2026-03-12",
    id: "guardrail-design",
    imageSrc: "/images/content/article-02.png",
    status: "published",
    title:
      "Guardrail Design in the AI Agent Era (2026 Edition) — Part 1: Philosophy & Design",
  },
  {
    authorName: "QueryPie Team",
    authorRole: "Security Research",
    bodyMarkdown: `보안 위협 맵은 공격 표면을 정리하는 문서가 아니라 대응 우선순위를 정하는 운영 도구여야 합니다.`,
    categorySlug: "use-cases",
    dateIso: "2026-03-08",
    id: "ai-security-map",
    imageSrc: "/images/content/article-03.png",
    status: "hidden",
    title:
      "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
  },
  {
    authorName: "QueryPie Team",
    authorRole: "Operations",
    bodyMarkdown: `프로토타입 이후 운영 전환 단계에서는 체크리스트가 팀의 시행착오를 줄여줍니다.`,
    categorySlug: "use-cases",
    dateIso: "2026-03-05",
    id: "workflow-blueprint",
    imageSrc: "/images/content/article-01.png",
    status: "published",
    title:
      "Operational AI readiness checklist for teams moving from prototype to production.",
  },
];

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function createEmptyUseCaseDraft(): UseCaseEntry {
  return {
    authorName: "",
    authorRole: "",
    bodyMarkdown: "",
    categorySlug: "use-cases",
    dateIso: getTodayIsoDate(),
    id: "new",
    imageSrc: "",
    status: "draft",
    title: "",
  };
}

export function slugifyTitle(title: string) {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `use-case-${Date.now()}`;
}

export function ensureUniqueSlug(id: string, items: UseCaseEntry[], currentId?: string) {
  const taken = new Set(
    items.filter((item) => item.id !== currentId).map((item) => item.id),
  );

  if (!taken.has(id)) {
    return id;
  }

  let index = 2;
  let nextId = `${id}-${index}`;

  while (taken.has(nextId)) {
    index += 1;
    nextId = `${id}-${index}`;
  }

  return nextId;
}

export function sortUseCases(items: UseCaseEntry[]) {
  return [...items].sort((left, right) => right.dateIso.localeCompare(left.dateIso));
}

export function getUseCaseCategory(locale: Locale) {
  if (locale === "ko") return "활용 사례";
  return "Use Cases";
}

export function formatPublicDate(locale: Locale, dateIso: string) {
  if (!dateIso) {
    return "";
  }

  const date = new Date(`${dateIso}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getWriterLabel(item: Pick<UseCaseEntry, "authorName" | "authorRole">) {
  return item.authorRole.trim()
    ? `${item.authorName.trim()} / ${item.authorRole.trim()}`
    : item.authorName.trim();
}

export function extractSlugFromHref(href: string) {
  return href.split("/").filter(Boolean).pop() ?? href;
}
