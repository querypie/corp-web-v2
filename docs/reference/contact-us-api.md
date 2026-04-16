# Contact Us API 레퍼런스

`/company/contact-us` 페이지 폼 제출 기능의 설계 및 동작 방식.

> **파일 구조·폼 필드·다국어 정보:** [`docs/reference/lead-capture-forms.md`](./lead-capture-forms.md) 참조
>
> **UTM attribution 시스템 설계:** [`docs/reference/utm-attribution.md`](./utm-attribution.md) 참조

---

## 목적과 범위

비즈니스 문의(데모 요청, 요금제 상담, 기술 문의, 파트너십 등)를 수신하는 폼이다.
제출 시 Slack 채널로 알림을 보내고, Salesforce에 리드를 저장한다.

**범위에 포함:**
- `POST /api/contact-us` 서버 처리
- UTM attribution 쿠키 수집 및 Salesforce 전달
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
          → MX 검증 → XSS 필터링 → Salesforce (best-effort) → Slack (필수)
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

1. **Slack 환경변수 검증** — 미설정 시 즉시 `500` 반환. Slack 없이는 운영 불가.
2. **필수 필드 검증** — `firstName`, `lastName`, `email`, `company`, `departmentTitle` 중 누락 시 `400`.
3. **MX 레코드 검증** — 이메일 도메인의 MX 레코드 확인. 실패 시 2초 딜레이 후 에러 반환 (brute-force 완화).
4. **XSS 필터링** — 모든 문자열 필드에 적용.
5. **Salesforce 전송** (best-effort) — 실패해도 흐름 중단 없이 에러 로그만 남김.
6. **Slack 알림** (필수) — 실패 시 `{ success: false }` 반환.
7. **성공 응답** — `{ success: true }`.

### 설계 결정: Slack 우선, Salesforce best-effort

Salesforce는 리드 데이터를 보관하지만 알림 경로가 아니다. 영업팀은 Slack 알림을 통해 문의를 인지한다. 따라서 Slack 전송 성공이 API 성공의 기준이며, Salesforce 실패는 데이터 손실이지만 운영 장애로 취급하지 않는다.

### Salesforce 필드 매핑

| 요청 필드 | Salesforce 필드 | 비고 |
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
| `marketingConsent` | `HasOptedInMarketing__c` | |
| referer 헤더 | `Referrer_URL__c` | |
| UTM last-touch | `pi__utm_*__c` | `toSalesforceFields()` |
| processType | — | 항상 `"LEAD_MS"` |

### 응답 형태

| 상황 | HTTP | 본문 |
|------|------|------|
| Slack 환경변수 미설정 | 500 | `{ success: false, errorMessage: "Server configuration error. Please contact support." }` |
| 필수 필드 누락 | 400 | `{ success: false, errorMessage: "Required fields are missing." }` |
| MX 레코드 없음 | 200 | `{ success: false, errorMessage: "Please enter a valid email address." }` |
| Slack 실패 | 200 | `{ success: false }` |
| 성공 | 200 | `{ success: true }` |

---

## 환경변수

| 변수 | 필수 여부 | 미설정 시 동작 |
|------|-----------|--------------|
| `SLACK_BOT_OAUTH_TOKEN` | **필수** | 요청마다 `500` + "Server configuration error" |
| `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES` | **필수** | 요청마다 `500` + "Server configuration error" |
| `SALESFORCE_ENDPOINT` | 선택 | Salesforce 단계 skip, Slack 성공 시 정상 응답 |

Community License 폼과 동일한 변수를 공유한다.

---

## 클라이언트 제출 흐름 (ContactForm)

```
handleSubmit()
  → status = "submitting"
  → utmAttribution = readUtmCookie()
  → POST /api/contact-us
  → success:true  → status = "success"  (성공 화면)
  → success:false → status = "error"    (errorMessage 또는 errorGeneral 표시)
  → 네트워크 오류 → status = "error"    (errorGeneral 표시)
```

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
| `src/app/api/contact-us/route.test.ts` | API Route 통합 테스트 (Slack/Salesforce mock) |
| `src/components/pages/contact/ContactForm.test.tsx` | ContactForm 컴포넌트 렌더링·제출·상태 테스트 |
