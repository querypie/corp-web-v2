# Managed Content Store

`backup/` 아래의 레거시 MDX를 이 폴더로 복사-import한 결과물을 저장합니다.

## 목적

- `backup/`을 마이그레이션 원본으로만 사용하고 최종 저장소에서는 제거할 수 있게 합니다.
- 레거시 MDX 원문과 locale별 메타데이터를 한 위치에 보존합니다.
- 이후 어드민/CMS는 이 폴더를 기준으로 새 저장소를 읽거나 추가 생성할 수 있습니다.

## 구조

- `index.json`
  - 전체 import 결과 요약 manifest
- `<section>/<category>/<entryId>/meta.json`
  - locale별 메타데이터, legacy 경로, source URL, 콘텐츠 타입
- `<section>/<category>/<entryId>/<locale>.mdx`
  - import된 원본 MDX 파일

예시:

```text
src/content/managed/
  documentation/
    blogs/
      optimize-ec2-costs--19/
        meta.json
        en.mdx
        ko.mdx
        ja.mdx
```

## Import

```bash
npm run import:legacy
```

import가 끝나고 `src/content/managed/`만으로 콘텐츠를 읽을 수 있게 연결되면 `backup/`은 삭제할 수 있습니다.
단, 본문/썸네일이 계속 `/public/...` 자산을 참조하면 `public/` 자산은 유지해야 합니다.
