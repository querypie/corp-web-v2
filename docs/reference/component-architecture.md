# 컴포넌트 구조와 재사용 기준

2026-11-18 기준 소스의 import·동적 import와 실제 라우트를 확인한 정리입니다.
횟수는 테스트를 제외한 import 파일 수이며, 렌더 횟수나 실제 방문 횟수가 아닙니다.

## 점검 결과

| 항목 | 정리 전 | 정리 후 |
|---|---:|---:|
| TSX 컴포넌트 파일 | 181 | 180 |
| `use client` 진입 파일 | 55 | 53 |
| 테스트 외 코드의 import가 없는 컴포넌트 | 5 | 0 |

이 수치만으로 번들 크기나 속도 개선률을 의미하지는 않습니다. 사용되지 않는 파일은
기존에도 공개 번들에 포함되지 않을 수 있습니다. 정리의 목적은 유지보수 대상과
의존 관계를 줄이고, 실제 브라우저 동작이 필요한 영역만 클라이언트에 두는 것입니다.

## 유지한 공통 컴포넌트

| 컴포넌트 | import 파일 수 | 판단 |
|---|---:|---|
| Cta | 33 | 언어별 CTA·버튼 동작을 공유하므로 유지 |
| Button | 32 | 버튼·링크의 표현과 접근성 일관성을 위해 유지 |
| SectionHeading | 14 | 섹션 제목·설명·타이포 배치를 공유하므로 유지 |
| FeatureMediaList | 13 | 미디어/설명 반복 구조를 공유하되 영상 제어만 클라이언트로 분리 |
| Badge, ExternalLinkIcon | 각각 11 | UI primitive로 유지 |
| ContentDetailPage | 7 | Resources·Demo·News 공통 상세 레이아웃으로 이동 |
| ContentGateOverlay, ContentLeadForm | 각각 4 | 공개 콘텐츠의 동일한 게이팅·리드 수집 동작을 공유 |

한 번만 사용하는 컴포넌트도 독립적인 상호작용, 상태, 접근성, 테스트 책임이 있으면
유지합니다. 반대로 단순 마크업 몇 줄을 감싼다는 이유만으로 파일을 만들지는 않습니다.

## 폴더 기준

```text
components/
  ui/                 도메인에 의존하지 않는 버튼·입력·선택 등 primitive
  layout/             GNB·Footer·Admin shell
  sections/common/    여러 페이지가 공유하는 섹션·제목·브랜드 표현
  content/            콘텐츠 상세·본문·공유·게이팅 UI
  forms/              공유 폼과 필드 조각
  site/               쿠키·언어·테마·분석 등 전역 동작
  pages/
    products/         제품별 조립 컴포넌트·전용 다이어그램·CSS·테스트
    services/         서비스별 조립 컴포넌트·전용 다이어그램·CSS·테스트
    solutions/        솔루션별 구현
    shared/           페이지 간 공통 아이콘·작은 다이어그램 구성요소
    home/japan/       일본 시장 전용 홈 구조
  admin/              CMS 관리 화면
  mockups/            제품 시연용 목업
```

- CTA·미디어 목록·관련 콘텐츠 목록·백서 섹션·인증 카드·SectionHeading은
  `sections/common`에서 관리합니다.
- 콘텐츠 상세 레이아웃은 `content/ContentDetailPage`, 리드폼은
  `forms/ContentLeadForm`에서 관리합니다. 다른 페이지가 `pages/resources`의
  내부 컴포넌트에 의존하지 않도록 합니다.
- QEV·QLM의 공통 입력 박스와 흐르는 연결선은 `pages/shared/AiAgentSource`,
  `pages/shared/DiagramConnector`를 사용합니다. 한 제품이 다른 제품의 CSS를
  직접 가져오지 않습니다.
- 재사용 컴포넌트가 특정 페이지의 이미지나 문구를 기본값으로 몰래 사용하지 않도록
  합니다. FeatureMediaList의 예시 데이터는 제거하고, WhitepaperSection의 이미지는
  호출부에서 명시하도록 했습니다.
- 언어별 정적 문구는 `copy`, 라우트와 저장·조회 같은 동작은 `features`에 둡니다.

## 서버와 클라이언트 경계

FeatureMediaList의 텍스트·이미지 배치는 서버에서 렌더링합니다. 영상이 있을 때에만
FeatureVideoPlayback이 서버에서 만든 내용을 `children`으로 받아 재생을 제어합니다.
영상이 없는 목록에는 재생 제어 컴포넌트가 마운트되지 않습니다.

재생 제어는 화면 중앙에 가까운 영상 하나만 재생하고, 나머지 영상이나 숨겨진 탭의
영상은 정지합니다. 섹션이 해제될 때 이벤트 리스너와 재생 상태를 정리합니다.
브라우저가 자동재생을 허용하지 않는 경우의 Promise 거부도 처리합니다.

## 삭제한 미사용 구현

라우트·정적 import·동적 import·문자열 참조를 확인하고 다음 파일을 제거했습니다.
해당 구현만 검증하던 테스트와 전용 스타일도 함께 제거했습니다. Git 이력으로 복구할 수 있습니다.

- `pages/shared/contentComponents.tsx`: 초기 콘텐츠 변환용 599줄 어댑터. 현재 페이지에서 사용하지 않음.
- `pages/news/NewsDetailClientPage.tsx`: 현재 News 라우트는 서버에서 조회한 결과를 사용함.
- `pages/products/ai-gateway/AiGatewayToolsetDiagram.tsx`: 현재 AIG 화면에서 연결하지 않는 구형 구성도.
- `pages/services/penetration-testing/PentestMethods.tsx`: 현재 서비스 화면에서 연결하지 않는 구형 분석 카드.
- `site/ThemeSwitch.tsx`: 현재 공개 사이트는 locale별 테마를 적용하며 전환 UI를 사용하지 않음.

공통화로 분리한 QEV CSS와 함께 과거 레이아웃의 미참조 선택자도 제거했습니다.
UI primitive인 Switch와 Admin 테마 설정, 테마 유틸리티는 계속 사용하므로 유지합니다.

## 큰 파일을 유지한 이유와 다음 작업 기준

- `mockups/aip/AipMockupShell.tsx`는 제품 시연 화면과 상호작용을 담습니다.
  파일 이동만으로 다운로드량이 줄지는 않습니다. 향후 시연 기능별 로딩 경계를
  분리할 때 사용자 시나리오와 청크 크기를 함께 측정하는 것이 적절합니다.
- `admin/content/AdminManagedContentDetailPage.tsx`와 `content/TiptapEditor.tsx`는
  저장·번역·dirty 상태·편집기 확장 동작이 연결됩니다. 단순 크기 기준의 분리는
  상태 전달과 저장 흐름을 복잡하게 할 수 있으므로 이번 구조 정리에서 유지합니다.
- 일본어 홈의 별도 구조는 시장별 내용 차이를 위한 경계이므로 공통 홈의 옵션으로
  합치지 않습니다.
- `DemoDetailPage`와 `NewsDetailPage`의 작은 래퍼는 분류별 기본 라벨을 지정하는
  진입점입니다. 중복된 렌더링 로직을 갖지 않으므로 유지합니다.

## 반복 점검

```bash
npm run audit:components
npm run audit:components -- --json
```

분석은 TypeScript AST로 `src`의 import·재수출·문자열 동적 import를 추적합니다.
테스트는 사용처 집계에서 제외합니다. import가 없다는 사실은 삭제 후보를 찾는 단서이며,
변수 기반 동적 로딩·외부 registry까지 입증하지 않으므로 삭제 전 실제 라우트를 확인해야 합니다.
타입 import도 집계에 포함됩니다. 크기와 호출 수는 참고 자료이며 자동 삭제 기준이 아닙니다.

구조를 변경한 뒤에는 `typecheck`, 전체 테스트, Next.js build를 실행합니다.
build와 dev 서버는 같은 `.next` 디렉토리를 사용하므로 동시에 실행하지 않습니다.

## 이번 정리의 검증

- 타입 검사와 전체 테스트 135개 파일·1,232개 테스트 통과
- Next.js 프로덕션 빌드 통과
- 프로덕션 서버에서 3개 언어 홈, QEV·QLM과 주요 공통 섹션 렌더링 확인
- QEV·QLM의 3개 언어 데스크톱·모바일 화면에서 페이지 가로 넘침 없음
- Resources·Demo·News 상세 페이지 렌더링 및 AIP 영상 재생 확인
- 위 브라우저 점검에서 페이지 JavaScript 오류 없음
