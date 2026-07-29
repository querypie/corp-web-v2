# Lead Capture Forms

방문자로부터 연락처·관심 정보를 수집하는 폼들의 운영 레퍼런스.

| 폼 | 대표 라우트 | API | 외부 연동 |
|----|------------|-----|---------|
| [Community License 신청](#1-community-license-신청) | `/en/community-license`, `/en/querypie/license/community/apply` | `POST /api/community-license` | 라이선스 발급 API, Slack |
| [Contact Us](#2-contact-us) | `/en/company/contact-us` | `POST /api/contact-us` | DeskPie Lead API, Slack |
| [콘텐츠 PDF 언락/다운로드](#3-콘텐츠-pdf-언락다운로드) | `/en/whitepapers/[slug]` 등 콘텐츠 상세 | `POST /api/downloads/content` | Slack |

---

## 1. Community License 신청

QueryPie Community License를 신청·발급하는 폼. 백엔드는 라이선스 자동 발급과 Slack 알림으로 구성된다.

> **상세 레퍼런스:** [`docs/reference/community-license.md`](./community-license.md)

### 요약

| 항목 | 내용 |
|------|------|
| 라우트 | `/en/community-license`, `/ko/community-license`, `/ja/community-license`, `/en/querypie/license/community/apply`, `/ko/querypie/license/community/apply`, `/ja/querypie/license/community/apply` |
| 주요 컴포넌트 | `src/components/pages/community-license/CommunityLicenseForm.tsx`, `src/components/pages/community-license/apply/CommunityLicenseApplyForm.tsx` |
| copy 원본 | `src/copy/communityLicense.ts` |
| 필수 필드 | `FirstName`, `LastName`, `Email`, `Company` |
| 선택 필드 | `Title`, `Website`, `marketingConsent` |
| 처리 흐름 | 필수값 검증 → MX 검증 → XSS 필터링 → 라이선스 발급 → Slack 알림 |

---

## 2. Contact Us

제품 데모 요청·요금제 상담·기술 문의·파트너십 등 비즈니스 문의를 받는 폼.

> **상세 레퍼런스:** [`docs/reference/contact-us-api.md`](./contact-us-api.md)
>
> UTM attribution 설계, API 처리 순서, DeskPie 전달 field 매핑, 환경변수, UX 동작은 위 문서를 참조한다.

### 요약

| 항목 | 내용 |
|------|------|
| 주요 컴포넌트 | `src/components/pages/contact/ContactForm.tsx` |
| copy 원본 | `src/copy/contact.ts` |
| 환경변수 | `SLACK_BOT_OAUTH_TOKEN`, `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES`, `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING`, `DESKPIE_LEAD_API_ENDPOINT`, `PUBLIC_API_KEY` (모두 선택) |
| 성공 조건 | 필수값 검증과 MX 검증 통과 |
| DeskPie | best-effort (실패해도 성공 응답 유지) |
| UTM | `utm-attribution` 쿠키를 읽어 DeskPie/Slack payload에 포함 |

### 파일 구조

| 파일 | 역할 |
|------|------|
| `src/copy/contact.ts` | EN/KO/JA 다국어 copy (폼 필드, 레이블, 제품 옵션, 성공/실패 문구) |
| `src/features/utm/utm.ts` | UTM attribution 타입·순수함수·hook |
| `src/features/utm/cookie.ts` | 브라우저 쿠키 유틸 |
| `src/components/site/UtmCapture.tsx` | UTM 쿠키 캡처 전용 컴포넌트 (레이아웃에 전역 등록) |
| `src/components/pages/contact/ContactUsPage.tsx` | Server Component — 히어로 카피 + ContactForm 렌더링 |
| `src/components/pages/contact/ContactForm.tsx` | Client Component — 폼 상태 관리, 제출 핸들러 |
| `src/components/forms/ContactFormParts.tsx` | 재사용 폼 컴포넌트 (TextField, SelectField, CheckboxRow, PrivacyNotice 등) |
| `src/app/api/contact-us/route.ts` | `POST /api/contact-us` 핸들러 |
| `src/app/[locale]/company/contact-us/page.tsx` | 라우트 진입점 |

### 수집 필드

| 구분 | 필드 |
|------|------|
| 필수 텍스트 | `firstName`, `lastName`, `email`, `company`, `departmentTitle` |
| 필수 선택 | `inquiryType`, `plannedImplementationDate`, 제품/서비스 체크박스 1개 이상 |
| 필수 장문 | `message` |
| 선택 | `phoneNumber`, `marketingConsent` |

필드 레이블, 선택지, 제품 옵션은 locale별로 다르다. 하드코딩하지 말고 `src/copy/contact.ts`의 `getContactPageCopy(locale)`를 기준으로 확인한다.

---

## 3. 콘텐츠 PDF 언락/다운로드

문서·리포트 등 PDF 콘텐츠 접근을 연락처 수집으로 제어하는 폼.

주요 적용 경로:

| 콘텐츠 | 공개 경로 예시 |
|--------|----------------|
| Demo Use Cases | `/en/demo/use-cases/[slug]` |
| Demo AIP Features | `/en/demo/aip/[slug]` |
| Demo ACP Features | `/en/demo/acp/[slug]` |
| Introduction Decks | `/en/introduction-deck/[slug]` |
| Manuals | `/en/manuals/[slug]` |
| White Papers | `/en/whitepapers/[slug]` |
| Blog | `/en/blog/[slug]` |
| Events | `/en/events/[slug]` |

### 파일 구조

| 파일 | 역할 |
|------|------|
| `src/copy/contact.ts` | 폼 필드 정의 (Contact Us와 공유) |
| `src/features/content/gating.ts` | 언락 쿠키 상수·유틸 (`CONTENT_UNLOCK_COOKIE_PREFIX`, `getContentUnlockCookieName`) |
| `src/components/pages/documentation/ContentLeadForm.tsx` | Client Component — 폼 상태 관리, submit 핸들러 |
| `src/app/api/downloads/content/route.ts` | `POST /api/downloads/content` 핸들러 |

### 모드

| 모드 | 용도 | 성공 후 동작 |
|------|------|-------------|
| `download` | PDF 다운로드 전 정보 수집 | 파일 다운로드 + `pdfPreviewUrl`로 미리보기 창 오픈 + `returnUrl`로 리다이렉트 |
| `unlock` | 제한된 콘텐츠(gated content) 언락 | 언락 쿠키 설정 + 상세 페이지에서 PDF 버튼 활성화 |

### 수집 필드

Contact Us 폼과 같은 copy를 공유한다. 단, `message` 필드는 사용하지 않는다.

### 백엔드 처리 흐름

`POST /api/downloads/content` 요청 처리 순서:

1. **페이로드 검증** — `form` 누락 시 `400` 반환; `download` 모드에서 `attachmentUrl`, `attachmentFileName`, `returnUrl`, `pdfPreviewUrl` 중 하나라도 없으면 `400` 반환
2. **콘텐츠 검증** — `contentId`, `section`이 있으면 실제 게시 콘텐츠와 PDF 첨부 상태를 서버에서 재확인
3. **이메일 검증** — 제출 이메일 domain의 MX record 확인. 실패 시 `400` 반환
4. **Slack 알림** — 환경변수가 있으면 `Gating Form To Unlock/Download Document` 알림 전송. 실패해도 제출 성공은 막지 않음
5. **응답**
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
  → canSubmit 확인 (필수 필드 + 제품/서비스 선택 1개 이상)
  → POST /api/downloads/content
  → 성공 시:
      unlock: 언락 상태 반영 + 게이팅 오버레이 제거
      download: link.click() 다운로드 + previewWindow.location.href + window.location.replace(returnUrl)
  → 실패 시: errorCode를 locale별 사용자 문구로 변환해 표시
```

클라이언트는 서버의 영문 `error`를 그대로 노출하지 않는다. `invalid_email`, `missing_required_fields`, `content_unavailable`, `download_unavailable`, `server_error` 등 `errorCode`를 기준으로 `en / ko / ja` 안내 문구를 표시한다.

PDF 버튼 동작:

```
폼 제출 전 PDF 버튼 클릭
  → 커스텀 확인창 표시
  → 확인 클릭 시 게이팅 폼 위치로 스크롤

폼 제출 후 PDF 버튼 클릭
  → PDF 파일을 새 창으로 오픈
```

### 환경변수

| 변수 | 용도 | 필수 |
|------|------|------|
| `SLACK_BOT_OAUTH_TOKEN` | Slack 알림 전송 | — |
| `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES` | Slack 알림 채널 | — |
| `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING` | non-production 입력폼 알림 채널 override | — |
| `DESKPIE_LEAD_API_ENDPOINT` | Contact Us DeskPie Lead API endpoint | — |
| `PUBLIC_API_KEY` | Contact Us DeskPie Lead API key | — |

Slack/DeskPie 환경변수가 없거나 전송에 실패해도 제출 성공은 유지한다.

Staging 환경에 전달할 값은 [`staging-lead-form.env.example`](./staging-lead-form.env.example)을 기준으로 준비한다. `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING`은 non-production 채널을 명시적으로 분리하고 싶을 때 사용한다.
