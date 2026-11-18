# Contact Us 개인정보처리방침 및 안내 수정안

법무·개인정보 담당자 검토용 초안. 기존 방침은 보존하고 2026-11-18 버전을 작성했다. 새 버전은 배포 시 최신 방침으로 표시된다.

## Cloudflare 공식 자료와 추가 문안

2026-11-18 확인. 아래 문안은 공개 자료에 근거한 검토안이며, QueryPie의 실제 계약·처리 지역과 법적 근거를 확정한 공지가 아니다.

| 항목 | 확인 내용 | 출처 |
| --- | --- | --- |
| 제공자 및 역할 | Cloudflare, Inc.는 사이트 보호 목적의 처리자이며, Turnstile 탐지 성능 개선에 대해서는 독립적인 정보처리자로 설명한다. | [Turnstile 개인정보 부속서 §1, §4](https://www.cloudflare.com/turnstile-privacy-policy/) |
| 정보 및 목적 | IP 주소, TLS 지문, User-Agent, 사이트 키와 접속 출처 등을 봇 탐지 및 차단과 탐지 성능 개선에 사용한다. | [Turnstile 개인정보 부속서 §3–4](https://www.cloudflare.com/turnstile-privacy-policy/) |
| 이전 시점·방법 | 문의 페이지의 위젯이 Cloudflare에 연결되고, 제출 시 서버가 토큰과 선택적 IP 주소를 Siteverify로 전송한다. | [클라이언트 렌더링](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), [Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) |
| 국가 | Cloudflare는 고객을 대신해 처리하는 방문자 메타데이터를 미국과 유럽 데이터센터에서 처리한다고 안내한다. Turnstile 신호별 세부 처리 위치는 별도로 공개하지 않는다. | [한국 PIPA FAQ](https://www.cloudflare.com/trust-hub/south-korea-pipa/), [GDPR FAQ](https://www.cloudflare.com/trust-hub/gdpr/), [개인정보 방침 §7](https://www.cloudflare.com/privacypolicy/#7-international-information-transfers) |
| 보유 | Cloudflare는 해당 메타데이터를 제한된 기간 처리한다고 설명하고, 방침과 한국 부속서는 목적 달성에 필요한 기간을 기준으로 한다고 기재한다. Turnstile 신호별 고정 보유 일수는 공개되지 않았다. | [한국 PIPA FAQ](https://www.cloudflare.com/trust-hub/south-korea-pipa/), [개인정보 방침 §11](https://www.cloudflare.com/privacypolicy/#11-data-retention), [한국 부속서 §3](https://www.cloudflare.com/privacypolicy/southkorea-addendum/) |

제3조·제12조 추가 검토 문안:

> 회사는 Contact Us 보안 확인 및 자동화된 악성 요청 방지를 위해 Cloudflare, Inc.의 Turnstile을 이용합니다. 문의 페이지를 불러오고 보안 확인을 수행하는 과정에서 IP 주소, 브라우저 User-Agent, TLS 지문, 사이트 키와 접속 출처 등의 정보가 네트워크를 통해 Cloudflare에 전송·처리될 수 있습니다. Cloudflare는 회사의 웹사이트 보호를 위한 서비스를 제공하며, 별도로 Turnstile의 봇 탐지 기능 개선을 위한 처리도 수행합니다. Cloudflare 개인정보 관련 연락처는 dpo@cloudflare.com입니다. 해당 정보는 처리 목적과 적용되는 계약 및 법령에 필요한 기간 동안 처리됩니다.

**확정 전 필수 확인:** 실제 수탁·계약 법인 및 적용 DPA, 국외 이전의 근거 및 거부 방법·효과, Cloudflare의 독립적 처리에 관한 법적 분류와 고지·동의 필요 여부. 국가와 보유 기간은 Cloudflare 공개 안내를 근거로 기재했으며, 신호별 세부 위치·고정 보유 일수는 비공개다. 토큰 유효기간 5분은 개인정보 보유 기간이 아니다.

변경 비교: [한국어 diff](./privacy-policy-2026-11-18-ko.diff), [영어 diff](./privacy-policy-2026-11-18-en.diff). 일본어는 영어 방침을 사용한다.

## 현행 방침과 폼의 차이

- 현행 방침 제5조는 문의자가 수집에 동의한다고 설명하지만, 폼에는 개인정보 수집 동의 체크박스가 없고 방침 링크를 안내한다. 마케팅 정보 수신 체크박스는 별도의 선택 항목이다.
- 방침은 전화번호를 필수 항목으로 기재하지만 폼에서는 선택 사항이다. 폼은 부서·직책, 문의 종류, 도입 예정 시기, 관심 제품·서비스 및 문의 내용도 필수로 받는다.
- 현행 방침에는 Cloudflare Turnstile의 보안 확인 및 관련 정보 처리에 대한 명시적인 안내가 없다.

## 방침 수정 문안

### 제1조: 처리 목적에 추가

> 회사는 홈페이지 문의 기능을 안전하게 운영하기 위하여 자동화된 악성 요청과 부정 이용을 탐지·방지하고 보안 확인을 수행합니다.

### 제5조: Contact Us 수집 방법 및 항목 수정

> 회사는 이용자가 Contact Us 페이지에서 문의 양식을 작성하고 제출할 때 입력한 정보를 수집합니다.
>
> - 필수 항목: 이름, 성, 회사 이메일, 회사명, 부서·직책, 문의 종류, 도입 예정 시기, 관심 제품·서비스, 문의 내용
> - 선택 항목: 전화번호, 마케팅 정보 수신 동의 여부
> - 처리 목적: 문의 접수 및 응대, 제품·서비스 안내
>
> 마케팅 정보 수신에 동의한 경우에는 별도로 선택한 범위에서 뉴스, 이벤트 및 제품 정보를 안내합니다.

수집·이용의 법적 근거와 보유 기간은 실제 운영 및 적용 법률을 확인하여 기재한다. 기존의 수집 동의 문구를 삭제하는 것만으로 법적 근거가 확보되는 것은 아니다.

### 제5조 또는 제8조: Turnstile 관련 안내 추가

> 회사는 Contact Us 페이지의 보안 확인과 자동화된 악성 요청 방지를 위해 Cloudflare, Inc.의 Turnstile을 사용합니다. 이 과정에서 IP 주소, 브라우저 및 연결 관련 정보(User-Agent, TLS 지문 등), 사이트 키와 접속 출처 등의 정보가 Cloudflare에 의해 처리될 수 있습니다.
>
> Cloudflare는 해당 정보를 회사 웹사이트의 봇 탐지·차단 서비스 제공과 Turnstile의 봇 탐지 기능 개선을 위해 처리한다고 안내하고 있습니다. 자세한 내용은 [Cloudflare Turnstile 개인정보 부속서](https://www.cloudflare.com/turnstile-privacy-policy/)를 확인해 주세요.

### 제3조 및 제12조: 위탁·국외 이전 검토

실제 계약 및 처리 경로를 확인한 후 다음을 기재한다. Cloudflare의 사이트 보호 목적 처리와 자체 서비스 개선 목적 처리의 역할을 구분한다.

| 확인 항목 | 기재할 내용 |
| --- | --- |
| 이전받는 자 및 연락처 | 계약 상대방 법인명과 연락처 확인 |
| 처리·이전 항목 | IP 주소, 브라우저·연결 관련 정보, 사이트 키 및 접속 출처 등 실제 범위 확인 |
| 이전 국가 | 계약 및 서비스 설정 확인 |
| 이전 시점과 방법 | 문의 페이지에서 위젯을 불러오고 이용할 때 네트워크 전송 여부 확인 |
| 목적과 보유 기간 | 각 처리 목적과 Cloudflare의 서비스별 보존 정책 확인 |
| 법적 근거 및 거부 | 적용 법률, 거부 방법과 효과 확인 |

현행 제12조의 고객관리 외 다른 업무는 위탁하지 않는다는 문장과 클라우드 제공자는 고객 개인정보에 접근할 수 없다는 문장도 실제 처리 관계와 대조한다.

## 문의 폼 안내 문안

개인정보처리방침 링크 근처에 추가하는 안:

> 입력하신 정보는 문의 접수와 답변을 위해 사용됩니다. 문의 폼의 보안 확인을 위해 Cloudflare Turnstile이 사용되며, 이 과정에서 IP 주소와 브라우저·연결 관련 정보가 처리될 수 있습니다. 자세한 내용은 개인정보처리방침을 확인해 주세요.

마케팅 체크박스는 선택 항목임을 명시하는 안:

> [선택] QueryPie의 뉴스, 이벤트 및 제품 정보를 받아보겠습니다.

## 확정 전 검토

- 별도 동의 필요 여부와 한국·EU·영국·일본 등 적용 관할의 법적 근거를 확인한다. 안내문은 동의를 대신하지 않는다.
- 동의가 위젯 실행 전에 필요하다면 현재의 페이지 진입 시 위젯 로드 방식을 변경해야 한다.
- 영문 방침과 영어·일본어 폼 안내를 승인된 내용에 맞춰 작성하고 일본어 방침의 영어 대체 사용을 검토한다.
- 새 방침의 시행일, 공지 및 버전 관리 절차를 확인한다. 기존 공개 버전을 덮어쓰지 않는다.
