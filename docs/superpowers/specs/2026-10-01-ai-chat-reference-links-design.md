# AI Chat 참고자료 링크 표기 개선 설계

## 문제

Hermes 응답의 참고자료를 추출하는 `src/features/ai-chat/reply.ts`가 제목 없는 일반 URL의 표시명을 `new URL(url).hostname`으로 치환한다. 이 때문에 참고자료가 `docs.querypie.com`처럼 FQDN만 보이고, 사용자가 어떤 문서인지 판단할 수 없다.

## 목표

- 응답에 포함된 Markdown 링크의 문서 제목을 보존한다.
- 제목이 없는 일반 URL은 FQDN으로 축약하지 않고 정규화된 전체 URL을 표시한다.
- 참고자료 목록에서는 문서 제목과 출처 FQDN을 함께 보여 식별 가능성을 높인다.
- 대상 페이지를 추가 조회하지 않고 Hermes가 반환한 정보만 사용한다.

## 설계

### 데이터 추출

`findHermesLinks`와 `extractHermesSources`는 현재의 URL 정규화, HTTP(S) 검증, 중복 제거, 최대 8개 제한을 유지한다.

- Markdown 링크: `[문서 제목](https://example.test/path)`에서 `title`은 `문서 제목`으로 유지한다.
- 일반 URL: `title`은 정규화된 전체 URL을 사용한다.
- Markdown 제목이 비어 있으면 일반 URL과 같은 전체 URL fallback을 사용한다.

### 표시

참고자료 목록의 각 항목은 하나의 외부 링크로 제공한다.

- 제목이 전체 URL과 다른 경우 첫 줄에 제목을 표시하고, 두 번째 줄에 URL의 `hostname`을 보조 출처로 표시한다.
- 제목이 전체 URL인 경우 전체 URL만 표시한다.
- 링크의 `href`는 기존과 같이 같은 사이트 locale 경로 변환을 거친다.
- 긴 URL과 제목은 기존 `overflow-wrap:anywhere` 동작을 유지한다.

### 접근성 및 안전성

- 링크의 accessible name은 제목과 FQDN/URL을 함께 포함해 대상 식별이 가능하도록 한다.
- `rel="noopener noreferrer"`, `target="_blank"`, 프로토콜 검증은 유지한다.
- 응답 본문 내 Markdown 링크 렌더링은 기존 `HermesAnswer` 동작을 유지한다.

## 테스트

- 파서가 Markdown 제목을 유지하는지 검증한다.
- 제목 없는 일반 URL이 전체 URL을 source title로 갖는지 검증한다.
- 제목이 있는 참고자료가 제목과 FQDN을 함께 렌더링하는지 검증한다.
- 제목 없는 참고자료가 전체 URL을 렌더링하는지 검증한다.
- 중복 URL 제거와 기존 API 요청·세션 동작이 유지되는지 관련 테스트로 확인한다.
