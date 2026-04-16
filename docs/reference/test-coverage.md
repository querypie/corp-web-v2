# 테스트 커버리지 현황

최종 업데이트: 2026-04-16

---

## 현재 커버리지

| 파일 | 테스트 수 | 환경 | 대상 |
|------|-----------|------|------|
| `src/constants/i18n.test.ts` | 11 | happy-dom | locale 판별, 경로 변환 |
| `src/features/content/data.test.ts` | 32 | happy-dom | 콘텐츠 쿼리·변환 순수 함수 |
| `src/features/content/gating.test.ts` | 15 | happy-dom | 게이팅 조건, HTML 미리보기 생성 |
| `src/app/api/admin/content/state/route.test.ts` | 18 | node | Admin 콘텐츠 상태 API (GET/POST/PUT/PATCH/DELETE) |
| `src/app/api/downloads/content/route.test.ts` | 7 | node | 콘텐츠 다운로드·잠금 해제 API |
| `src/components/common/Tab.test.tsx` | 7 | happy-dom | Tab 렌더링·상태 |
| `src/components/common/Button.test.tsx` | 11 | happy-dom | Button variant·size·disabled |
| `src/components/common/ContentBodyPreview.test.tsx` | 6 | happy-dom | HTML 렌더링, public/ 경로 정규화 |
| `src/components/common/Select.test.tsx` | 6 | happy-dom | 제어·비제어 Select |
| `src/components/pages/legal/LegalVersionSelect.test.tsx` | 4 | happy-dom | 버전 선택 후 router.push |
| `src/components/pages/documentation/ContentLeadForm.test.tsx` | 7 | happy-dom | 폼 검증, fetch, 에러 처리 |
| **합계** | **124** | | |

---

## 테스트 환경

`vitest.config.ts` 기본 환경은 `happy-dom`입니다. API 라우트 테스트는 Node.js `fs` 모듈 호환성을 위해 파일 상단에 pragma를 추가합니다.

```typescript
// @vitest-environment node
```

> jsdom 대신 happy-dom을 선택한 이유: jsdom 27+가 의존하는 `@asamuzakjp/css-color` → `@csstools/css-calc`가 ESM-only 패키지로, CJS require 오류를 일으킵니다. happy-dom은 이 문제가 없습니다.

---

## Mock 패턴 모음

### fs 모듈 (API 라우트)

`vi.hoisted()`를 사용해야 합니다. `vi.mock()`은 파일 상단으로 호이스팅되므로, 일반 변수 선언보다 먼저 실행되어 TDZ 오류가 발생합니다.

```typescript
const { mockReadFile, mockWriteFile } = vi.hoisted(() => ({
  mockReadFile: vi.fn(),
  mockWriteFile: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("fs", () => ({
  existsSync: vi.fn(),
  promises: { readFile: mockReadFile, writeFile: mockWriteFile },
}));
```

### server-only 패키지

`contentState.server.ts` 등 서버 전용 모듈을 import하는 파일을 mock할 때 필요합니다.

```typescript
vi.mock("server-only", () => ({}));
```

### next/navigation (Client Component)

```typescript
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));
```

### fetch (Client Component)

```typescript
vi.stubGlobal("fetch", vi.fn());
vi.mocked(fetch).mockResolvedValue({
  ok: true,
  json: async () => ({ unlocked: true }),
} as unknown as Response);
```

### next/headers (서버 전용 API를 사용하는 Server Component)

```typescript
vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Map()),
  cookies: vi.fn(() => ({ get: vi.fn() })),
}));
```

---

## Server Component 테스트 가능 여부

| 케이스 | 테스트 가능 여부 | 방법 |
|--------|----------------|------|
| props → JSX 반환 (순수 렌더링) | ✅ 가능 | RTL 직접 렌더링 |
| `headers()`, `cookies()` 사용 | ✅ 가능 | `vi.mock("next/headers", ...)` |
| `import "server-only"` 포함 모듈 import | ✅ 가능 | `vi.mock("server-only", () => ({}))` |
| Tiptap 에디터, 복잡한 브라우저 API | ⚠️ 어려움 | 핵심 로직을 순수 함수로 분리 후 테스트 |
