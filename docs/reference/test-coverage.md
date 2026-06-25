# 테스트 커버리지 현황

최종 업데이트: 2026-06-25

---

## 현재 커버리지

| 파일 | 테스트 수 | 환경 | 대상 |
|------|-----------|------|------|
| `src/constants/i18n.test.ts` | 11 | happy-dom | locale 판별, 경로 변환 |
| `src/features/content/data.test.ts` | 43 | happy-dom | 콘텐츠 쿼리·변환 순수 함수 |
| `src/features/content/gating.test.ts` | 15 | happy-dom | 게이팅 조건, HTML 미리보기 생성 |
| `src/features/content/authored.server.test.ts` | 3 | node | Admin 콘텐츠 파일 저장, outlink 전환 시 본문 정리, storageId 폴더 이동 |
| `src/features/content/config.test.ts` | 2 | happy-dom | 콘텐츠 설정 유효성 |
| `src/features/content/translation/tiptap.test.ts` | 4 | happy-dom | Tiptap 변환 |
| `src/app/api/admin/content/state/route.test.ts` | 26 | node | Admin 콘텐츠 상태 API, storageId 우선 식별, 입력 검증 |
| `src/app/api/community-license/route.test.ts` | 16 | node | Community License API, Salesforce/Slack/라이선스 연동 |
| `src/app/api/contact-us/route.test.ts` | 23 | node | Contact Us API, Slack 필수 알림, Salesforce best-effort, UTM 매핑 |
| `src/app/api/downloads/content/route.test.ts` | 9 | node | 콘텐츠 다운로드·잠금 해제 API |
| `src/app/api/downloads/file/route.test.ts` | 4 | node | 공개 PDF 다운로드 프록시 |
| `src/app/[locale]/solutions/routeModules.test.ts` | 3 | happy-dom | 솔루션 라우트 모듈 |
| `src/components/common/Tab.test.tsx` | 7 | happy-dom | Tab 렌더링·상태 |
| `src/components/common/Button.test.tsx` | 12 | happy-dom | Button variant·size·disabled |
| `src/components/common/ContentBodyPreview.test.tsx` | 6 | happy-dom | HTML 렌더링, public/ 경로 정규화 |
| `src/components/common/CookieConsentBanner.test.tsx` | 3 | happy-dom | 쿠키 배너 렌더링·상태 |
| `src/components/common/PaginationNav.test.tsx` | 2 | happy-dom | 페이지네이션 렌더링 |
| `src/components/common/Select.test.tsx` | 6 | happy-dom | 제어·비제어 Select |
| `src/components/common/TextButton.test.tsx` | 2 | happy-dom | 텍스트 버튼 렌더링 |
| `src/components/layout/Footer.test.tsx` | 2 | happy-dom | Footer 렌더링 |
| `src/components/pages/contact/ContactForm.test.tsx` | 11 | happy-dom | Contact Form 렌더링·제출·상태 |
| `src/components/pages/documentation/DocumentationListPage.test.tsx` | 1 | happy-dom | 문서 목록 페이지 렌더링 |
| `src/components/pages/legal/LegalVersionSelect.test.tsx` | 4 | happy-dom | 버전 선택 후 router.push |
| `src/components/pages/legal/CookiePreferenceActions.test.tsx` | 1 | happy-dom | 쿠키 선호 액션 |
| `src/components/pages/legal/PreferenceItem.test.tsx` | 4 | happy-dom | 쿠키 선호 항목 |
| `src/components/pages/documentation/ContentLeadForm.test.tsx` | 7 | happy-dom | 폼 검증, fetch, 에러 처리 |
| `src/constants/navigation.test.ts` | 16 | happy-dom | 내비게이션 설정 |
| `src/features/community-license/copy.test.ts` | 17 | happy-dom | Community License 다국어 copy |
| `src/features/community-license/license-service.test.ts` | 9 | happy-dom | 라이선스 발급 서비스 |
| `src/features/demo/navigation.test.ts` | 2 | happy-dom | 데모 내비게이션 |
| `src/features/legal/legalMarkdown.server.test.ts` | 3 | node | Legal markdown 로딩 |
| `src/features/pagination.test.ts` | 8 | happy-dom | 페이지네이션 유틸 |
| `src/features/solutions/contentComponents.test.tsx` | 3 | happy-dom | 솔루션 콘텐츠 컴포넌트 |
| `src/features/solutions/routes.test.ts` | 7 | happy-dom | 솔루션 라우트 설정 |
| `src/features/utm/utm.test.ts` | 12 | happy-dom | UTM attribution 순수 함수·쿠키 읽기 |
| **전체 합계** | **304** | | `npm run test:run` 기준 |

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
