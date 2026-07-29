# Contact Us API 레퍼런스

`/company/contact-us` 페이지 폼 제출 기능의 설계 및 동작 방식.

> **파일 구조·폼 필드·다국어 정보:** [`docs/reference/lead-capture-forms.md`](./lead-capture-forms.md) 참조
>
> **UTM attribution 시스템 설계:** [`docs/reference/utm-attribution.md`](./utm-attribution.md) 참조

---

## 목적과 범위

비즈니스 문의(데모 요청, 요금제 상담, 기술 문의, 파트너십 등)를 수신하는 폼이다.
제출 시 Slack 채널로 알림을 보내고, DeskPie Lead API에 리드 데이터를 저장한다.

**범위에 포함:**
- `POST /api/contact-us` 서버 처리
- UTM attribution 쿠키 수집 및 DeskPie/Slack payload 포함
- 성공/실패 UI (다국어)

**범위 제외:**
- 비즈니스 이메일 도메인 차단 (전역 비활성화 상태)

---

## 아키텍처

```
브라우저 방문
  → UtmCapture (Client Component, 레이아웃 전역 등록)
      → utm-attribution 쿠키에 first-touch / last-touch 기록

폼 제출
  → ContactForm (Client Component)
      → readUtmCookie()로 attribution 쿠키 읽기
      → POST /api/contact-us
          → MX 검증 → XSS 필터링 → DeskPie Lead API (after hook, best-effort) → Slack 알림 (best-effort)
          → { success: true } 또는 { success: false, errorMessage }
```

`ContactUsPage`는 Server Component으로 히어로 카피를 렌더링하고, 폼 상태는 `ContactForm` Client Component가 관리한다.

---

## API: `POST /api/contact-us`

### 요청 본문

| 필드 | 타입 | 필수 |
|------|------|------|
| `firstName` | string | ✅ |
| `lastName` | string | ✅ |
| `email` | string | ✅ |
| `company` | string | ✅ |
| `departmentTitle` | string | ✅ |
| `phoneNumber` | string | — |
| `inquiryType` | string | — |
| `plannedImplementationDate` | string | — |
| `products` | string[] | — |
| `message` | string | — |
| `marketingConsent` | boolean | — |
| `utmAttribution` | string | — (URL-encoded JSON, `readUtmCookie()` 반환값) |

### 처리 순서

1. **필수 필드 검증** — `firstName`, `lastName`, `email`, `company`, `departmentTitle` 중 누락 시 `400`.
2. **MX 레코드 검증** — 이메일 도메인의 MX 레코드 확인. 실패 시 2초 딜레이 후 에러 반환 (brute-force 완화).
3. **XSS 필터링** — 모든 문자열 필드에 적용.
4. **DeskPie Lead API 전송** (best-effort) — `DESKPIE_LEAD_API_ENDPOINT`, `PUBLIC_API_KEY`가 모두 있으면 Next.js `after()`로 전송한다. 실패해도 에러 로그만 남긴다.
5. **Slack 알림** (best-effort) — 환경변수가 없거나 전송에 실패해도 에러 로그만 남기고 성공 응답 유지.
6. **성공 응답** — `{ success: true }`.

### 설계 결정: 외부 sink는 best-effort

DeskPie는 리드 저장용 외부 sink이고 Slack은 운영 알림 경로다. 둘 중 하나가 일시 실패해도 사용자의 Contact Us 제출 UX를 깨지 않기 위해 모두 best-effort로 처리한다.

### Lead payload 필드 매핑

DeskPie API는 기존 lead field name과 호환되는 payload를 받는다. Slack 알림도 같은 payload를 사용하므로 기존 알림 필드명이 유지된다.

| 요청 필드 | 전달 필드 | 비고 |
|-----------|----------------|------|
| `firstName` | `FirstName` | |
| `lastName` | `LastName` | |
| `email` | `Email` | |
| `company` | `Company` | 빈 값이면 `"None"` |
| `departmentTitle` | `Title` | |
| `phoneNumber` | `MobilePhone` | 값이 있을 때만 포함 |
| `inquiryType` | `Objective__c` | |
| `message` | `Questions__c` | |
| `products` + `plannedImplementationDate` | `Description` | `"Product: ...\nPlannedImplementationDate: ..."` |
| `marketingConsent` | `HasOptedInMarketing__c` | Slack 표시 항목에서는 제외 |
| referer 헤더 | `Referrer_URL__c` | Slack에는 `RequestURI`로 표시 |
| UTM attribution | `pi__utm_*__c`, `pi__first_touch_url__c` | `buildLeadUtmFields()` 변환 결과 |
| processType | — | DeskPie 전송 시 항상 `"LEAD_MS"` |

### 응답 형태

| 상황 | HTTP | 본문 |
|------|------|------|
| 필수 필드 누락 | 400 | `{ success: false, errorCode: "missing_required_fields", errorMessage: "Required fields are missing." }` |
| MX 레코드 없음 | 200 | `{ success: false, errorCode: "invalid_email", errorMessage: "Please enter a valid email address." }` |
| DeskPie 환경변수 미설정 | 200 | `DESKPIE_LEAD_API_ENDPOINT`, `PUBLIC_API_KEY` 중 하나라도 없으면 DeskPie 연동 skip, `{ success: true }` |
| DeskPie 실패 | 200 | 에러 로그만 남기고 `{ success: true }` |
| Slack 환경변수 미설정 | 200 | Slack 알림 skip, `{ success: true }` |
| Slack 실패 | 200 | 에러 로그만 남기고 `{ success: true }` |
| 성공 | 200 | `{ success: true }` |

---

## 환경변수

| 변수 | 필수 여부 | 미설정 시 동작 |
|------|-----------|--------------|
| `SLACK_BOT_OAUTH_TOKEN` | 선택 | Slack 알림 skip |
| `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES` | 선택 | Slack 알림 skip |
| `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING` | 선택 | non-production에서 미설정 시 `C083Y0300M7` fallback |
| `DESKPIE_LEAD_API_ENDPOINT` | 선택 | DeskPie 단계 skip |
| `PUBLIC_API_KEY` | 선택 | DeskPie 단계 skip |

Slack 알림 채널 선택은 Community License, 콘텐츠 게이팅 폼과 같은 resolver를 공유한다.

---

## 클라이언트 제출 흐름 (ContactForm)

```
handleSubmit()
  → status = "submitting"
  → utmAttribution = readUtmCookie()
  → POST /api/contact-us
  → success:true  → status = "success"  (성공 화면)
  → success:false → status = "error"    (errorCode를 locale별 사용자 문구로 변환)
  → 네트워크 오류 → status = "error"    (locale별 네트워크 오류 문구 표시)
```

클라이언트는 서버의 영문 `errorMessage`를 그대로 노출하지 않는다. `errorCode`를 기준으로 `en / ko / ja` 안내 문구를 표시하고, 알 수 없는 오류는 locale별 일반 실패 문구로 fallback한다.

### 성공 화면 UX

| Locale | 제목 | 버튼 | 이동 경로 |
|--------|------|------|----------|
| EN | Submission Complete | Go to Home | `/{locale}` |
| KO | 제출이 완료되었습니다. | 홈으로 이동 | `/{locale}` |
| JA | 送信が完了しました。 | ホームに戻る | `/{locale}` |

---

## 테스트

| 파일 | 범위 |
|------|------|
| `src/features/utm/utm.test.ts` | UTM 순수함수 + `readUtmCookie` 유닛 테스트 |
| `src/app/api/contact-us/route.test.ts` | API Route 통합 테스트 (Slack/DeskPie mock 포함) |
| `src/components/pages/contact/ContactForm.test.tsx` | ContactForm 컴포넌트 렌더링·제출·상태 테스트 |
