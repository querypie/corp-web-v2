# Content State Store

어드민에서 변경한 최종 콘텐츠 상태를 파일로 저장합니다.

- 이 파일이 없으면 앱은 `src/content/**` authored 원본을 직접 읽어 초기 상태를 계산합니다.
- 이후에는 이 폴더의 `content-state.json`이 현재 사이트의 최종 상태 source of truth가 됩니다.

파일:

- `content-state.json`
  - 퍼블릭/어드민이 공통으로 읽는 최종 콘텐츠 상태
