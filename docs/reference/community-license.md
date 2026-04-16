# Community License 신청 기능

`corp-web-app`의 Community License 신청/발급 기능을 이식한 구현. 백엔드 동작은 corp-web-app과 동일하다.

---

## URL

| 환경 | URL |
|------|-----|
| Staging | `https://stage-v2.querypie.com/community-license` |
| Production | `https://www-v2.querypie.com/community-license` |

다국어: `/ko/community-license`, `/ja/community-license`

---

## 파일 구조

| 파일 | 역할 |
|------|------|
| `src/features/community-license/license-service.ts` | `issueLicense()` — 라이선스 발급 API 호출 |
| `src/features/community-license/copy.ts` | EN/KO/JA 다국어 copy (폼 필드, 성공/실패 메시지) |
| `src/app/api/community-license/route.ts` | `POST /api/community-license` 핸들러 |
| `src/components/pages/community-license/CommunityLicensePage.tsx` | Server Component — 두 컬럼 레이아웃 |
| `src/components/pages/community-license/CommunityLicenseForm.tsx` | Client Component — 폼 상태 관리, submit 핸들러 |
| `src/app/[locale]/community-license/page.tsx` | 라우트 진입점 |

---

## 백엔드 처리 흐름

`POST /api/community-license` 요청 처리 순서:

1. **필수 필드 검증** — `FirstName`, `LastName`, `Email`, `Company` 누락 시 `400` 반환
2. **MX 레코드 검증** — 이메일 도메인의 MX 레코드가 없으면 `{success: false, errorMessage: "Please enter a valid email address."}` 반환 (2초 딜레이 포함)
3. **XSS 필터링** — `xss` 패키지의 `filterXSS`로 모든 텍스트 필드 처리; `Company`가 빈 값이면 `"None"` 대입
4. **라이선스 발급** (`issueLicense`) — `QUERYPIE_LICENSE_ISSUE_API_ENDPOINT`, `QUERYPIE_LICENSE_ISSUE_API_KEY` 미설정 시 skip; 설정된 경우 API 호출 실패 시 전체 흐름 중단
5. **Salesforce POST** — `{requestBody, processType: "LEAD_MS"}` 전송; 응답에 `recordUUID` 없거나 `ok: false`이면 `{success: false}` 반환
6. **Slack 알림** — 실패해도 전체 흐름에 영향 없음 (에러 swallow)
7. **응답** — `{success: true}`

---

## 환경변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `SALESFORCE_ENDPOINT` | 필수 | Salesforce 리드 전달 URL |
| `QUERYPIE_LICENSE_ISSUE_API_ENDPOINT` | 선택 | 라이선스 발급 API URL. 미설정 시 발급 단계 skip |
| `QUERYPIE_LICENSE_ISSUE_API_KEY` | 선택 | 라이선스 발급 API 키. 미설정 시 발급 단계 skip |
| `SLACK_BOT_OAUTH_TOKEN` | 선택 | Slack Bot 토큰. 미설정 시 Slack 알림 skip |
| `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES` | 선택 | Slack 채널 ID |

---

## 다국어

- **EN**: FirstName → LastName 순서
- **KO/JA**: LastName(성) → FirstName(이름) 순서 (성이 먼저)
- 지원 locale: `en`, `ko`, `ja`

---

## corp-web-app 대비 차이점

- Server Action → API Route (`POST /api/community-license`)로 변경
- UTM attribution 제외 (corp-web-v2 미구현)
- `next-safe-action` 미사용, 직접 fetch

**corp-web-app 원본 참고:**
- 폼: `src/components/widget/community-license-apply-form/`
- 서버 로직: `src/components/widget/form/lib/send-form-data.ts`
- 라이선스 서비스: `src/features/querypie-license/license-service.ts`

---

## 검증 체크리스트

> 구현 완료, 실제 API 연계 동작은 미검증 상태.

- [ ] `/community-license`, `/ko/community-license`, `/ja/community-license` 폼 렌더링 및 필드 순서 확인
- [ ] 존재하지 않는 도메인 이메일 제출 → "Please enter a valid email address." 오류 (약 2초 후)
- [ ] `QUERYPIE_LICENSE_ISSUE_API_*` 미설정 시 skip 후 Salesforce 단계 진행
- [ ] `QUERYPIE_LICENSE_ISSUE_API_*` 설정 시 라이선스 발급 API 호출 성공
- [ ] Salesforce에 리드 전달되고 `recordUUID` 응답 수신 후 성공 화면 표시
- [ ] Slack 채널에 알림 수신, 비프로덕션 환경에서 `[TEST]` 태그 확인
- [ ] 성공 후 "Go to Home" 버튼 → locale 홈으로 이동
