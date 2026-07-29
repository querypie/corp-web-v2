# Community License 신청 기능

Community License 신청/발급 기능은 API Route 기반으로 처리하며, 라이선스 발급 API와 Slack 알림을 사용한다.

---

## URL

| 환경 | URL |
|------|-----|
| Staging | `https://stage-v2.querypie.com/en/community-license` |
| Production | `https://www-v2.querypie.com/en/community-license` |

다국어: `/en/community-license`, `/ko/community-license`, `/ja/community-license`

Contact Us 폼 UI 기반 신청 경로: `/en/querypie/license/community/apply`, `/ko/querypie/license/community/apply`, `/ja/querypie/license/community/apply`

---

## 파일 구조

| 파일 | 역할 |
|------|------|
| `src/features/community-license/license-service.ts` | `issueLicense()` — 라이선스 발급 API 호출 |
| `src/copy/communityLicense.ts` | EN/KO/JA 다국어 copy (폼 필드, 성공/실패 메시지) |
| `src/app/api/community-license/route.ts` | `POST /api/community-license` 핸들러 |
| `src/components/pages/community-license/CommunityLicensePage.tsx` | Server Component — 두 컬럼 레이아웃 |
| `src/components/pages/community-license/CommunityLicenseForm.tsx` | Client Component — 폼 상태 관리, submit 핸들러 |
| `src/app/[locale]/community-license/page.tsx` | 라우트 진입점 |
| `src/components/pages/community-license/apply/CommunityLicenseApplyPage.tsx` | Contact Us 폼 UI 기반 신청 페이지 |
| `src/components/pages/community-license/apply/CommunityLicenseApplyForm.tsx` | Contact Us 폼 UI 기반 신청 폼 |
| `src/app/[locale]/querypie/license/community/apply/page.tsx` | Contact Us 폼 UI 기반 locale 신청 라우트 |

---

## 백엔드 처리 흐름

`POST /api/community-license` 요청 처리 순서:

1. **필수 필드 검증** — `FirstName`, `LastName`, `Email`, `Company` 누락 시 `400` 반환
2. **MX 레코드 검증** — 이메일 도메인의 MX 레코드가 없으면 `{success: false, errorMessage: "Please enter a valid email address."}` 반환 (2초 딜레이 포함)
3. **XSS 필터링** — `xss` 패키지의 `filterXSS`로 모든 텍스트 필드 처리; `Company`가 빈 값이면 `"None"` 대입
4. **라이선스 발급** (`issueLicense`) — `DESKPIE_COMMUNITY_LICENSE_API_ENDPOINT`, `PUBLIC_API_KEY` 미설정 시 skip; 설정된 경우 API 호출 실패 시 전체 흐름 중단
5. **Slack 알림** — 실패해도 전체 흐름에 영향 없음 (에러 swallow)
6. **응답** — `{success: true}`

---

## 환경변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `DESKPIE_COMMUNITY_LICENSE_API_ENDPOINT` | 선택 | 라이선스 발급 API URL. 미설정 시 발급 단계 skip |
| `PUBLIC_API_KEY` | 선택 | 라이선스 발급 API 키. 미설정 시 발급 단계 skip |
| `SLACK_BOT_OAUTH_TOKEN` | 선택 | Slack Bot 토큰. 미설정 시 Slack 알림 skip |
| `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES` | 선택 | Slack 채널 ID |
| `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING` | 선택 | non-production 입력폼 알림 채널 ID |

---

## 다국어

- 필드 레이블과 순서는 `src/copy/communityLicense.ts`의 locale별 copy를 따른다.
- **EN**: `FirstName` → `LastName` 순서
- **KO/JA**: `LastName`(성) → `FirstName`(이름) 순서
- 지원 locale: `en`, `ko`, `ja`

---

## 구현 메모

- UTM attribution 제외 (현재 Community License 폼에는 미적용)
- 클라이언트는 직접 `fetch("/api/community-license")`를 호출한다.
