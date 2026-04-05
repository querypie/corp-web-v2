# Content State Store

어드민에서 변경한 최종 콘텐츠 상태를 파일로 저장합니다.

- 초기값은 `src/content/managed/content-seed.json`, `src/content/demo/content-seed.json`, `src/content/docs/content-seed.json`, `src/content/news/content-seed.json`, news seed를 합쳐 생성합니다.
- 이후에는 이 폴더의 `content-state.json`이 현재 사이트의 최종 상태 source of truth가 됩니다.

파일:

- `content-state.json`
  - 퍼블릭/어드민이 공통으로 읽는 최종 콘텐츠 상태
