# UTM Attribution 레퍼런스

방문자의 유입 경로를 추적해 리드 캡처 폼 제출 시 Salesforce에 함께 전달하는 시스템.

---

## 목적

폼을 제출한 방문자가 어떤 채널·캠페인을 통해 유입됐는지를 Salesforce 리드 데이터에 기록한다. 이를 통해 마케팅 채널별 전환 성과를 측정할 수 있다.

---

## 쿠키 설계

| 항목 | 값 |
|------|---|
| 키 | `utm-attribution` |
| 형식 | URL-encoded JSON |
| 보존 기간 | 2년 |
| 스코프 | 전체 경로 (`path=/`) |

### 데이터 구조

```
{
  first: UtmTouch,      // 최초 UTM 터치 — 절대 덮어쓰지 않음
  recent: UtmTouch[]    // 최근 UTM 터치 (최대 2개, 시간 오름차순)
}
```

`UtmTouch`는 UTM 파라미터(`source`, `medium`, `campaign`, `term`, `content`)와 방문 경로(`landing`), 타임스탬프(`ts`)를 담는다. UTM 파라미터가 없는 방문은 기록하지 않는다.

### 갱신 정책

- **first**: 최초 UTM 방문에서만 설정. 이후 방문에서는 변경되지 않는다.
- **recent**: 새 UTM 방문마다 append. 3개 이상이 되면 가장 오래된 것을 제거해 최대 2개를 유지한다.

---

## 캡처 메커니즘

`UtmCapture` (`src/components/common/UtmCapture.tsx`) Client Component가 레이아웃(`src/app/[locale]/layout.tsx`)의 Suspense 경계 안에 전역 등록되어 있다. 페이지 로드 시 URL의 UTM 파라미터를 읽어 쿠키를 갱신한다.

`useSearchParams()`를 사용하므로 반드시 `<Suspense>` 안에 위치해야 한다.

---

## Salesforce 필드 매핑

폼 제출 시 `readUtmCookie()`로 쿠키를 읽어 API 요청 본문에 포함한다. 서버에서 `toSalesforceFields()`로 변환한다.

| UTM 값 | Salesforce 필드 |
|--------|----------------|
| `recent` 마지막 `source` | `pi__utm_source__c` |
| `recent` 마지막 `medium` | `pi__utm_medium__c` |
| `recent` 마지막 `campaign` | `pi__utm_campaign__c` |
| `recent` 마지막 `content` | `pi__utm_content__c` |
| `recent` 마지막 `term` | `pi__utm_term__c` |
| `first.landing` | `pi__first_touch_url__c` |

---

## 폼별 적용 현황

| 폼 | UTM 적용 |
|----|---------|
| Contact Us | ✅ 적용 완료 |
| Community License | ❌ 미적용 |
| 콘텐츠 다운로드 / 언락 | ❌ 미적용 (Salesforce 연동 없음) |

Community License 폼에 UTM을 적용하려면 `ContactForm.tsx`의 패턴을 참조한다 — `readUtmCookie()`로 쿠키를 읽어 API 요청에 포함하고, 서버에서 `toSalesforceFields()`로 변환해 Salesforce 요청 본문에 merge한다.
