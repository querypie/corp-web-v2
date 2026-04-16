# Lead Capture Forms

방문자로부터 연락처·관심 정보를 수집하는 3개 폼의 레퍼런스.

| 폼 | 라우트 | 제출 상태 | 외부 연동 |
|----|--------|----------|---------|
| [Community License 신청](#1-community-license-신청) | `/community-license` | ✅ 구현 완료 | Salesforce, Slack |
| [Contact Us](#2-contact-us) | `/company/contact-us` | ✅ 구현 완료 | Salesforce (best-effort), Slack (필수) |
| [콘텐츠 다운로드 / 언락 (Gating)](#3-콘텐츠-다운로드--언락-gating) | `/documentation/[slug]` | ✅ 구현 완료 | 없음 (로컬 JSON) |

---

## 1. Community License 신청

QueryPie Community License를 신청·발급하는 폼. 백엔드는 Salesforce 리드 전송 + 라이선스 자동 발급 + Slack 알림으로 구성된다.

> **상세 레퍼런스:** [`docs/reference/community-license.md`](./community-license.md)
>
> 파일 구조·백엔드 처리 흐름·환경변수·다국어·검증 체크리스트는 위 문서를 참조한다.

### 요약

| 항목 | 내용 |
|------|------|
| 라우트 | `/community-license`, `/ko/community-license`, `/ja/community-license` |
| API | `POST /api/community-license` |
| 주요 컴포넌트 | `src/components/pages/community-license/CommunityLicenseForm.tsx` |
| 수집 필드 | FirstName, LastName, Email, Company (필수) / Title, Website (선택) / 마케팅 동의 |
| 외부 연동 | Salesforce (필수), Slack 알림 (선택), 라이선스 발급 API (선택) |

---

## 2. Contact Us

제품 데모 요청·요금제 상담·기술 문의·파트너십 등 비즈니스 문의를 받는 폼.

> **상세 레퍼런스:** [`docs/reference/contact-us-api.md`](./contact-us-api.md)
>
> UTM attribution 설계, API 처리 순서, Salesforce 필드 매핑, 환경변수, UX 동작은 위 문서를 참조한다.

### API

| 항목 | 내용 |
|------|------|
| 엔드포인트 | `POST /api/contact-us` |
| 주요 컴포넌트 | `src/components/pages/contact/ContactForm.tsx` |
| 환경변수 | `SLACK_BOT_OAUTH_TOKEN`, `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES` (필수), `SALESFORCE_ENDPOINT` (선택) |
| 성공 조건 | Slack 알림 성공 |
| Salesforce | best-effort (실패해도 Slack 성공이면 성공 응답) |

### 파일 구조

| 파일 | 역할 |
|------|------|
| `src/features/contact/copy.ts` | EN/KO/JA 다국어 copy (폼 필드, 레이블, 이메일 링크) |
| `src/features/utm/utm.ts` | UTM attribution 타입·순수함수·hook |
| `src/features/utm/cookie.ts` | 브라우저 쿠키 유틸 |
| `src/components/common/UtmCapture.tsx` | UTM 쿠키 캡처 전용 컴포넌트 (레이아웃에 전역 등록) |
| `src/components/pages/contact/ContactUsPage.tsx` | Server Component — 히어로 카피 + ContactForm 렌더링 |
| `src/components/pages/contact/ContactForm.tsx` | Client Component — 폼 상태 관리, 제출 핸들러 |
| `src/components/pages/contact/ContactFormParts.tsx` | 재사용 폼 컴포넌트 (TextField, SelectField, CheckboxRow, PrivacyNotice 등) |
| `src/app/api/contact-us/route.ts` | `POST /api/contact-us` 핸들러 |
| `src/app/[locale]/company/contact-us/page.tsx` | 라우트 진입점 |

### 수집 필드

| 필드명 | 레이블 (EN) | 타입 | 필수 |
|--------|------------|------|------|
| `firstName` | First Name | text | ✅ |
| `lastName` | Last Name | text | ✅ |
| `email` | Business Email | text | ✅ |
| `company` | Company Name | text | ✅ |
| `departmentTitle` | Department / Title | text | ✅ |
| `phoneNumber` | Phone Number | text | — |
| `inquiryType` | Inquiry Type | select | ✅ |
| `plannedImplementationDate` | Planned Implementation Date | select | ✅ |
| (제품 체크박스) | Products/Services of Interest | checkbox | ✅ |
| `message` | Questions or Additional Information | textarea | ✅ |
| `updates` | 마케팅 동의 | checkbox | — |

**Inquiry Type 선택지:** Request for Product Demo / Pricing Plan Discussion / Technical Question / Partnership / Other

**Planned Implementation Date 선택지:** Within 3 months / Within 6 months / 6 months or more / Consideration stage

**제품 체크박스 선택지:**
- AI Platform QueryPie AIP
- Access Control Platform QueryPie ACP
- AI Expert Support (FDE) Service
- Partnership

### 다국어

| Locale | 필드 순서 비고 |
|--------|-------------|
| EN | First Name → Last Name |
| KO | 이름 → 성 (한국어 관례: 이름 먼저) |
| JA | 名 → 姓 |

---

## 3. 콘텐츠 다운로드 / 언락 (Gating)

문서·리포트 등 콘텐츠에 대한 접근을 연락처 수집으로 제어하는 폼.

### 파일 구조

| 파일 | 역할 |
|------|------|
| `src/features/contact/copy.ts` | 폼 필드 정의 (Contact Us와 공유) |
| `src/features/content/gating.ts` | 언락 쿠키 상수·유틸 (`CONTENT_UNLOCK_COOKIE_PREFIX`, `getContentUnlockCookieName`) |
| `src/components/pages/documentation/ContentLeadForm.tsx` | Client Component — 폼 상태 관리, submit 핸들러 |
| `src/app/api/downloads/content/route.ts` | `POST /api/downloads/content` 핸들러 |
| `src/content/state/content-download-leads.json` | 수집된 리드 저장 파일 (로컬 파일시스템) |

### 모드

| 모드 | 용도 | 성공 후 동작 |
|------|------|-------------|
| `download` | PDF 다운로드 전 정보 수집 | 파일 다운로드 + `pdfPreviewUrl`로 미리보기 창 오픈 + `returnUrl`로 리다이렉트 |
| `unlock` | 제한된 콘텐츠(gated content) 언락 | 언락 쿠키 설정 + `onSuccess()` 콜백 호출 |

### 수집 필드

Contact Us 폼과 동일한 필드 구성 (`src/features/contact/copy.ts` 공유). 단, `message` 필드 없음.

### 백엔드 처리 흐름

`POST /api/downloads/content` 요청 처리 순서:

1. **페이로드 검증** — `form` 누락 시 `400` 반환; `download` 모드에서 `attachmentUrl`, `attachmentFileName`, `returnUrl`, `pdfPreviewUrl` 중 하나라도 없으면 `400` 반환
2. **리드 저장** — `src/content/state/content-download-leads.json`에 append (createdAt, form, locale, mode, 콘텐츠 메타 포함)
3. **응답**
   - `download` 모드: `{ downloadUrl, previewUrl }` 반환 (`downloadUrl`은 `/api/downloads/file` 프록시 경유)
   - `unlock` 모드: `{ unlocked: true }` 반환 + `unlockCookieName` 쿠키 설정

### 언락 쿠키

| 항목 | 내용 |
|------|------|
| 이름 | `querypie_content_unlocked_{id}` (`id`의 특수문자는 `_`로 치환) |
| Max-Age | 30일 (`60 * 60 * 24 * 30`) |
| 설정 위치 | Set-Cookie 응답 헤더 (`httpOnly: false`, `sameSite: lax`) |
| 확인 함수 | `hasUnlockedContentAccess(value)` — `value === "true"` 여부 반환 |

### 클라이언트 제출 흐름

```
사용자 폼 제출
  → canSubmit 확인 (필수 필드 + 제품 선택 1개 이상)
  → download 모드: window.open("", "_blank") 으로 미리보기 창 선점
  → POST /api/downloads/content
  → 성공 시:
      download: link.click() 다운로드 + previewWindow.location.href + window.location.replace(returnUrl)
      unlock: onSuccess() 호출
  → 실패 시: previewWindow.close() + errorMessage 표시
```

### 환경변수

없음. 외부 서비스 연동 없이 로컬 파일시스템에만 저장한다.

### 리드 데이터 스키마

`src/content/state/content-download-leads.json` 에 저장되는 항목 구조:

```json
{
  "createdAt": "2026-04-16T00:00:00.000Z",
  "form": { "firstName": "...", "email": "...", "products": ["..."], ... },
  "locale": "en",
  "mode": "download",
  "title": "콘텐츠 제목",
  "attachmentFileName": "report.pdf",
  "attachmentUrl": "https://...",
  "pdfPreviewUrl": "https://...",
  "returnUrl": "/documentation/..."
}
```
